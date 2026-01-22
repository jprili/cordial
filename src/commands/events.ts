const {
    CommandInteraction,
    SlashCommandBuilder,
    PermissionFlagsBits
} = require("discord.js");

import {
    fetchDeadlines
} from "../DeadlineManager";

import {
    Deadline
} from "../utils/Deadline"

const SECOND_MS = 1000;
const DAY_MS    = 24 * 60 * 60 * SECOND_MS;
const DAYS      = 14;

const buildReplyMessage = (deadlines: Array<Deadline>) => {
    const cleanDeadlines: Array<Deadline> = deadlines
        .filter((d) => d.courseNumber != 0)
        .filter((d) => {
            return (+d.end - Date.now() < 
                (DAYS * DAY_MS))
        })
        .sort(
            (a: Deadline, b: Deadline) => {
                return +a.end - +b.end
            }
        )
    let replyMessage = "Due work in the next two weeks:\n";
    for (const d of cleanDeadlines) {
        const { courseFaculty, courseNumber, name, start, end } 
            = d; 
        const unixSeconds = 
            Math.floor(new Date(end).getTime() / SECOND_MS);
        replyMessage += 
            `* ${courseFaculty} ${courseNumber}: ${name}, 
               <t:${unixSeconds}>\n`
    }
    return replyMessage;
}

export const data = new SlashCommandBuilder()
    .setName("events")
    .setDescription("Obtain event info")
    .setDefaultMemberPermissions(
        PermissionFlagsBits.ManageEvents
    );

export async function execute(
    interaction: typeof CommandInteraction
) {
    let events = await fetchDeadlines(interaction.guild);
    if (!events.length) {
        return interaction.reply("No events set.");
    }
    return interaction.reply(
        buildReplyMessage(events)
    );
}
