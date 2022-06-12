const router = require("express").Router();
const config = require("../config/config.json");

router.get("/", (req, res) => {
  res.render("index", {
    locals: {
      path: "/",
      config,
    },
  });
});

router.get("/rules", (req, res) => {
  res.render("rules", {
    locals: {
      path: "/rules",
      config,
    },
  });
});

router.get("/shop", (req, res) => {
  res.render("/shop", {
    locals: {
      path: "/shop",
      config,
    },
  });
});

module.exports = router;
