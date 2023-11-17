const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('about')
        .setDescription('About the developer'),
    async execute(interaction, client) {
        // To make the reply private to the user, use interaction.reply('Pong!', {ephemeral: true});
        // make an embed
        const embed = {
            color: 0x0099ff,
            title: 'About the developer',
            description: 'This bot is made by <@890232380265222215>',
            fields: [
                {
                    name: 'Github',
                    value: 'https://github.com/hellofaizan'
                },
                {
                    name: 'Portfolio',
                    value: 'https://hellofaizan.me'
                },
            ],
            footer: {
                text: `Requested by ${interaction.user.tag}`,
                icon_url: interaction.user.avatarURL()
            },

        };
        await interaction.reply({ embeds: [embed] });
    },
}