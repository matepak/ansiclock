const http = require("http");

function httpRequest(host, path) {
  const options = {
    host: host,
    path: path,
    method: "GET",
  };
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      if (res.statusCode < 200 || res.statusCode >= 300) {
        return reject(new Error("statusCode:" + res.statusCode));
      }
      let body = [];
      res.on("data", (chunk) => {
        body.push(chunk);
      });
      res.on("end", () => {
        try {
          body = JSON.parse(Buffer.concat(body).toString());
        } catch (e) {
          reject(e);
        }
        resolve(body);
      });
    });
    req.on("error", (e) => {
      reject(e.message);
    });
    req.end();
  });
}

module.exports = function getTimeOffset(cityName, callBack) {
  httpRequest("worldtimeapi.org", "/api/timezone").then((data) => {
    const response = {
      statusCode: 200,
      body: data,
    };
    const regex = new RegExp(`\\w+\/${cityName}`, "g");
    let regionCity = response.body.filter((chunk) => {
      return regex.test(chunk);
    });
    httpRequest(
      "worldtimeapi.org",
      `/api/timezone/${regionCity.toString()}`
    ).then((data) => {
      callBack(data["raw_offset"] + data["dst_offset"]);
    });
  });
};
