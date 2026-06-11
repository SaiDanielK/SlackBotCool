require("dotenv").config();
const axios = require("axios");
const { App } = require("@slack/bolt");

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true
});

app.command("/dsb-ping", async ({ command, ack, respond }) => {
  await ack();
  await respond({ text: "Pong!" });
});

app.command("/dsb-help", async ({ ack, respond }) => {
  await ack();
  await respond({
    text: `Available Commands:
• /dsb-ping
• /dsb-catfact
• /dsb-joke`
  });
});

app.command("/dsb-catfact", async ({ ack, respond }) => {
  await ack();
  try {
    const { data } = await axios.get("https://catfact.ninja/fact");
    await respond({ text: `Cat Fact:\n${data.fact}` });
  } catch {
    await respond({ text: "Failed to fetch a cat fact." });
  }
});

app.command("/dsb-joke", async ({ ack, respond }) => {
  await ack();
  try {
    const { data } = await axios.get("https://official-joke-api.appspot.com/random_joke");
    await respond({ text: `${data.setup}\n\n${data.punchline}` });
  } catch {
    await respond({ text: "Failed to fetch a joke." });
  }
});

app.error((err) => console.error(err));

(async () => {
  await app.start(process.env.PORT || 3000);
  console.log("Bot is running!");
})();
