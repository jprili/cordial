import { 
    Client,
    GatewayIntentBits,
    Channel,
    TextChannel,
    CategoryChannel
} from "discord.js";

import { config } from "./config";
import { commands } from "./commands";
import { deployCommands } from "./deploy";
import { notifyUsers } from "./onGuildEventCreate"

const client = new Client({
    intents: [
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildScheduledEvents
    ]
})

const findTextChannel = 
    (client: Client, name: string): TextChannel => {

    // @ts-ignore
    return client.channels.cache
        .find((channel: Channel) => 
            !(channel instanceof CategoryChannel)
            && (channel instanceof TextChannel)
            && channel.name == name) ?? null;
}

client.once(
    "clientReady",
    () => {
        console.log("Bot ready.")
        deployCommands()
    }
)

client.on(
    "interactionCreate",
    async (interaction) => {
        if (!interaction.isCommand()) {
            return;
        }
        const { commandName } = interaction;
        let aux = commands[
            commandName as keyof typeof commands
        ];
        if (aux) {
            aux.execute(interaction);
        }
    }
)

client.on(
    "guildScheduledEventCreate",
    async (newEvent) => {
        const message: string = await notifyUsers(newEvent);
        const channel: TextChannel = findTextChannel(
            client,
            "deadlines");
        channel.send(message);
    }
)

client.login(config.DISCORD_TOKEN);

