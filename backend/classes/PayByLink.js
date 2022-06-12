const itemModel = require("../model/itemModel");
const itemShopModel = require("../model/itemShopModel");
const paymentsModel = require("../model/paymentModel.js");
const fetch = require("node-fetch-commonjs");
const { v4: uuidv4 } = require("uuid");
let uuid = "";
const config = require("../config/config.json");
var sha256 = require("js-sha256");

class PayByLink {
  constructor() {}
  async pay(req, res) {
    if (!req.query.nickname) return res.sendStatus(404);
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
        await Payment.save();
        return res.redirect(data.url);
      });
  }
}
module.exports = PayByLink;
