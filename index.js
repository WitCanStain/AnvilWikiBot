const fs = require('node:fs');
const path = require('node:path');
require('dotenv').config()
const commandsPath = path.join(__dirname, 'commands');
const { Events, Collection } = require("discord.js");
const { client } = require('./client.js');
client.commands = new Collection();

client.login(process.env.BOT_TOKEN);
client.once('ready', () => {
    console.log('Ready!');
});
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    console.log(`file: ${file}`)
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
    } else {
        console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
}

client.on(Events.InteractionCreate, async interaction => {
	console.log(`Command received!`)
	if (!interaction.isChatInputCommand()) return;
	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await interaction.deferReply({ ephemeral:true });
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});

module.exports = { client }