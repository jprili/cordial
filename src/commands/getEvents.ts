import {
    CommandInteraction,
    SlashCommandBuilder,
    GuildScheduledEventManager
} from "discord.js";

export const data = new SlashCommandBuilder()
    .setName("getEvents")
    .setDescription("Obtain event info");

export async function execute(
    interaction: CommandInteraction
) {
    let eventManager = new GuildScheduledEventManager(
        interaction.guild
    );
    console.log(eventManager.fetch())
}
