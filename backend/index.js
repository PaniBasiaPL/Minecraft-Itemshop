const express = require("express");
const cors = require("cors");
const info = require("minecraft-server-util");
const fetch = require("node-fetch-commonjs");
const usersRoute = require("./routes/users");
const itemsRoute = require("./routes/items");
const pageRoute = require("./routes/page");
const itemModel = require("./model/itemModel");
const itemShopModel = require("./model/itemShopModel");
const paymentsModel = require("./model/paymentModel");
const pscModel = require("./model/pscModel");
const apiKey = require("./model/apikeyModel");
const orderModel = require("./model/orderModel");
const usersModel = require("./model/userModel");
const PayByLink = require("./classes/PayByLink");
const pbl = new PayByLink();
const paysafecard = require("./classes/PaySafeCard");
const { v4: uuidv4 } = require("uuid");
var sha256 = require("js-sha256");
let uuid = "";
const mongoose = require("mongoose");
const path = require("path");
// const itemsRoute = require("./routes/itemsRoute");
require("dotenv").config();
const app = express();
const es6renderer = require("express-es6-template-engine");

const config = require("./config/config.json");

// const io = require("socket.io")(require("http").createServer(app));

app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());
app.use(express.urlencoded());

app.engine("html", es6renderer);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "html");

app.use(express.static(path.join(__dirname, "/public")));

mongoose.connect(process.env.DB_CONN, { useNewUrlParser: true }, () =>
  console.log("CONNECTED")
);

const PORT = 5000;

const pscKey = Buffer.from("klucz").toString("base64");
function getApiKey(key, callback) {
  apiKey.findOne({ key: key }, (err, result) => {
    return callback(result);
  });
}

const isValid = async (key) => {
  return await apiKey.exists({ key: key });
};

