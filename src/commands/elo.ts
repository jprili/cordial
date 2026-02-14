const {
    CommandInteraction, 
    SlashCommandBuilder,
    SlashCommandSubcommandBuilder,
    SlashCommandIntegerOption,
    SlashCommandUserOption
} = require("discord.js");

const {
    Player,
    getMatch,
    getLeaderboard,
    getStats
} = require("utils/Player");

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
 * Function map 
 */
const functions: { [k: string]: any } = {
    "match": getMatch,
    "leaderboard": getLeaderboard,
    "stats": getStats
};

export async function execute(
    interaction: typeof CommandInteraction
) {
    const handler = functions[
        interaction.options.getSubcommand()
    ];
    return interaction.reply(await handler(interaction));
}

