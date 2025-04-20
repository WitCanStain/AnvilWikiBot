const { Client, GatewayIntentBits, Partials } = require("discord.js");
const client = new Client({
    intents: [GatewayIntentBits.MessageContent, GatewayIntentBits.DirectMessages, GatewayIntentBits.GuildMembers, GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages], partials: [
        Partials.Channel,
        Partials.Message
    ]
});

module.exports = { client }