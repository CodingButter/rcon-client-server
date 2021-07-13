const { exec } = require("child_process");

const toIp = async (ipdomain) => {
  return new Promise((resolve, reject) => {
    var child = exec(`ping ${ipdomain} && exit`, {
      shell: true,
    });

    child.stderr.on("data", function (data) {
      reject(data.toString());
    });
    child.stdout.on("data", async (data) => {
      const results = data.toString();
      resolve(results.split("from")[1].split(":")[0].trim());
    });
    child.on("close", function (exitCode) {});
  });
};

module.exports = toIp;
