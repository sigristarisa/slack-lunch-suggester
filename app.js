const { App } = require("@slack/bolt");
// const { VercelRequest, VercelResponse } = require("@vercel/node");
const data = require("./locations.json");
require("dotenv").config();

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  appToken: process.env.SLACK_APP_TOKEN,
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

const challenge = (req, res) => {
  console.log("req body challenge is:", req.body.challenge);

  res.status(200).send({
    challenge: req.body.challenge,
  });
};

const events = async (req, res) => {
  const type = req.body.type;

  if (type === "url_verification") {
    await challenge(req, res);
  } else if (validateSlackRequest(req, signingSecret)) {
    if (type === "event_callback") {
      const event_type = req.body.event.type;

      switch (event_type) {
        case "app_mention":
          await app_mention(req, res);
          break;
        case "channel_created":
          await channel_created(req, res);
          break;
        default:
          break;
      }
    } else {
      console.log("body:", req.body);
    }
  }
};

(async () => {
  await app.start(process.env.PORT || 3000);
  console.log("⚡️ Bolt app is running!");
})();
