const fetch = require("node-fetch-commonjs");
class PaySafeCard {
  constructor(options) {
    if (!options) {
      throw new Error("No options provided in class constructor");
    }
    if (!options.key || !options.environment) {
      throw new Error(
        "Options constructor: { key: your api key, environment: TEST or PRODUCTION }"
      );
    }
    if (options.environment != "TEST" && options.environment != "PRODUCTION") {
      throw new Error("Bad environment");
    }
    this.keyEncoded = Buffer.from(options.key).toString("base64");

    if (options.environment == "PRODUCTION") {
      this.host = "https://api.paysafecard.com/v1/";
    } else {
      this.host = "https://apitest.paysafecard.com/v1";
    }
  }
  async request(method, url, options) {
    const headers = {
      authorization: `Basic ${this.keyEncoded}`,
      "content-type": "application/json",
    };
    const data = await fetch(this.host + url, {
      method,
      headers,
      options,
    });
    return await data.json();
  }
  async pay(options) {
    return await this.request("POST", "/payments", {
      body: JSON.stringify({
        type: "PAYSAFECARD",
        amount: options.price,
        currency: option.currency,
        redirect: {
          success_url: option.success_url,
          failure_url: option.failure_url,
          notification_url: option.notification_url,
        },
        customer: {
          id: options.customerId,
        },
      }),
    });
  }
  async getPayment(id) {
    return await this.request("GET", `/payments/${id}`);
  }
  async capturePayment(id) {
    return await this.request("POST", `/payments/${id}/capture`);
  }
}
module.exports = PaySafeCard;
