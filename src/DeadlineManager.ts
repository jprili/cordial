import {
    CommandInteraction,
    GuildScheduledEventManager,
    Guild
} from "discord.js";

import {
    Deadline,
    create
} from "./utils/Deadline";

export const fetchDeadlines = 
    async (guild: Guild | null):
        Promise<Array<Deadline>> => {
    if (guild == null) {
        throw TypeError
    };

    // @ts-ignore
    const eventManager = new GuildScheduledEventManager(
        guild
    );
    return JSON.parse(
        JSON.stringify(await eventManager.fetch()) ?? []
    );
}

export const showDeadlines = async (guild: Guild) => {
    // @ts-ignore
    // Possible Undefined, but already handled by ??.
    return await this.fetchDeadlines(guild) ?? [];
}
