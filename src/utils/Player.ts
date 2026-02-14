const util = require("node:util");
const execFile = 
    util.promisify(require("node:child_process").execFile);

const {
    Embed,
    EmbedBuilder,
    User,
    CommandInteraction
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
        title: "",
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

const parseMatch = (stdout: string) => {
    const matches = 
        stdout.match(
        /(<@\d+>) \(\d+\) beat (<@\d+>) \(\d+\) \[shift: (\d+)\]/
        ) ?? [];

    return {
        winPlayer:  matches[1],
        lossPlayer: matches[2],
        winElo:     parseInt(matches[3]),
        lossElo:    parseInt(matches[4]),
        shift:      parseInt(matches[5])
    }
}

/**
 * Handle the addition logic.
 */
export const setMatch = 
    async (interaction: typeof CommandInteraction) => {
        const winner = interaction.options.getUser("winner");
        const loser  = interaction.options.getUser("loser");
        if (winner == loser) {
            throw {
                message: "winner and loser must be different",
                error: new Error()
            }
        }
        const { stdout } = await execFile(ELO_EXEC, 
            ["match", STATS_FILE_NAME, winner, loser]);

        const { winElo, lossElo, shift } = parseMatch(stdout);
        return {
        color: 0x4bb543,
        title: "Match result",
        description: "Match result recorded.",
        fields: [
            {
                name: "W",
                value: winner
            },
            {
                name: "new elo",
                value: `${winElo} (${shift})`,
                inline: true
            },
            {
                name: "L",
                value: loser
            },
            {
                name: "new elo",
                value: `${winElo} (${-shift})`,
                inline: true
            },
        ],
            timestamp: new Date().toISOString()
    };
}

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
export const getStats = 
    async (playerName: string) => {
        const { stdout } = await execFile(ELO_EXEC, 
            ["stats", STATS_FILE_NAME, playerName]);
        return stdout;
};

/**
 * Function map.
 * Each function takes in an interaction
 * and either should reply with text
 * or embed.
 */
const functions: { [k: string]: any } = {
    "match": setMatch,
    "leaderboard": getLeaderboard,
    "stats": getStats
};

/**
 * Handle interaction from Discord.
 */
export const handle = (interaction: typeof CommandInteraction):
    string | typeof Embed => {
    return functions[interaction.getSubcommand()](interaction);
}
