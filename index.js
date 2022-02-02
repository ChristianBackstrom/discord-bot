const { Client, Intents, BaseGuild, BaseGuildVoiceChannel } = require('discord.js');
const { prefix } = require('./config.json');
const Distube = require('distube');
const voice = require('@discordjs/voice');
const dotenv = require('dotenv');
dotenv.config();


const client = new Client({ intents: [ Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.GUILD_VOICE_STATES] });

const distube = new Distube.default(client);

client.on('ready', () => {
  console.log(`The bot is ready`);
});



client.on('messageCreate', (message) => {
    if (!message.content.startsWith(prefix) || message.author.bot) return

	const args = message.content.slice(prefix.length).trim().split(' ')
	const command = args.shift().toLowerCase()

    if (command === 'playbruh'){
        playAudio(message, 'https://cdn.discordapp.com/attachments/938089386338320397/938174639786577971/Bruh_Sound_Effect_2.mp3');
    }

    if (command === 'laugh'){
        playAudio(message, 'https://cdn.discordapp.com/attachments/938089386338320397/938179863154667610/Laugh_Track.mp3');
    }

    if (command === 'yt'){
        distube.play(message.member.voice.channel, args.join());
    }
});

function playAudio(message, audioResource) {
    const channel = message.member.voice.channel;

    if (!channel) return message.channel.send('Bruh join a voice channel you doffus');

    const player = voice.createAudioPlayer();
    const resource = voice.createAudioResource(audioResource);

    const connection = voice.joinVoiceChannel({
        channelId: channel.id,
        guildId: message.guild.id,
        adapterCreator: message.guild.voiceAdapterCreator,
    });

    connection.subscribe(player);
    player.play(resource);

    player.on(voice.AudioPlayerStatus.Idle, () => {
        connection.destroy()
    })
}

client.login(process.env.DISCORD_BOT_TOKEN);