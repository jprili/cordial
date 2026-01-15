import {
    CommandInteraction,
    SlashCommandBuilder,
    GuildScheduledEventManager
} from "discord.js";

export const data = new SlashCommandBuilder()
    .setName("events")
    .setDescription("Obtain event info");

export async function execute(
    interaction: CommandInteraction
) {
    // @ts-ignore
     let eventManager = new GuildScheduledEventManager(
         interaction.guild
     );
    let events = await eventManager.fetch()
    return interaction.reply(
        `\`\`\`json\n${JSON.stringify(events, null , 2)}\`\`\``
    )
}
