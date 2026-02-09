const util = require("node:util");
const execFile = 
    util.promisify(require("node:child_process").execFile);

const {
    CommandInteraction, 
    SlashCommandBuilder,
    SlashCommandSubcommandBuilder,
    SlashCommandIntegerOption,
    SlashCommandUserOption
}  = require("discord.js");

const STATS_FILE_NAME = "src/ocaml/stats.txt";
const ELO_EXEC = "src/ocaml/elo"

/**
 * Build the slash-command for the Elo
 * portion of the bot.
 */
export const data = new SlashCommandBuilder()
    .setName("elo")
    .setDescription("Prefix for the Elo sub-commands.")
    .addSubcommand((sc: typeof SlashCommandSubcommandBuilder) => 
        sc.setName("match")
            .setDescription("Add a result of a match")
            .addUserOption(
                (opt: typeof SlashCommandUserOption) => 
                opt.setName("winner")
                .setDescription("The winner of the match")
                .setRequired(true)
            )
            .addUserOption(
                (opt:typeof SlashCommandUserOption) => 
                opt.setName("loser")
                .setDescription("The loser of the match")
                .setRequired(true)
        )
    )
    .addSubcommand(
        (sc: typeof SlashCommandSubcommandBuilder) => 
        sc.setName("leaderboard")
        .setDescription("Show the current leaderboard")
        .addIntegerOption(
            (opt: typeof SlashCommandIntegerOption) => 
            opt.setName("top")
            .setDescription("number of rows to show")
        )
    )
    .addSubcommand(
        (sc: typeof SlashCommandSubcommandBuilder) => 
        sc.setName("stats")
        .setDescription("Show player stats")
        .addUserOption(
            (opt: typeof SlashCommandUserOption) => 
            opt.setName("player")
            .setDescription("the user to see the stat of")
            .setRequired(true)
        )
    );

/**
 * Handle the addition logic.
 */
const handleMatch = 
    async (interaction: typeof CommandInteraction) => {
        const winner: String = 
            interaction.options.getUser("winner");
        const  loser: String = 
            interaction.options.getUser("loser");
        if (winner == loser) {
            return "winner and loser must be different users"
        }
        const { stdout } = await execFile(ELO_EXEC, 
            ["match", STATS_FILE_NAME, winner, loser]);
        return stdout;
};

/**
 * Handle the leaderboard logic.
 */
const handleLeaderboard = 
    async (interaction: typeof CommandInteraction) => {
        const n: number = 
            interaction.options.getInteger("top") ?? 10;
        const { stdout } = await execFile(ELO_EXEC, 
            ["leaderboard", STATS_FILE_NAME]);
        return stdout;
};

/**
 * Handle the stat command
 */
const handleStats = 
    async (interaction: typeof CommandInteraction) => {
        const player: String = 
            interaction.options.getUser("player");
        const { stdout } = await execFile(ELO_EXEC, 
            ["stats", STATS_FILE_NAME, player]);
        return stdout;
};

/**
 * Function map 
 */
const functions: { [k: string]: any } = {
    "match": handleMatch,
    "leaderboard": handleLeaderboard,
    "stats": handleStats
};

export async function execute(
    interaction: typeof CommandInteraction
) {
    const handler = functions[
        interaction.options.getSubcommand()
    ];
    return interaction.reply(await handler(interaction));
}

