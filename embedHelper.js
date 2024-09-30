const { EmbedBuilder } = require('discord.js');


const buildItemDataEmbedMsg = (item_title, img_url, data) => {
    console.log(`item data: ${JSON.stringify(data)}`)
    fields = Object.entries(data).map(([key, value]) => {
        if (!value) return null
        const regex_result = key.replace(/([A-Z])/g, " $1");
        const title_case = regex_result.charAt(0).toUpperCase() + regex_result.slice(1);
        return { name: title_case, value: value } 
    })
    fields = fields.filter(a=>!!a)
    // console.info(`fields: ${JSON.stringify(fields)}`)
    const embed = new EmbedBuilder()
        .setColor('Green')
        .setTitle(item_title)
        // .setDescription(``)
        .addFields(
            ...fields
        )
        .setThumbnail(img_url)
        // .setFooter({ text: 'If you have any questions or concerns as to the function of the bot, contact 0xbl00d.', iconURL: 'https://i.imgur.com/CZ278Y8.jpg' });
    return embed;
}

module.exports = { buildItemDataEmbedMsg }