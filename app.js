const { App, AwsLambdaReceiver } = require("@slack/bolt");
const data = require("./locations.json");
require("dotenv").config();

const awsLambdaReceiver = new AwsLambdaReceiver({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
});

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  receiver: awsLambdaReceiver,
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

module.exports.handler = async (event, context, callback) => {
  const handler = await awsLambdaReceiver.start();
  return handler(event, context, callback);
};
