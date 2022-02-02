const Discord = require("discord.js");
const { prefix } = require("./config.json");
const Distube = require("distube");
const voice = require("@discordjs/voice");
const dotenv = require("dotenv");
const meow = require("random-meow");

dotenv.config();

const client = new Discord.Client({
  intents: [
    Discord.Intents.FLAGS.GUILDS,
    Discord.Intents.FLAGS.GUILD_MESSAGES,
    Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Discord.Intents.FLAGS.GUILD_VOICE_STATES,
  ],
});

const distube = new Distube.default(client);

client.on("ready", () => {
  console.log(`The bot is ready`);
});

client.on("messageCreate", (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(" ");
  const command = args.shift().toLowerCase();

  if (command === "playbruh") {
    playAudio(
      message,
      "https://cdn.discordapp.com/attachments/938089386338320397/938174639786577971/Bruh_Sound_Effect_2.mp3"
    );
  }

  if (command === "laugh") {
    playAudio(
      message,
      "https://cdn.discordapp.com/attachments/938089386338320397/938179863154667610/Laugh_Track.mp3"
    );
  }

  if (command === "yt") {
    distube.play(message.member.voice.channel, args.join());
  }

  if (command === "cat") {
    meow()
      .then(async (url) => {
        let imageEmbed = new Discord.MessageEmbed()
          .setTitle("Cat")
          .setImage(url);
        await message.channel.send({ embeds: [imageEmbed] });
      })
      .catch(console.error);
  }
});

function playAudio(message, audioResource) {
  const channel = message.member.voice.channel;

  if (!channel)
    return message.channel.send("Bruh join a voice channel you doffus");

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
    connection.destroy();
  });
}

client.login(process.env.DISCORD_BOT_TOKEN);
