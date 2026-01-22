import {
    CommandInteraction,
    SlashCommandBuilder
} from "discord.js";

export const data = new SlashCommandBuilder()
    .setName("setReminder")
    .setDescription(
        `
        (WIP) Set the interval at which the
        \`/events\` command is triggered.
        `
    );

export async function execute(
    interaction: CommandInteraction
) {

}
