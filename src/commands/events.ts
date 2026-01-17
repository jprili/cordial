import {
    CommandInteraction,
    SlashCommandBuilder
} from "discord.js";

import {
    fetchDeadlines
} from "../DeadlineManager";

import {
    Deadline
} from "../utils/Deadline"

const buildReplyMessage = (deadlines: Array<Deadline>) => {
    const cleanDeadlines: Array<Deadline> = deadlines
        .filter((d) => d.courseNumber != 0)
        .sort(
            (a: Deadline, b: Deadline) => {
                if (a.courseFaculty < b.courseFaculty) {
                    return 1;
                } else if  (a.courseFaculty > b.courseFaculty) {
                    return -1;
                } else if (a.courseNumber != b.courseNumber) {
                    return a.courseNumber - b.courseNumber;
                } else if (a.start != b.start) {
                    return +a.start - +b.start
                } else {
                    return +a.end - +b.end
                }
            }
        )
    let replyMessage = "";
    for (const d of cleanDeadlines) {
        const { courseFaculty, courseNumber, name, start, end } 
            = d; 
        const unixSeconds = 
            Math.floor(new Date(start).getTime() / 1000);
        replyMessage += 
            `* ${courseFaculty} ${courseNumber}: ${name}, 
               <t:${unixSeconds}>\n`
    }
    return replyMessage;
}

export const data = new SlashCommandBuilder()
    .setName("events")
    .setDescription("Obtain event info");

export async function execute(
    interaction: CommandInteraction
) {
    let events = await fetchDeadlines(interaction.guild);
    if (!events.length) {
        return interaction.reply("No events set.");
    }
    return interaction.reply(
        buildReplyMessage(events)
    );
}
