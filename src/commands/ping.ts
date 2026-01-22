const {
    CommandInteraction, 
    SlashCommandBuilder
} = require("discord.js");

export const data = new SlashCommandBuilder()
    .setName("ping")
    .setDescription("pong");

export async function execute(
    interaction: typeof CommandInteraction
) {
    return interaction.reply("Pong!");
}
