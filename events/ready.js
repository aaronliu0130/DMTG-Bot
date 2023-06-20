const Discord = require("discord.js")
const fs = require("fs")

const system = require('../system.json')

module.exports = async (client, msg) => {
  let config = {
    name: 'the Trending Game',
    type: 'watching',
    status: 'dnd'
  }

  const types = {
    'competing': Discord.ActivityType.Competing,
    'listening': Discord.ActivityType.Listening,
    'playing': Discord.ActivityType.Playing,
    'watching': Discord.ActivityType.Watching
  };

  client.user.setActivity(config.name, {
    type: types[config.type]
  });

  client.user.setStatus(config.status);
  console.log(`Connected to ${client.user.tag}!\nI am in ${client.guilds.cache.map(guild => guild.id).length} guild${client.guilds.cache.map(guild => guild.id).length == 1 ? '' : 's'}.`)

  // Deployer
  const commands = [];

  for (const file of fs.readdirSync('./commands').filter(file => file.endsWith('.js'))) {
	const command = require(`../commands/${file}`);
    if (command.deploy && command.deploy !== 'none') commands.push(command.deploy.toJSON());
  }

  const rest = new Discord.REST({
    version: '10'
  }).setToken(system.token);

  rest.put(Discord.Routes.applicationCommands(system.client), {
    body: commands
  }).then((data) => {
    console.log(`\nCommands loaded! (${data.length})`);
    console.log(commands)
  }).catch(console.error);
}