app.get("/server", async (req, res) => {
  const server = await info.status("ip.pl");
  return res.json({ online: server.onlinePlayers, max: server.maxPlayers });
});
app.get("/user/:id", async (req, res) => {
  res.set("Content-Type", "text/html");
  const response = await fetch(`${config.url}/users/${req.params.id}`)
    .then((response) => response.json())
    .then((data) => {
      res.send(
        '<html> <head><link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet"><link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"><style>' +
          '.StatsBox .player-number{font-size:40px;font-weight:700;margin-left:2rem}.StatsBox img{height:58px} body {background-color: #191919;} .border {background-color: transparent; border-color: #0b86e5; border-radius: 10px;} .button {font-size: 16px;border: 1px solid #0b86e5;border-radius: 10px;max-width: 150;width: 100%;height: 30px;text-align: center;padding: 0px 0;background: 0;overflow: hidden;transition: 0.5s;}.button:hover {background-color: #0b87e554;transform: scale(1.05);}.button a {color: #fff;text-decoration: none;}.button h2 {margin-top: 6px;font-size: 16px;transition: 0.2s linear 0.1s;} .button:focus {outline: none;box-shadow: none;}#navbar {display: flex;margin-top: 15px;}@media screen and (max-width: 680px) {#navbar {flex-direction: column;}}.navbar-nav-btn {color: #aaa;width: auto;padding: 0 20px;height: 50px;line-height: 50px;text-transform: uppercase;transition: 0.3s;}@media (max-width: 400px) {.navbar-nav-btn {visibility: hidden;height: 0;line-height: 70px;padding: 0;width: 100%;text-align: center;transition: 0.4s height, 0.1s visibility;}.navbar-nav-btn.show {visibility: visible;height: 70px;}}.navbar-nav-btn:hover {color: #fff; text-decoration: none;}.navbar-nav-btn:last-child {margin-right: 0;}.navbar-nav-btn:after {content: "";display: block;margin: auto;height: 2px;width: 0;background: 0 0;transition: width 0.4s ease, background-color 0.4s ease;}.nav .active:after,.navbar-nav-btn:hover:after {width: 100%;background: #fff;} .text-center-vertical {height: 50px;line-height: 50px;}.text-center-vertical p {vertical-align: middle;}</style></head><body><noscript class="text-primary">Aby zobaczyć tą stronę musisz włączyć JavaScript.</noscript>' +
          '<div id="navigation"><nav id="navbar" class="nav justify-content-center disable-select"><a href="#home" class="navbar-nav-btn">STRONA GŁÓWNA</a><a href="/shop.php" class="navbar-nav-btn">SKLEP</a><a href="/rules.php" class="navbar-nav-btn">POMOC</a><a href="#ranking" class="navbar-nav-btn">RANKING</a><a href="#plan" class="navbar-nav-btn">PLAN EDYCJI</a></nav></div>' +
          "<div>" +
          '   <div class="container mt-5 justify-content-center" data-aos="fade-in">' +
          '       <div class="border border-1 border-primary d-md-flex d-block p-4">' +
          `           <div class="text-center text-md-left ml-0 ml-lg-4"><img src="https://mc-heads.net/head/${data.uuid}" style="height: 100px;width: 100px;"></div>` +
          '           <div class="ml-4 text-center text-primary text-md-left mt-3 mt-md-0">' +
          `               <div class="d-flex align-items-center justify-content-center justify-content-md-start"><span class="text-center-vertical font-weight-bold" style="line-height: 100px">Online:</span><span class="text-center-vertical font-weight-bold playerOnline" style="line-height: 100px"> ${
            data.online ? "⠀Tak" : "⠀Nie"
          }</span></div>` +
          "           </div>" +
          '           <div class="text-center text-primary ml-auto">' +
          "               <div>" +
          '                   <span class="font-weight-bold text-center-vertical">Profil</span>' +
          "                   <p>" +
          req.params.id +
          "                   </p>" +
          "               </div>" +
          "           </div>" +
          "       </div>" +
          '       <div class="row mt-5">' +
          '           <div class="text-primary col-lg-6 col-md-12 text-center justify-content-center w-md-90" style="height: 100px;">' +
          '               <div class="border border-primary" style="height:100%; font-size: 30px;">' +
          '                   <img src="img/miecz.png"/>' +
          '                   <span class="text-center-vertical font-weight-bold" style="line-height: 100px;">Kille:</span>' +
          `                   <span class="text-center-vertical font-weight-bold kills" style="line-height: 100px;">${data.kills}</span>` +
          "               </div>" +
          "           </div>" +
          '           <div class="text-primary col-lg-6 col-md-12 mt-5 mt-lg-0 text-center w-md-90" style="height: 100px;">' +
          '               <div class="border border-primary" style="height:100%; font-size: 30px;">' +
          '                   <img src="img/czaszka.png"/>' +
          `                   <span class="text-center-vertical font-weight-bold" style="line-height: 100px;">Śmierci:</span>` +
          `                   <span class="text-center-vertical font-weight-bold deaths" style="line-height: 100px;">${data.deaths}</span>` +
          "               </div>" +
          "           </div>" +
          '           <div class="text-primary col-lg-6 col-md-12 mt-5 text-center w-md-90" style="height: 100px;">' +
          '               <div class="border border-primary" style="height:100%; font-size: 30px;">' +
          '                   <img src="img/jablko.png"/>' +
          '                   <span class="text-center-vertical font-weight-bold" style="line-height: 100px;">Zjedzone refy:</span>' +
          `                   <span class="text-center-vertical font-weight-bold refs" style="line-height: 100px;">${data.refils}</span>` +
          "               </div>" +
          "           </div>" +
          '           <div class="text-primary col-lg-6 col-md-12 mt-5 text-center w-md-90" style="height: 100px;">' +
          '               <div class="border border-primary" style="height:100%; font-size: 30px;">' +
          '                   <img src="img/kox.png"/>' +
          '                   <span class="text-center-vertical font-weight-bold" style="line-height: 100px;">Zjedzone koxy:</span>' +
          `                   <span class="text-center-vertical font-weight-bold enchrefs" style="line-height: 100px;">${data.enchanted_refils}</span>` +
          "               </div>" +
          "           </div>" +
          '           <div class="text-primary col-lg-6 col-md-12 mt-5 text-center w-md-90" style="height: 100px;">' +
          '               <div class="border border-primary" style="height:100%; font-size: 30px;">' +
          '                   <img src="img/puchar.png"/>' +
          '                   <span class="text-center-vertical font-weight-bold" style="line-height: 100px;">Ranking:</span>' +
          `                   <span class="text-center-vertical font-weight-bold ranking" style="line-height: 100px;">${data.ranking}</span>` +
          "               </div>" +
          "           </div>" +
          '           <div class="text-primary col-lg-6 col-md-12 mt-5 text-center w-md-90" style="height: 100px;">' +
          '               <div class="border border-primary" style="height:100%; font-size: 30px;">' +
          '                   <img src="img/kilof.png"/>' +
          '                   <span class="text-center-vertical font-weight-bold" style="line-height: 100px;">Poziom kopania:</span>' +
          `                   <span class="text-center-vertical font-weight-bold minelvl" style="line-height: 100px;">${data.mine_level}</span>` +
          "               </div>" +
          "           </div>" +
          '           <div class="col-md-12 mt-5 text-center text-primary">' +
          '               <div class="border border-primary" style="height:100%; font-size: 30px;">' +
          '                   <span class="text-center-vertical font-weight-bold" style="line-height: 100px;">Gildia:</span>' +
          `                   <span class="text-center-vertical font-weight-bold guild" style="line-height: 100px;">${data.guild}</span>` +
          "               </div>" +
          "           </div>" +
          "       </div>" +
          "   </div>" +
          "</div>" +
          '<script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>' +
          `<script>AOS.init({once: true});</script><script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>` +
          "</body></html>"
      );
    });
});

