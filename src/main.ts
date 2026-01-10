import { 
    Client,
    GatewayIntentBits
} from "discord.js";

import { config } from "./config";
import { commands } from "./commands";
import { deployCommands } from "./deploy";

const client = new Client({
    intents: [
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildScheduledEvents
    ]
})

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

client.login(config.DISCORD_TOKEN);
