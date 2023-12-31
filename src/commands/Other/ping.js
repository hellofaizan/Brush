const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with Ping!'),
    async execute(interaction, client) {
        // To make the reply private to the user, use interaction.reply('Pong!', {ephemeral: true});
        // make an embed
        const embed = {
            color: 0x0099ff,
            title: `🏓 Pong - ${Date.now() - interaction.createdTimestamp}ms`,
            footer: {
                text: `Requested by ${interaction.user.tag}`,
                icon_url: interaction.user.avatarURL()
            },
        }
        await interaction.reply({ embeds: [embed] });
    },
}