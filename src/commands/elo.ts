const {
    CommandInteraction, 
    SlashCommandBuilder,
    SlashCommandSubcommandBuilder,
    SlashCommandIntegerOption,
    SlashCommandUserOption,
    Embed
} = require("discord.js");

const {
    Player,
    handle
} = require("../utils/Player");

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


export async function execute(
    interaction: typeof CommandInteraction
) {

    let result: string | typeof Embed;
    let ephemeral: boolean = false;
    try {
        result = await handle(interaction);
    } catch (e) {
        if (e instanceof Error) {
            result = e.message;
            ephemeral = !ephemeral;
        }
    }

    switch (typeof result) {
        case "string":
            return interaction.reply({ content: result, ephemeral: ephemeral });
        default:
            return interaction.reply({ embeds: [result] });
    }

}

