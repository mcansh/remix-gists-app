const fsp = require("fs").promises;
const path = require("path");

/**
 * @type {import("@remix-run/dev/config").AppConfig}
 */
module.exports = {
  appDirectory: "./app",
  publicBuildDirectory: "public/build",
  publicPath: "/build/",
  serverBuildDirectory: "server/build",
  devServerPort: 8002,
};
