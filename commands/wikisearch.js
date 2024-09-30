const { SlashCommandBuilder } = require('discord.js');
const { wikiQuery } = require('../wikiquery');
const {buildItemDataEmbedMsg} = require('../embedHelper')
module.exports = {
    data: new SlashCommandBuilder()
    .setName('wikisearch')
    .setDescription('Searches the Anvil Empires wiki for infobox information related to the provided item')
    .addStringOption(option =>
		option.setName('item_name')
			.setDescription('The item you want information on')
            .setRequired(true))
    .addBooleanOption(option =>
        option.setName('ephemeral')
            .setDescription('Whether or not the response should be visible only to you')),
    async execute(interaction) {
        
        const item_name = interaction.options.getString('item_name');
        const ephemeral = interaction.options.getBoolean('ephemeral');
        let {title, image_url, data} = await wikiQuery(item_name)
        let embed = buildItemDataEmbedMsg(title, image_url, data)
        await interaction.reply({embeds:[embed], ephemeral:ephemeral});
    }
};