// app.post("/login", (req, res) => {
//   console.log(req.body);
//   if (!req.body.login || !req.body.pass) return res.sendStatus(400);

//   if (req.body.login != "PaniBasiaPL" || req.body.pass != "123")
//     return res.redirect(`${config.url}/adminpanel.html?login=false`);
//   res.send("elo");
// });
app.post("/payinfo", async (req, res) => {
  const is = await itemShopModel.findOne();
  const control = req.body.control.split("/");
  if (await paymentsModel.findOne({ tid: control[0] })) {
    if (
      await paymentsModel.findOne({ nickname: control[1], tid: control[0] })
    ) {
      if (
        await paymentsModel.findOne({
          id: control[2],
          nickname: control[1],
          tid: control[0],
        })
      ) {
        const item = await itemModel.findOne({
          id: control[2],
          tid: control[0],
        });
        if (
          sha256(
            `${is.transfer[0].hash}|${is.transfer[0].shopId}|${req.body.amountPaid}|${req.body.control}|${item.description}|${is.email}|${config.url}/payinfo|${config.url}/website/thankyou.html`
          ) == req.body.signature
        ) {
          //  wyslij komende item.command
          await paymentsModel.findOneAndRemove({
            nickname: control[1],
            tid: control[0],
            id: control[2],
          });
          console.log(
            `removed payment with tid ${control[0]} nickname ${control[1]} and id ${control[2]}`
          );
          //add order to database

          const order = new orderModel({
            nickname: control[1],
            price: req.body.amountPaid,
            itemId: control[2],
            itemName: item.name,
          });
          if (await usersModel.findOne({ nickname: control[1] }))
            usersModel.findOneAndUpdate(
              { name: control[1] },
              { $inc: { paid: req.body.amountPaid } }
            );
          try {
            order.save();
            /*
            new orderModel({
              nickname: control[1],
              price: req.body.amountPaid,
              itemId: control[2],
              itemName: item.name,
            }).save();
            */
          } catch {
            console.log("Error with saving order");
          }
        } else console.log("Bad signature");
      } else console.log("Bad id");
    } else console.log("Bad nickname");
  } else console.log("Bad tid");
  res.sendStatus(200).end();
});

app.get("/pay/:id", async (req, res) => {
  if (req.query.nickname == null) return res.sendStatus(404);
  const item = await itemModel.findOne({ id: req.params.id });
  if (!item) return res.send("Item not found");
  const p = await paymentsModel.findOne({
    nickname: req.query.nickname,
    id: req.params.id,
  });
  if (p) uuid = p.tid.replace("tid:", "");
  else uuid = await uuidv4();
  const is = await itemShopModel.findOne();
  fetch("https://secure.paybylink.pl/api/v1/transfer/generate", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      shopId: is.transfer[0].shopId,
      price: parseFloat(item.price),
      control: `tid:${uuid}/${req.query.nickname}/${req.params.id}`,
      description: item.description,
      email: is.email,
      notifyURL: `${config.url}/payinfo`,
      returnUrlSuccess: `${config.website}/website/thankyou.html`,
      signature: sha256(
        `${is.transfer[0].hash}|${is.transfer[0].shopId}|${parseFloat(
          item.price
        )}|tid:${uuid}/${req.query.nickname}/${req.params.id}|${
          item.description
        }|${is.email}|${config.url}/payinfo|${
          config.website
        }/website/thankyou.html`
      ),
    }),
  })
    .then((response) => response.json())
    .then(async (data) => {
      console.log(uuid);
      if (p) return res.redirect(data.url);
      const Payment = new paymentsModel({
        nickname: req.query.nickname,
        tid: "tid:" + uuid,
        id: req.params.id,
      });
      console.log(data);
      await Payment.save();
      res.redirect(data.url);
    });
});

app.get("/pscpayinfo/:id", async (req, res) => {
  const pscres = await fetch(
    `https://api.paysafecard.com/v1/payments/${req.params.id}`,
    {
      method: "POST",
      headers: {
        authorization: `Basic ${config.apiKey}`,
        "content-type": "application/json",
      },
    }
  );
  const info = await pscres.json();
  if (info.status == "AUTHORIZED") {
    const paymentInfo = await pscModel.findOne({ paymentId: req.params.id });
    const captureInfo = await fetch(
      `https://api.paysafecard.com/v1/payments/${paymentInfo.paymentId}/capture`,
      {
        headers: {
          authorization: `Basic ${pscKey}`,
          "content-type": "application/json",
        },
      }
    );
    if (captureInfo.status == "SUCCESS") {
      const item = await itemModel.findOne({ id: paymentInfo.id });
      //  wyślij komende item.command
      console.log(paymentInfo.nickname);
      console.log(item);
    }
  }
  res.sendStatus(200).end();
  // const info2 = await psc.getPayment(req.params.id);
  // if (info2.status == "AUTHORIZED") {
  //   const paymentInfo = pscModel.findOne({ paymentId: req.params.id });
  //   const captureInfo = await psc.capturePayment(paymentInfo.paymentId);
  //   if (captureInfo.status == "SUCCESS") {
  //     const item = itemModel.findOne({ id: paymentInfo.id });
  //     //  wyślij komende item.command
  //     console.log(item);
  //   }
  // }
});

