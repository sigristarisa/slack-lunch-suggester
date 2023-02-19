const { App } = require("@slack/bolt");
const data = require("./locations.json");
require("dotenv").config();

// Initializes your app with your bot token and signing secret
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true,
});

const getLocation = () => {
  const locations = data.results;
  const location = locations[Math.floor(Math.random() * locations.length)];
  return location;
};

app.command("/lunch", async ({ command, ack, respond }) => {
  await ack();
  const location = getLocation();
  const nameToQuery = location.name.replace(/\s/g, "+").replace(/,/g, "%2C");
  await respond(
    `Let's go to <https://www.google.com/maps/search/?api=1&query=${nameToQuery}&query_place_id=${location.place_id}|${location.name}> for lunch!`
  );
});

(async () => {
  // Start your app
  await app.start(process.env.PORT || 3000);

  console.log("⚡️ Bolt app is running!");
})();
