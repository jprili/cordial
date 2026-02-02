import {
    PartialGuildScheduledEvent,
    GuildScheduledEvent
} from "discord.js";

import {
    createCourse
} from "./Course";

interface PartialDeadline {
    courseFaculty: string; 
    courseNumber:  number; 
    name?:         string;
    start?:          Date;
    end?:            Date;
}

const SECOND_MS: number = 1000;
const DAY_MS:    number = 24 * 60 * 60 * SECOND_MS;
const WEEK_MS: number = 7 * DAY_MS;

const getDefaultDateStart = () => 
    Date.now();
const getDefaultDateEnd = (
    startTimestamp: number = getDefaultDateStart()
) => 
    startTimestamp + WEEK_MS;

const getFacultyAndNumberFromLocation = 
    (input: GuildScheduledEvent | null) => {
    const location: string = input?.entityMetadata?.location 
            ?? "NULL 0000";
    const matches = location.match(/(\w{4})\s+(\d{4})/)
            ?.slice(1, 3) ?? ["NULL", "0000"];
    return createCourse(matches[0], parseInt(matches[1]))
}

export type Deadline = Required<PartialDeadline>;
export const create = (args: PartialDeadline): Deadline => {
    return {
        start: new Date(getDefaultDateStart()),
        end:   new Date(getDefaultDateEnd()),
        name:  "No name specifed.",
        ...args
    };
};

export const fromDiscordEvent = (
    event: GuildScheduledEvent
) => {
    let course = 
        getFacultyAndNumberFromLocation(event);
    return create({
        start: new Date(
            event.scheduledStartTimestamp 
            ?? getDefaultDateStart()
        ),
        end: new Date(
            event.scheduledEndTimestamp
            ?? getDefaultDateEnd()
        ),
        name:  event.name ?? "",
        courseFaculty: course.faculty,
        courseNumber:  course.num
    })
}

export const toDiscordMessage = (
    deadline: Deadline
) => {
    const { courseFaculty, courseNumber, name, start, end }
        = deadline;
    const unixSeconds =
        Math.floor(new Date(end).getTime() / SECOND_MS);
    return `${courseFaculty} ${courseNumber}: ${name}, <t:${unixSeconds}>`
}
