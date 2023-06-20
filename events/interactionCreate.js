const { StringSelectMenuBuilder, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js')
const { writeFileSync } = require('fs');

const json = require('../trending.json');
const updt = () => writeFileSync('./trending.json', JSON.stringify(json));

const optsFormed = [];
Object.keys(json).forEach(a => optsFormed.push({
    label: a,
    value: a.replaceAll(' ', '_').toLowerCase()
}));

const buildMenu = (cstmid) => {   
    return new StringSelectMenuBuilder({
        custom_id: cstmid,
        placeholder: 'Select a Game...',
        options: optsFormed
    });
};

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

module.exports = async (client, interaction, db) => {
  if (interaction.isChatInputCommand()) {
    const command = client.commands.get(interaction.commandName);
    if (command) await command.run(interaction, client, db);
  } else if (interaction.customId === 'reporttrending') {

    interaction.reply({
        embeds: [
            new EmbedBuilder()
                .setTitle('Report the trending game.')
                .setDescription('Try not to misclick. There\'s no confirm button.')
                .setFooter({
                    text: 'thanks for hunting!'
                })
        ],
        components: [
            new ActionRowBuilder().addComponents(buildMenu('reporttrending_2'))
        ],
        ephemeral: true
    })
  } else if (interaction.customId === 'reporttrending_2') {
    let game = interaction.component.data.options.filter(a => a.value === interaction.values[0])[0].label;

    json[game] = 2;
    updt();

    global.thing.channel.send({
        content: `<@&944031328104480771>`,
        embeds: [
            new EmbedBuilder()
                .setTitle('Trending Game Found!')
                .setDescription(`The trending game is ${game}!\n\n**Report:**\n${buildStatus()}`)
                .setFooter({
                    text: 'finally found it lol'
                })
        ]
    })
  } else if (interaction.customId === 'reportnottrending') {
    interaction.reply({
        embeds: [
            new EmbedBuilder()
                .setTitle('Report a NOT TRENDING game.')
                .setDescription('Try not to misclick. There\'s no confirm button.')
                .setFooter({
                    text: 'thanks for hunting!'
                })
        ],
        components: [
            new ActionRowBuilder().addComponents(buildMenu('reportnottrending_2'))
        ],
        ephemeral: true
    })
  } else if (interaction.customId === 'reportnottrending_2') {
    let game = interaction.component.data.options.filter(a => a.value === interaction.values[0])[0].label;

    if (json[game] !== 1) return interaction.reply({
        embeds: [
            new EmbedBuilder()
                .setDescription('A report has already been submitted on this game. Better luck next time.')
        ],
        ephemeral: true
    });

    json[game] = 0;
    updt();

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
          .setLabel('Reset')
          .setStyle(ButtonStyle.Secondary)
          .setCustomId('reset')
      )

    global.thing.editReply({
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
    });

    interaction.reply({
        embeds: [
            new EmbedBuilder()
                .setDescription('Sent report.')
        ],
        components: [],
        ephemeral: true
    })
  } else if (interaction.customId === 'reset') {
    Object.keys(json).forEach(a => json[a] = 1);
    updt();

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
          .setLabel('Reset')
          .setStyle(ButtonStyle.Secondary)
          .setCustomId('reset')
      )

    global.thing.editReply({
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
    });

    global.thing.followUp({
        embeds: [
            new EmbedBuilder()
                .setDescription(`${interaction.user.tag} has reset the panel.`)
        ]
    })

    try {
        interaction.reply({ // odd discordjs bypass to return empty interaction
            ephemeral: true
        }).catch(e => {})
    } catch {}
  }
}