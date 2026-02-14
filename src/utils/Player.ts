const util = require("node:util");
const execFile = 
    util.promisify(require("node:child_process").execFile);

const {
    Embed,
    EmbedBuilder,
    User
} = require("discord.js");

const STATS_FILE_NAME = "src/ocaml/stats.txt";
const ELO_EXEC = "src/ocaml/elo"

/**
 * A Player, which has a userID,
 * their elo rating, the number of games (plays)
 * and the number of wins.
 */
interface Player {
    userID:   string,
    rating:   number,
    numPlays: number,
    numWins:  number
}

/**
 * Colour associated with the Player's place.
 * Usually attached to the embed.
 */
enum RankingColor {
    Gold   = 0xffdc73,
    Silver = 0xc0c0c0,
    Bronze = 0xbf9b30,
    Coal   = 0x000000
}

/**
 * Handle the addition logic.
 */
export const getMatch = 
    async (winner: string, loser: string) => {
        if (winner == loser) {
            throw "winner and loser must be different users"
        }
        const { stdout } = await execFile(ELO_EXEC, 
            ["match", STATS_FILE_NAME, winner, loser]);
        return stdout;
};

/**
 * Handle the leaderboard logic.
 */
export const getLeaderboard = 
    async (n: number = 10) => {
        const { stdout } = await execFile(ELO_EXEC, 
            ["leaderboard", STATS_FILE_NAME]);
        return stdout;
};

/**
 * Handle the stat command
 */
const getStats = 
    async (player: String) => {
        const { stdout } = await execFile(ELO_EXEC, 
            ["stats", STATS_FILE_NAME, player]);
        return stdout;
};


/**
 * Parses the string into a Player object.
 */
export const playerFromString = (stdout: string): Player => {
    if (!stdout) throw "Empty string.";
    const tokens: string[] = stdout.split("|").map(
        (token: string) => 
            !token.includes(":") 
            ? token.trim()
            : token.split(":")[1].trim()
    );
    return {
        userID:   tokens[0],
        rating:   parseInt(tokens[1]),
        numPlays: parseInt(tokens[2]),
        numWins:  parseInt(tokens[3]) 
    }
}

export const parseLeaderboard = (stdout: string): Player[] => {
    return stdout.split("\n").map(
        (line: string) => 
            playerFromString(line.replace(/^\d+\./, ""))
    );
}

const getRankingColour = (rank: number) => {
    switch (rank) {
        case 1: return RankingColor.Gold
        case 2: return RankingColor.Silver
        case 3: return RankingColor.Bronze
        default: 
            return RankingColor.Coal
    }
}

const getNameFromUserID = (player: Player): string => {
    // TODO
    return ""
}

export const embedFromStat = 
    (player: Player, leaderboard: Player[]) => {
        const playerRanking: number = leaderboard.map(
            _player => _player.userID
        ).indexOf(player.userID);
    return {
        color: getRankingColour(playerRanking),
        title: getNameFromUserID(client, player),
        author: {
            name: "Player Card"
        },
        thumbnail: {
            url: "https://picsum.photos/200/200"
        },
        fields: [
            {
              name: "Rating",
              value: player.rating,
              inline: true
            },
            {
              name: "Plays",
              value: player.numPlays,
              inline: true
            },
            {
              name: "Wins",
              value: player.numWins,
              inline: true
            },
            {
              name: "Winrate",
              value: player.numWins / player.numPlays
            }
        ]
    }
}
