const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

const c = `<:checked:1120528037788786758>`;
const u = `<:unchecked:1120528038929637406>`;
const i = `:exclamation:`;

module.exports = {
  deploy: new SlashCommandBuilder()
    .setName('key')
    .setDescription('Get a simple key explaining things in our panel.'),

  async run(interaction, client) {
    if ([
        '993956817350688830',
        '1049495201682571334',
        '1053101084190703766',
        '932029269318721576', // chat-here for outsourcing
        '1055625743448682557' // #spam channel in my server
    ].indexOf(interaction.channel.id) < 0) return interaction.reply({
      ephemeral: true,
      embeds: [ new discord.EmbedBuilder().setDescription(`**This command is not for this channel.**`) ]
    });

    interaction.reply({
        embeds: [
            new EmbedBuilder()
                .setTitle('Key')
                .setDescription(`I tried to make the bot as easy as possible. So, I made a simple key for emojis used.\n\n${u} \`-->\` not checked yet.\n${c} \`-->\` checked, is not the trending game\n${i} \`-->\` is the trending game! yay!`)
                .setFooter({
                    text: 'thonk#0001 is cool | dm me for questions'
                })
        ],
        ephemeral: true
    })
  }
}
