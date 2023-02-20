const challenge = (req, res) => {
  console.log("req body challenge is:", req.body.challenge);

  res.status(200).send({
    challenge: req.body.challenge,
  });
};

const events = async (req, res) => {
  const type = req.body.type;

  if (type === "url_verification") {
    await challenge(re, res);
  } else {
    console.log("body:", req.body);
  }
};
