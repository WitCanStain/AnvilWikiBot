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
    const embed = new EmbedBuilder()
        .setColor('Green')
        .setTitle(item_title)
        .addFields(
            ...fields
        )
        .setThumbnail(img_url)
    return embed;
}

module.exports = { buildItemDataEmbedMsg }