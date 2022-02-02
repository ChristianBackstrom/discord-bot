const Discord = require("discord.js");
const { prefix } = require("./config.json");
const Distube = require("distube");
const voice = require("@discordjs/voice");
const dotenv = require("dotenv");
const meow = require("random-meow");

let width = 5;
let height = 5;

let positionX = 1;
let positionY = 1;

let gridData;

dotenv.config();

const client = new Discord.Client({
  intents: [
    Discord.Intents.FLAGS.GUILDS,
    Discord.Intents.FLAGS.GUILD_MESSAGES,
    Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Discord.Intents.FLAGS.GUILD_VOICE_STATES,
    Discord.Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
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

  if (command === "simonpussy") {
    playAudio(
      message,
      "https://cdn.discordapp.com/attachments/781497108431503380/788103243808768030/SimonsFetaPussy.mp3"
    );
  }

  if (command === "yt") {
    distube.play(message.member.voice.channel, args.join());
  }

  if (command === "cat") {
    meow()
      .then(async (url) => {
        let imageEmbed = new Discord.MessageEmbed()
          .setTitle("Here you have a cat!")
          .setImage(url);
        await message.channel.send({ embeds: [imageEmbed] });
      })
      .catch(console.error);
  }

  if (command === "gengrid") {
    if (args[0] && args[1]) {
      width = args[0];
      height = args[1];
    }
    let grid = updateGrid();
    message.channel.send(grid).then((message) => {
      message
        .react("⬅️")
        .then(() => message.react("⬆️"))
        .then(() => message.react("⬇️"))
        .then(() => message.react("➡️"));
      gridData = message;
    });
  }
});

function move(direction) {
  if (direction === "up") {
    if (positionY <= 1) {
      positionY = height;
    } else {
      positionY--;
    }
    let grid = updateGrid();
    gridData.edit(grid);
  }

  if (direction === "down") {
    if (positionY >= height) {
      positionY = 1;
    } else {
      positionY++;
    }
    let grid = updateGrid();
    gridData.edit(grid);
  }

  if (direction === "right") {
    if (positionX >= width) {
      positionY = 1;
    } else {
      positionX++;
    }
    let grid = updateGrid();
    gridData.edit(grid);
  }

  if (direction === "left") {
    if (positionX <= 1) {
      positionX = width;
    } else {
      positionX--;
    }
    let grid = updateGrid();
    gridData.edit(grid);
  }
}

client.on("messageReactionAdd", (reaction, user) => {
  const guild = client.guilds.cache.get(gridData.guildId);

  const channel = guild.channels.cache.get(gridData.channelId);

  try {
    const cacheMessage = true;
    const skipCache = true;
    const fetchedMessage = channel.messages.fetch(
      gridData.id,
      cacheMessage,
      skipCache
    );

    if (reaction.emoji.name === "⬆️") {
      move("up");
    } else if (reaction.emoji.name === "⬇️") {
      move("down");
    } else if (reaction.emoji.name === "➡️") {
      move("right");
    } else if (reaction.emoji.name === "⬅️") {
      move("left");
    }
  } catch (error) {
    console.error(error);
  }
});

client.on("messageReactionRemove", (reaction, user) => {
  const guild = client.guilds.cache.get(gridData.guildId);

  const channel = guild.channels.cache.get(gridData.channelId);

  try {
    const cacheMessage = true;
    const skipCache = true;
    const fetchedMessage = channel.messages.fetch(
      gridData.id,
      cacheMessage,
      skipCache
    );

    if (reaction.emoji.name === "⬆️") {
      move("up");
    } else if (reaction.emoji.name === "⬇️") {
      move("down");
    } else if (reaction.emoji.name === "➡️") {
      move("right");
    } else if (reaction.emoji.name === "⬅️") {
      move("left");
    }
  } catch (error) {
    console.error(error);
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

function updateGrid() {
  let grid = "";
  for (let y = 1; y <= height; y++) {
    for (let x = 1; x <= width; x++) {
      if (x == positionX && y == positionY) {
        grid += ":one:";
      } else {
        grid += ":zero:";
      }
    }
    grid += "\n";
  }
  return grid;
}

client.login(process.env.DISCORD_BOT_TOKEN);
