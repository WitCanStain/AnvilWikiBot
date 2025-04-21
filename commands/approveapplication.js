const { SlashCommandBuilder } = require('discord.js');
const { approveUser } = require('../userRoleHelper.js');
module.exports = {
    data: new SlashCommandBuilder()
    .setName('approve_join')
    .setDescription('Accepts a user\'s application and gives them appropriate roles.')
    .addStringOption(option =>
		option.setName('user_id')
			.setDescription('The id of the user whose application is being approved.')
            .setRequired(true)),
//    .setDescription('Whether or not the response should be visible only to you'),
    async execute(interaction) {
        const user_id = interaction.options.getString('user_id');
        let res = await approveUser(user_id, interaction.user.id);
        await interaction.followUp({content:res?'User successfully approved':'Error occurred, approving failed.', ephemeral:true});
    }
};