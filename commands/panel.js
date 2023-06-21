const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js'); // idc this is messy
const json = require('../trending.json');

const c = `<:checked:1120528037788786758>`;
const u = `<:unchecked:1120528038929637406>`;
const i = `:exclamation:`;

const buildStatus = () => {
  let status = ``;
  Object.entries(json).forEach(game => {
    if (game[1] === 0) status += `${c} ${game[0]}\n`
    else if (game[1] === 1) status += `${u} ${game[0]}\n`
    else if (game[1] === 2) status += `${i} ${game[0]}\n`
  });
  return status;
};

module.exports = {
  deploy: new SlashCommandBuilder()
    .setName('panel')
    .setDescription('Send the trending management panel.'),

  async run(interaction, client) {
    if ([
        '993956817350688830',
        '1049495201682571334',
        '1053101084190703766',
        '1055625743448682557' // #spam channel in my server
      ].indexOf(interaction.channel.id) < 0) return interaction.reply({
      ephemeral: true,
      embeds: [new discord.EmbedBuilder().setDescription(`**This command is not for this channel.**`)]
    });

    const row1 = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
        .setLabel('Report the Trending Game!')
        .setStyle(ButtonStyle.Success)
        .setCustomId('reporttrending')
      )
      .addComponents(
        new ButtonBuilder()
        .setLabel('Report a not Trending Game')
        .setStyle(ButtonStyle.Danger)
        .setCustomId('reportnottrending')
      )
    const row2 = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
        .setLabel('Undo Checking')
        .setStyle(ButtonStyle.Secondary)
        .setCustomId('undo')
      )
      .addComponents(
        new ButtonBuilder()
        .setLabel('Reset')
        .setStyle(ButtonStyle.Secondary)
        .setCustomId('reset')
      )

    global.thing = interaction;

    interaction.reply({
      embeds: [
        new EmbedBuilder()
        .setTitle('Trending Game Manager')
        .setDescription(`Use this embed to control the daily trending game.\n\n${buildStatus()}`)
        .setFooter({
          text: 'thonk#0001 is cool :) | run /key for info'
        })
      ],
      components: [
        row1, row2
      ]
    })
  }
}
