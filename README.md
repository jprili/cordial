# CordialBot
Schoolwork management system for Discord groups.

# Purpose
The goal for this app is to add deadline tracking for Discord users.
In Discord, we can create events as de-facto deadlines,
but managing them takes a lot of clicks and work.

# Commands
* `/events` - get all the upcoming deadlines.
* `/elo`
    - `match <winner:user> <loser:user>`: adjust the `winner` and `loser`
    stats.
    - `leaderboard [<top:int>]`: show the `top` number of players.
    - `stats <player:user>`: show the Elo rating, 
    number of games played, and winrate of `player`.
