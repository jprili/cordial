const {
    CommandInteraction, 
    SlashCommandBuilder,
    SlashCommandSubcommandBuilder,
    SlashCommandIntegerOption,
    SlashCommandUserOption
}  = require("discord.js");

/**
 * Build the slash-command for the Elo
 * portion of the bot.
 */
export const data = new SlashCommandBuilder()
    .setName("elo")
    .setDescription("Prefix for the Elo sub-commands.")
    .addSubcommand((sc: typeof SlashCommandSubcommandBuilder) => 
        sc.setName("add")
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
    );

/**
 * Handle the addition logic.
 */
const handleAdd = 
    (interaction: typeof CommandInteraction) => {
        const winner = interaction.options.getUser("winner");
        const  loser = interaction.options.getUser("loser");
        return `received add: ${winner}, ${loser}`
};

/**
 * Handle the leaderboard logic.
 */
const handleLeaderboard = 
    (interaction: typeof CommandInteraction) => {
        const _top = interaction.options.getInteger("top") ?? 10;
        return `received leaderboard: top = ${_top}`

};

/**
 * Function map 
 */
const functions: { [k: string]: any } = {
    "add": handleAdd,
    "leaderboard": handleLeaderboard
};

export async function execute(
    interaction: typeof CommandInteraction
) {
    const handler = functions[
        interaction.options.getSubcommand()
    ];
    return interaction.reply(handler(interaction));
}

