const express = require("express");
const User = require("../model/userModel");
const apiKey = require("../model/apikeyModel.js");
const router = express.Router();

function getApiKey(key, callback) {
  apiKey.findOne({ key: key }, function (err, result) {
    return callback(result);
  });
}

const isValid = async (key) => {
  return await apiKey.exists({ key: key });
};

router.get("/", async (req, res) => {
  User.find().exec(function (err, users) {
    return res.send(users);
  });
});

router.get("/ranking/rank", async (req, res) => {
  let rankArr = [];
  User.find()
    .sort("-ranking")
    .limit(10)
    .exec(function (err, users) {
      let i = 0;
      users.forEach(function (user) {
        i++;
        rankArr.push({
          place: i,
          uuid: user.uuid,
          name: user.name,
          ranking: user.ranking,
        });
      });
      res.send(rankArr);
    });
});
router.get("/ranking/stone", async (req, res) => {
  let minelvlArr = [];
  User.find()
    .sort("-mine_level")
    .limit(10)
    .exec(function (err, users) {
      let i = 0;
      users.forEach(function (user) {
        i++;
        minelvlArr.push({
          place: i,
          uuid: user.uuid,
          name: user.name,
          minelvl: user.ranking,
        });
      });
      res.send(minelvlArr);
    });
});
router.get("/ranking/kills", async (req, res) => {
  let killsArr = [];
  User.find()
    .sort("-kills")
    .limit(10)
    .exec(function (err, users) {
      let i = 0;
      users.forEach(function (user) {
        i++;
        killsArr.push({
          place: i,
          uuid: user.uuid,
          name: user.name,
          kills: user.kills,
        });
      });
      res.send(killsArr);
    });
});
router.get("/ranking/refs", async (req, res) => {
  let refsArr = [];
  User.find()
    .sort("-refils")
    .limit(10)
    .exec(function (err, users) {
      let i = 0;
      users.forEach(function (user) {
        i++;
        refsArr.push({
          place: i,
          uuid: user.uuid,
          name: user.name,
          refils: user.refils,
        });
      });
      res.send(refsArr);
    });
});
router.get("/ranking/enchrefs", async (req, res) => {
  let enchrefsArr = [];
  User.find()
    .sort("-enchanted_refils")
    .limit(10)
    .exec(function (err, users) {
      let i = 0;
      users.forEach(function (user) {
        i++;
        enchrefsArr.push({
          place: i,
          uuid: user.uuid,
          name: user.name,
          enchanted_refils: user.enchanted_refils,
        });
      });
      res.send(enchrefsArr);
    });
});

router.post("/", async (req, res) => {
  const token = req.header("X-Api-Key");
  if (!token) {
    return res.sendStatus(401);
  }
  if (await isValid(token)) {
    getApiKey(token, async function (response) {
      if (response.admin == true) {
        const exist = await User.findOne({ uuid: req.body.uuid });
        if (exist) {
          return res.status(400).send("User already exists");
        }
        const user = new User({
          uuid: req.body.uuid,
          name: req.body.name,
          guild: req.body.guild,
          rank: req.body.rank,
          online: req.body.online,
          ranking: req.body.ranking,
          kills: req.body.kills,
          deaths: req.body.deaths,
          mine_level: req.body.mine_level,
          refils: req.body.refils,
          enchanted_refils: req.body.enchanted_refils,
          paid: 0,
          last_kills: req.body.last_kills,
          last_deaths: req.body.last_deaths,
        });
        try {
          const savedUser = await user.save();
          res.send(savedUser);
        } catch (error) {
          res.status(400).send(error);
        }
      } else {
        res.sendStatus(403);
      }
    });
  } else {
    return res.sendStatus(404);
  }
});

router.get("/:id", async (req, res) => {
  User.find().exec(async function (err, users) {
    const found = await User.findOne({ name: req.params.id });
    if (!found) return res.status(400).send("User not found");
    res.send(found);
  });
});

router.delete("/:id", async (req, res) => {
  if (await isValid(token)) {
    getApiKey(token, async function (response) {
      if (response.admin == true) {
        User.deleteOne({ uuid: req.params.id }, function (err) {
          res.send(`Removed user with the uuid ${req.params.id}`);
          if (err) return res.send(err);
        });
      }
    });
  } else {
    return res.sendStatus(404);
  }
});

router.patch("/:id", async (req, res) => {
  const token = req.header("X-Api-Key");
  if (!token) {
    return res.sendStatus(401);
  }
  if (await isValid(token)) {
    getApiKey(token, async function (response) {
      if (response.admin == true) {
        const {
          name,
          guild,
          rank,
          online,
          ranking,
          kills,
          deaths,
          mine_level,
          refils,
          enchanted_refils,
          last_kills,
          last_deaths,
        } = req.body;
        const update = [];
        if (name) update.push({ name: name });

        if (guild) update.push({ guild: guild });

        if (rank) update.push({ rank: rank });

        if (online != null) update.push({ online: online });

        if (ranking) update.push({ ranking: ranking });

        if (kills) update.push({ kills: kills });

        if (deaths) update.push({ deaths: deaths });

        if (mine_level) update.push({ mine_level: mine_level });

        if (refils) update.push({ refils: refils });

        if (enchanted_refils)
          update.push({ enchanted_refils: enchanted_refils });

        if (last_kills) update.push({ last_kills: last_kills });

        if (last_deaths) update.push({ last_deaths: last_deaths });

        for (const [key, value] of Object.entries(update)) {
          await User.updateOne({ uuid: req.params.id }, value);
        }
        res.send(`User with the id ${req.params.id} has been updated`);
      } else {
        res.sendStatus(403);
      }
    });
  } else {
    return res.sendStatus(404);
  }
});
module.exports = router;
