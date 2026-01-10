import {
    CommandInteraction, SlashCommandBuilder
} from "discord.js";

export const data = new SlashCommandBuilder()
    .setName("ping");

export const execute = (interaction: CommandInteraction) => {
    return interaction.reply("Pong!");
}
