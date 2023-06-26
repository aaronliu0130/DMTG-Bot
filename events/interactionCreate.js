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

    global.thing.channel.send(`<@&944031328104480771>`)
    global.thing.followUp({
      embeds: [
        new EmbedBuilder()
        .setTitle('Trending Game Found!')
        .setDescription(`The trending game is ${game} (found by ${interaction.user})!\n\n**Report:**\n${buildStatus()}`)
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

    global.thing.editReply({
      embeds: [
        new EmbedBuilder()
        .setTitle('Trending Game Manager')
        .setDescription(`Use this embed to control the daily trending game.\n\n${buildStatus()}`)
        .setFooter({
          text: '@iamthonk is cool :) | run /key for info'
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
    if (!interaction.member.roles.cache.find(r => r.id === '944031328104480771')) return interaction.reply({
      content: `**No Permission**\nThis option is resticted to Trend Masters only.\nThe panel will automatically reload. This button is to reset all data for the day.`,
      ephemeral: true
    });

    let old = buildStatus();

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

    global.thing.editReply({
      embeds: [
        new EmbedBuilder()
        .setTitle('Trending Game Manager')
        .setDescription(`Use this embed to control the daily trending game.\n\n${buildStatus()}`)
        .setFooter({
          text: '@iamthonk is cool :) | run /key for info'
        })
      ],
      components: [
        row1, row2
      ]
    });

    global.thing.followUp({
      embeds: [
        new EmbedBuilder()
        .setDescription(`${interaction.user.tag} has reset the panel.\n\n**Previously:**\n${old}`)
      ]
    })

    try {
      interaction.reply({ // odd discordjs bypass to return empty interaction
        ephemeral: true
      }).catch(e => {})
    } catch {}
  } else if (interaction.customId === 'undo') {
    interaction.reply({
      embeds: [
        new EmbedBuilder()
        .setTitle('Undo a checking')
        .setDescription('if you did misclick... :skull:')
        .setFooter({
          text: 'imagine misclicking'
        })
      ],
      components: [
        new ActionRowBuilder().addComponents(buildMenu('undo_2'))
      ],
      ephemeral: true
    })
  } else if (interaction.customId === 'undo_2') {
    let game = interaction.component.data.options.filter(a => a.value === interaction.values[0])[0].label;

    if (json[game] == 1) return interaction.reply({
      embeds: [
        new EmbedBuilder()
        .setDescription('This was already undone. You slow?')
      ],
      ephemeral: true
    });

    json[game] = 1;
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
        .setDescription('Undid report.')
      ],
      components: [],
      ephemeral: true
    })
  }
}
