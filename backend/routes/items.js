const express = require("express");
const Item = require("../model/itemModel");
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
  Item.find().exec((err, users) => {
    return res.send(users);
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
        const exist = await Item.findOne({ id: req.body.id });
        if (exist) {
          return res.status(400).send("Item already exists");
        }
        const item = new Item({
          id: req.body.id,
          name: req.body.name,
          description: req.body.description,
          image: req.body.image,
          price: req.body.price,
        });
        try {
          const savedItem = await item.save();
          res.send(savedItem);
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
  Item.find().exec(async function (err, items) {
    const found = await Item.findOne({ id: req.params.id });
    if (!found) return res.status(400).send("Item not found");
    res.send(found);
  });
});

router.delete("/:id", async (req, res) => {
  if (await isValid(token)) {
    getApiKey(token, async function (response) {
      if (response.admin == true) {
        Item.deleteOne({ id: req.params.id }, function (err) {
          res.send(`Removed item with the id ${req.params.id}`);
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
        const { name, description, image, price, shopId, hash } = req.body;
        const update = [];

        if (name) update.push({ name: name });

        if (description) update.push({ description: description });

        if (image) update.push({ image: image });

        if (price) update.push({ price: price });

        for (const [key, value] of Object.entries(update)) {
          await Item.updateOne({ id: req.params.id }, value);
        }
        res.send(`Item with the id ${req.params.id} has been updated`);
      } else {
        res.sendStatus(403);
      }
    });
  } else {
    return res.sendStatus(404);
  }
});
module.exports = router;
