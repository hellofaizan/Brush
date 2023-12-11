const { Client, GatewayIntentBits, EmbedBuilder, PermissionsBitField, Permissions, MessageManager, Embed, Collection, ActivityType } = require(`discord.js`);
const fs = require('fs');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
const Jimp = require('jimp');

client.commands = new Collection();

require('dotenv').config();

const functions = fs.readdirSync("./src/functions").filter(file => file.endsWith(".js"));
const eventFiles = fs.readdirSync("./src/events").filter(file => file.endsWith(".js"));
const commandFolders = fs.readdirSync("./src/commands");

(async () => {
    for (file of functions) {
        require(`./functions/${file}`)(client);
    }
    client.handleEvents(eventFiles, "./src/events");
    client.handleCommands(commandFolders, "./src/commands");
    client.login(process.env.token)
})();

client.on("ready", () => {
    console.log(`\u001b[1;32m Logged in as ${client.user.tag}! \u001b[0m`);
    client.user.setActivity("for HEX in chat", { type: ActivityType.Watching });
    client.user.setStatus("dnd");
});

// on join new guild, send a message to any public channel
client.on("guildCreate", async (guild) => {
    console.log(`\u001b[1;32m Joined ${guild.name}! \u001b[0m`);
    // send message to join webhook from env
    const webhook = await client.fetchWebhook(process.env.joinWebhookId, process.env.joinWebhookToken);
    await webhook.send(`Joined ${guild.name}! I am now in ${client.guilds.cache.size} servers.`);


    const channel = guild.channels.cache.find(channel => channel.permissionsFor && channel.type === 0 && channel.permissionsFor(client.user.id).has([PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ViewChannel]));
    if (channel) {
        const embed = {
            title: "Thanks for inviting me!",
            description: "A simple [Open Source](https://github.com/Youth-Icon/Brush) bot always looking for HEX codes or RGB codes in chat. Try typing `#ff0000` or `rgb(255, 0, 0)` in chat.",
            fields: [
                {
                    name: "Support",
                    value: "[Join the support server](https://discord.gg/vUHMxPvege)",
                    inline: true
                },
                {
                    name: "Developer",
                    value: "https://hellofaizan.me",
                    inline: true
                }
            ],
            color: 0xc2c2fb,
            thumbnail: {
                url: "https://cdn.discordapp.com/attachments/1065518726855807067/1183670595444015115/442e047d3e46dfb978e85b07a4be0457.webp?ex=65892e25&is=6576b925&hm=4071092e6b6984d34d87d57c9679667cb544c3164b2f37b1c22d5de774dd34a7"
            },

        }
        channel.send({ embeds: [embed] });
    }

});

// keep an eye on messages, if anu message contains Hex Color code or rgb color code, send the color
client.on("messageCreate", async (message) => {
    if (message.author.bot) return;
    const hex = message.content.match(/#(?:[0-9a-fA-F]{3}){1,2}/g);
    const rgb = message.content.match(/rgb\((\d{1,255}), (\d{1,255}), (\d{1,255})\)/g);
    // color code having 0x in front of it
    //  const xhex = message.content.match(/0x(?:[0-9a-fA-F]{3}){1,2}/g);
    if (hex) {
        new Jimp(200, 50, hex[0], (err, img) => {
            if (err) throw err;
            img.getBuffer(Jimp.MIME_PNG, (err, buffer) => {
                if (err) throw err;
                // reply to the message with the color code and buffer image
                message.reply({ content: `${hex[0]}`, files: [buffer] });
            });
        });
    }
    if (rgb) {
        const rgbArray = rgb[0].replace(/rgb\((\d{1,3}), (\d{1,3}), (\d{1,3})\)/g, "$1 $2 $3").split(" ");
        new Jimp(200, 50, `rgb(${rgbArray[0]}, ${rgbArray[1]}, ${rgbArray[2]})`, (err, img) => {
            if (err) throw err;
            img.getBuffer(Jimp.MIME_PNG, (err, buffer) => {
                if (err) throw err;
                // reply to the message with the color code and buffer image
                message.reply({ content: `${rgb[0]}`, files: [buffer] });
            });
        });
    }
    // TODO: make hlx color code work
});