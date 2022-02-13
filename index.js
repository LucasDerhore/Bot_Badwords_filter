require("dotenv").config();

console.log(process.env.TOKENBOT);

const { Client, Intents } = require("discord.js");
const Filter = require("bad-words");
var filter = (filter = new Filter());
const config = require("./config.json");

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});
client.login(process.env.TOKENBOT);

client.on("ready", () => {
  console.log("Bot online");
  console.log(filter.clean("Don't be an ash0le"));
  //client.channels.cache.get("941796763453509632").send("Le bot est en ligne");
});

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

// Code pour que le bot ecrive dans un channel
//client.channels.cache.get("9941796763453509632").send("Bot online");
