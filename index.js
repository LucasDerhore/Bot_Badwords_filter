require("dotenv").config();

console.log(process.env.TOKENBOT);

const { Client, Intents } = require("discord.js");
const Filter = require("bad-words");
var filter = (filter = new Filter());
const config = require("./config.json");

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

client.on("ready", () => {
  console.log("Bot online");
  console.log(filter.clean("Don't be an ash0le"));
  //client.channels.cache.get("941796763453509632").send("Le bot est en ligne");
});

// BOT RDY STOP

// BOT VERIFY REACTION START

client.on("messageReactionAdd", (reaction, user) => {
  console.log(reaction);
  console.log(user);
  console.log(reaction._emoji.name);
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

// BOT FILTER LINK START

client.on("message", (message) => {
  if (message.content.includes("https://")) {
    console.log(
      "deleted " + message.content + " from " + message.author.username
    );
    message.delete(1);
    client.channels.cache
      .get(message.channel.id)
      .send("No links here, " + message.author);
  }
  if (message.content.includes("http://")) {
    console.log(
      "deleted " + message.content + " from " + message.author.username
    );
    message.delete(1);
    client.channels.cache
      .get(message.channel.id)
      .send("No links here, " + message.author);
  }
  if (message.content.includes("www.")) {
    console.log(
      "deleted " + message.content + " from " + message.author.username
    );
    message.delete(1);
    client.channels.cache
      .get(message.channel.id)
      .send("No links here, " + message.author.username);
  }
});

// BOT FILTER LINK STOP

// BOT FILTER BAD WORDS START

client.on("message", (message) => {
  console.log(message.content);
  if (
    config.Bad_words.some((word) =>
      message.content.toLocaleLowerCase().includes(word)
    )
  ) {
    message.delete();
    console.log(message.channel.id);
    client.channels.cache.get(message.channel.id).send("Warning swear !");
  }
});

// BOT FILTER BAD WORDS STOP