app.get("/pay/psc/:id", async (req, res) => {
  if (!req.query.nickname) return res.sendStatus(404);
  const item = await itemModel.findOne({ id: req.params.id });
  if (!item) return res.send("Item not found");
  const is = await itemShopModel.findOne();
  fetch("https://api.paysafecard.com/v1/", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      authorization: `Basic ${is.psc.apiKey}`,
    },
    body: JSON.stringify({
      type: "PAYSAFECARD",
      amount: item.price,
      currency: `${is.psc[0].currency}`,
      redirect: {
        success_url: `${config.website}/website/thank_you.html`,
        failure_url: `${config.website}/website/failed.html`,
        notification_url: `${config.url}/pscpayinfo/{payment_id}`,
      },
      customer: {
        id: `${is.psc[0].id}`,
      },
    }),
  })
    .then((response) => response.json())
    .then(async (data) => {
      const PAYMENT_ID = data.id;
      const Payment = new pscModel({
        nickname: req.query.nickname,
        paymentId: PAYMENT_ID,
        id: req.params.id,
      });
      await Payment.save();
      res.redirect(data.redirect.auth_url);
    });
  // const pscRes = await psc.pay({
  //   price: item.price,
  //   currency: "PLN",
  //   success_url: "127.0.0.1/website/thank_you.html",
  //   failure_url: "127.0.0.1/website/failed.html",
  //   notification_url: "127.0.0.1:5000/pscpayinfo/{payment_id}",
  //   customerId: "merchantclientid5HzDvoZSodKDJ7X7VQKrtestAutomation",
  // });
  // const PAYMENT_ID = pscRes.id;
  // const Payment = new pscModel({
  //   nickname: req.query.nickname,
  //   paymentId: PAYMENT_ID,
  //   id: req.params.id,
  // });
  // await Payment.save();
  // res.redirect(pscRes.redirect.auth_url);
});

app.get("/paybylink/:id/:type", async (req, res) => {
  switch (req.params.type) {
    case "transfer":
      pbl.pay(req, res);
      break;
    case "psc":
      const item = await itemModel.findOne({ id: req.params.id });
      const psc = await paysafecard.pay({
        amount: item.price,
        currency: "PLN",
        success_url: `${config.website}/ty.html`,
        failture_url: `${config.website}/failed.html`,
        notification_url: `${config.url}/pscpayinfo/{payment_id}`,
        customerId: "",
      });
      const PAYMENT_ID = psc.id;
      const Payment = new pscModel({
        nickname: req.query.nickname,
        paymentId: PAYMENT_ID,
        id: req.params.id,
      });
      await Payment.save();
      res.redirect(psc.redirect.auth_url);
      break;
    default:
      res.sendStatus(404);
      break;
  }
});

app.patch("/is", async (req, res) => {
  const token = req.header("X-Api-Key");
  if (!token) {
    return res.sendStatus(401);
  }
  if (await isValid(token)) {
    getApiKey(token, async (response) => {
      if (response.admin == true) {
        const { email, transfer, psc, sms } = req.body;
        const update = [];

        if (email) update.push({ email: email });

        if (transfer) update.push({ transfer: transfer });

        if (psc) update.push({ psc: psc });

        if (sms) update.push({ sms: sms });

        for (const [key, value] of Object.entries(update)) {
          await itemShopModel.updateOne({}, value);
        }
        res.send("updated");
      } else {
        res.sendStatus(403);
      }
    });
  } else {
    return res.sendStatus(403);
  }
});

app.get("/orders/:count", async (req, res) => {
  const lastOrders = await orderModel
    .find()
    .sort("-date")
    .limit(parseInt(req.params.count));
  res.send(lastOrders);
});

app.get("/richest/:count", async (req, res) => {
  const richestPlayers = await usersModel
    .find({}, "paid name uuid")
    .sort("-paid")
    .limit(parseInt(req.params.count));
  res.send(richestPlayers);
});

// app.get("/*", (req, res) => {
//   return res.send("Page not found");
// });

app.use("/users", usersRoute);
app.use("/items", itemsRoute);
app.use("/", pageRoute);

app.listen(PORT, () => {
  console.log(`app started on port ${PORT}`);
});
