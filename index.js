const Discord = require("discord.js")
const fs = require("fs")

const system = require('./system.json')

const client = new Discord.Client({ intents: [
	Discord.GatewayIntentBits.Guilds,
	Discord.GatewayIntentBits.GuildMessages, 
	Discord.GatewayIntentBits.MessageContent, 
	Discord.GatewayIntentBits.GuildMembers
]})

client.commands = new Discord.Collection()

for (const file of fs.readdirSync('./commands').filter(file => file.endsWith('.js'))) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.deploy.name, command);
};

for (const file of fs.readdirSync('./events').filter(file => file.endsWith('.js'))) {
  const event = require(`./events/${file}`);
  client.on(file.split('.')[0], (t) => event(client, t));
};

client.login(system.token);

require('express')()
	.get('/', (req, res) => res.status(200).send('Bot alive!'))
	.listen(8080);
