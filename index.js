require("dotenv").config();

console.log(process.env.TOKENBOT);

const {
  Client,
  Intents,
  MessageActionRow,
  MessageButton,
  MessageAttachment,
} = require("discord.js");
const wait = require("util").promisify(setTimeout);
const Filter = require("bad-words");
var filter = (filter = new Filter());
const config = require("./config.json");
const InvitationsService = require("./src/services/InvitationsService");
const Canvas = require("canvas");
const path = require("path");

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
  ],
  partials: ["MESSAGE", "CHANNEL", "REACTION"],
});
client.login(process.env.TOKENBOT);

const prefix = "!";

// BOT RDY START

client.on("ready", async () => {
  console.log("Bot online");
  console.log(filter.clean("Don't be an ash0le"));
  //client.channels.cache.get("941796763453509632").send("Le bot est en ligne");
});

// BOT RDY STOP

// BOT VERIFY REACTION START

client.on("messageReactionAdd", async (reaction, user) => {
  if (
    reaction.message.channelId === "941740180732264509" &&
    reaction._emoji.name === "✅"
  ) {
    const role = reaction.message.guild.roles.cache.find(
      (r) => r.id === "941741262208376872"
    );
    const guild = client.guilds.cache.get("941734057342009425");
    const member = guild.members.cache.get(user.id);
    member.roles.add(role);
  }
});

// BOT VERIFY REACTION STOP

// BOT CARD WELCOME

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  //Generating the actual custom Card
  /*const image = await Canvas.loadImage({
    avatar: {
      image: message.author.displayAvatarURL(
        { format: "png" },
        { format: "jpg" },
        { format: "jpeg" }
      ),
      outlineWidth: 5,
    },
    blur: true,
    rounded: true,
    text: {
      title: "Hello ✌",
      subtitle: `Welcome to KamagoTree World ${message.author.tag}`,
      color: `#00000`,
    },
    background:
      "https://cdn.discordapp.com/attachments/941432216595075102/944263582273658970/OPENSEA_BANNER_1400x400.png",
    theme: "dark",
  });*/

  // Create a canvas and access the 2d context
  const canvas = Canvas.createCanvas(700, 250);
  const ctx = canvas.getContext("2d");

  // Load the background image and draw it to the canvas
  const background = await Canvas.loadImage(path.join("./Bannniere.png"));
  let x = 0;
  let y = 0;
  ctx.drawImage(background, x, y);

  // Load the user's profile picture and draw it
  const pfp = await Canvas.loadImage(
    message.author.displayAvatarURL({
      format: "png",
    })
  );
  x = canvas.width / 2 - pfp.width / 2;
  y = canvas.height / 2 - pfp.height / 2;
  ctx.drawImage(pfp, x, y);

  message.channel.send({
    files: [new MessageAttachment(canvas.toBuffer())],
  });
});

// BOT CARD WELCOME STOP

// BOT FILTER LINK START

client.on("message", async (message) => {
  if (
    message.content.includes("https://") ||
    message.content.includes("http://") ||
    message.content.includes("www.")
  ) {
    console.log(
      "deleted " + message.content + " from " + message.author.username
    );
    message.delete(1);
    client.channels.cache
      .get(message.channel.id)
      .send("No links here, " + message.author);
  }
  if (
    config.Bad_words.some((word) =>
      message.content.toLocaleLowerCase().includes(word)
    )
  ) {
    message.delete();
    console.log(message.channel.id);
    client.channels.cache.get(message.channel.id).send("Warning swear !");
  }
  if (
    message.channelId == "941750479640227890" ||
    (message.author.id === "941776823568699393" &&
      message.channelId !== "941734057937620994")
  ) {
    await wait(10000);
    message.delete(1);
  } else if (message.channelId === "944306944179593256") {
    const response = await InvitationsService.onCodeUse(
      message.content,
      message.author.id
    );
    client.channels.cache.get(message.channel.id).send(response);
    await wait(10000);
    message.delete(1);
  }
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isButton()) return;
  const userCode = await InvitationsService.generateCode(interaction.user.id);
  if (interaction.message.channelId === "941750479640227890") {
    const row = new MessageActionRow().addComponents(
      new MessageButton()
        .setCustomId("primary")
        .setLabel("Copy code")
        .setStyle("PRIMARY")
    );
    client.channels.cache
      .get(interaction.channel.id)
      .send(`You referral code is: ${userCode}`, row);
  }
});
// BOT FILTER BAD WORDS STOP
