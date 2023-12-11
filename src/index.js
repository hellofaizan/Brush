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

// keep an eye on messages, if anu message contains Hex Color code or rgb color code, send the color
client.on("messageCreate", async (message) => {
    if (message.author.bot) return;
    const hex = message.content.match(/#(?:[0-9a-fA-F]{3}){1,2}/g);
    const rgb = message.content.match(/rgb\((\d{1,255}), (\d{1,255}), (\d{1,255})\)/g);
    // color code having 0x in front of it
    const xhex = message.content.match(/0x(?:[0-9a-fA-F]{3}){1,2}/g);
    // hlx color code is made by color percentage, so it can be any number between 0 and 100
    //? const hlx = message.content.match(/hlx\((\d{1,3}), (\d{1,3}), (\d{1,3})\)/g);
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
    if (xhex) {
        const xhexArray = xhex[0].replace(/0x([0-9a-fA-F]{3}){1,2}/g, "$1").split("");
        new Jimp(200, 50, `#${xhexArray[0]}${xhexArray[1]}${xhexArray[2]}`, (err, img) => {
            if (err) throw err;
            img.getBuffer(Jimp.MIME_PNG, (err, buffer) => {
                if (err) throw err;
                // reply to the message with the color code and buffer image
                message.reply({ content: `${xhex[0]}`, files: [buffer] });
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