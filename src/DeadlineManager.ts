import {
    CommandInteraction,
    GuildScheduledEventManager,
    Guild,
    GuildScheduledEvent
} from "discord.js";

import {
    Deadline,
    create
} from "./utils/Deadline";

import { Course, createCourse } from "./utils/Course";

const getFacultyAndNumberFromLocation = 
    (input: GuildScheduledEvent | null) => {
    const location: string = input?.entityMetadata?.location 
            ?? "NULL 0000";
    const matches = location.match(/(\w{4})\s+(\d{4})/)
            ?.slice(1, 3) ?? ["NULL", "0000"];
    return createCourse(matches[0], parseInt(matches[1]))
}

export const fetchDeadlines = 
    async (guild: Guild | null):
        Promise<Array<Deadline>> => {
    if (guild == null) {
        throw TypeError
    };

    // @ts-ignore
    // eventManager *has* a public constructor.
    const eventManager = new GuildScheduledEventManager(
        guild
    );
    return JSON.parse(
        JSON.stringify(await eventManager.fetch()) ?? []
    ).map(
        (obj: any) => {
            const course 
                = getFacultyAndNumberFromLocation(obj);
            return create({
                start: new Date(obj.scheduledStartTimestamp),
                end:   new Date(obj.scheduledEndTimestamp),
                name:  obj.name,
                courseFaculty: course.faculty,
                courseNumber:  course.num
            })
        }
    );
}

