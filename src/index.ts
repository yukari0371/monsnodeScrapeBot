import fs from "fs/promises";
import { monsnode } from "./monsnode/src";
import "dotenv/config";
import { ActivityType, Client, GatewayIntentBits, TextChannel } from "discord.js";
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessages
    ]
});

let threads: boolean = false;

client.once("ready", async () => {
    console.log(`Logged in as: ${client.user?.tag}`);
    client.user?.setPresence({
        activities: [{ name: `discord.js v14`, type: ActivityType.Watching }],
        status: 'dnd',
    });
});

client.on("messageCreate", async (message) => {
    if (message.author.bot) return;
    if (message.content === "!rtwv") {
        await new Promise(resolve => {
            const itnerval = setInterval(() => {
                if (!threads) resolve("");
            }, 500);
        });
        if (message.channel instanceof TextChannel && !message.channel.nsfw) return await message.reply({
            embeds: [
                {
                    title: "not nsfw channel",
                    description: "Please use on nsfw channel.",
                    color: 15548997
                }
            ]
        });
        threads = true;
        const result = await monsnode.getRandom();
        if (result.status === "error") return await message.reply({
            embeds: [
                {
                    title: "Error",
                    description: "unknown error.",
                    color: 15548997
                }
        ]});
        await message.reply({
            embeds: [
                {
                    title: "Random video",
                    description: `videoUrl: ${result.videoUrl}\ntweetLink: ${result.tweetUrl}`,
                    image: {
                        url: result.videoImage as string
                    }
                }
            ]
        });
        await fs.appendFile("data/log.txt", `${message.author.id}: ${Date.now()}\n`);
        await new Promise(resolve => setTimeout(resolve, 10000));
        return threads = false;
    }
});

client.login(process.env.DISCORD_TOKEN);