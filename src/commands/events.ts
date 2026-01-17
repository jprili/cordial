import {
    CommandInteraction,
    SlashCommandBuilder
} from "discord.js";

import {
    fetchDeadlines
} from "../DeadlineManager";

export const data = new SlashCommandBuilder()
    .setName("events")
    .setDescription("Obtain event info");

export async function execute(
    interaction: CommandInteraction
) {
    let events = await fetchDeadlines(interaction.guild);
    console.log(events);
    if (!events.length) {
        return interaction.reply("No events set.");
    }
    return interaction.reply(
        `\`\`\`json\n${JSON.stringify(events, null , 2)}\`\`\``
    )
}
