const { Client, Intents } = require('discord.js');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS] });

client.on('ready', () => {
  console.log(`The bot is ready`);
});


client.login('OTM4MDg3NjIxNDg4NDM1Mjgy.YflMLQ.pnS6ZdAy0OJAwa983uOd7Leoyl4');