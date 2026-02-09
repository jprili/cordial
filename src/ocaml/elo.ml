(* Author: Madison Lovett
   Date: Feb 8th, 2026*)

(* Sorta silly idea for tracking and calculating elo, its weighted at 32 with the starting
   elo being 1600. ie, 2 new players should result in 1584 and 1616. Same as MGE, iykyk...
   Also stores numerical historical game win/loss amounts. *)

type player = { id : string; elo : float; games : int; wins : int }

(* elo calc *)
let elo_shift winner_elo loser_elo =
  let expected = 1. /. (1. +. (10. ** ((loser_elo -. winner_elo) /. 400.))) in
  32. *. (1. -. expected)

(* generic db functions from here to score_db *)
let rec db_read ic =
  try
    let line = input_line ic in
    let entry =
      match String.split_on_char ':' line with
      | [ id; elo; games; wins ] ->
          {
            id;
            elo = float_of_string elo;
            games = int_of_string games;
            wins = int_of_string wins;
          }
      | _ -> failwith "invalid line format"
    in
    entry :: db_read ic
  with End_of_file ->
    close_in ic;
    []

let db_load db_file = try db_read (open_in db_file) with Sys_error _ -> []

let db_write db_list out_file =
  let oc = open_out out_file in
  List.iter
    (fun p -> Printf.fprintf oc "%s:%.0f:%d:%d\n" p.id p.elo p.games p.wins)
    db_list;
  close_out oc

let ensure_player db_list player_id =
  if List.exists (fun p -> p.id = player_id) db_list then db_list
  else { id = player_id; elo = 1600.0; games = 0; wins = 0 } :: db_list

let rec get_player_elo db_list player_id =
  match db_list with
  | [] -> failwith "no such player_id in db"
  | p :: rest ->
      if p.id = player_id then p.elo else get_player_elo rest player_id

let rec get_player db_list player_id =
  match db_list with
  | [] -> None
  | p :: rest -> if p.id = player_id then Some p else get_player rest player_id

let print_player p =
  Printf.printf
    "%s | elo: %.0f | games: %d | wins: %d | losses: %d | winrate: %.0f%%\n"
    p.id p.elo p.games p.wins (p.games - p.wins)
    (if p.games > 0 then float_of_int p.wins /. float_of_int p.games *. 100.
     else 0.)

(* entry point for scoring player with database, winner_id, loser_id *)
let score_db db_file winner_id loser_id =
  let db_list = db_load db_file in
  let db_list = ensure_player db_list winner_id in
  let db_list = ensure_player db_list loser_id in
  let w_elo = get_player_elo db_list winner_id in
  let l_elo = get_player_elo db_list loser_id in
  let shift_amnt = elo_shift w_elo l_elo in
  let updated_db =
    List.map
      (fun p ->
        if p.id = winner_id then
          {
            p with
            elo = p.elo +. shift_amnt;
            games = p.games + 1;
            wins = p.wins + 1;
          }
        else if p.id = loser_id then
          { p with elo = p.elo -. shift_amnt; games = p.games + 1 }
        else p)
      db_list
  in
  db_write updated_db db_file;
  Printf.printf "recorded: %s (%.0f) beat %s (%.0f) [shift: %.0f]\n" winner_id
    (w_elo +. shift_amnt) loser_id (l_elo -. shift_amnt) shift_amnt

(* entry point for player stats printing *)
let stats db_file player_id =
  let db_list = db_load db_file in
  match get_player db_list player_id with
  | Some p -> print_player p
  | None -> Printf.printf "player %s not found\n" player_id

(* entry point for top3 leaderboard *)
let leaderboard db_file =
  let db_list = db_load db_file in
  let sorted = List.sort (fun a b -> compare b.elo a.elo) db_list in
  let top_3 = List.filteri (fun i _ -> i < 3) sorted in
  List.iteri
    (fun i p ->
      Printf.printf "%d. " (i + 1);
      print_player p)
    top_3

(* args *)
let () =
  match Array.to_list Sys.argv with
  | [ _; "match"; db; winner; loser ] -> score_db db winner loser
  | [ _; "stats"; db; player ] -> stats db player
  | [ _; "leaderboard"; db ] -> leaderboard db
  | _ ->
      Printf.printf
        "usage:\n\
        \  elo match <db> <winner> <loser>\n\
        \  elo stats <db> <player>\n\
        \  elo leaderboard <db>\n"
