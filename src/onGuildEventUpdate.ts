import {
    GuildScheduledEvent,
    PartialGuildScheduledEvent
} from "discord.js";

import {
    Deadline,
    fromDiscordEvent,
    toDiscordMessage
} from "./utils/Deadline";

let buildNewString = (
    newEvent: GuildScheduledEvent
): string => {
    return `New deadline:\n
    ${toDiscordMessage(fromDiscordEvent(newEvent))}`;
}

let buildUpdateString = (
    oldEvent: GuildScheduledEvent,
    newEvent: GuildScheduledEvent
): string => {
    const oldDeadline = fromDiscordEvent(oldEvent) ?? "";
    const newDeadline = fromDiscordEvent(newEvent);
    return `Deadline changed:\n 
    ${toDiscordMessage(oldDeadline)} ->
    ${toDiscordMessage(newDeadline)}`;
}

export async function notifyUsers(
    newEvent: GuildScheduledEvent
) {
    return buildNewString(newEvent);
}
