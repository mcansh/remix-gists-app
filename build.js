const fsp = require("fs/promises");
const path = require("path");

const esbuild = require("esbuild");

async function build() {
  let start = Date.now();
  console.log("BUILDING FOR VERCEL");

  let base = "server";
  try {
    const configPath = path.join(__dirname, "remix.config.js");
    const remixConfig = await readFile(configPath, "utf8");
    const config = JSON.parse(remixConfig);
    base = config.serverBuildDirectory || base;
  } catch (error) {
    // do nothing, use the default
  }

  await fsp.mkdir(`.output/server/pages`, { recursive: true });

  let end = Date.now();
  console.log(`BUILT FOR VERCEL IN ${end - start}ms`);

  ///////////////////////////////////////////////////////////////

  await fsp.writeFile(
    ".output/routes-manifest.json",
    JSON.stringify({
      version: 3,
      basePath: "/",
      pages404: false,
      rewrites: [
        {
          source: "/(.*)",
          regex: "/(.*)",
          destination: "/",
        },
      ],
    })
  );

  await fsp.writeFile(
    `.output/server/pages/index.nft.json`,
    JSON.stringify({
      version: 1,
      files: [
        {
          input: "../../build",
          output: "./build",
        },
      ],
    })
  );

  await fsp.writeFile(
    ".output/server/pages/index.js",
    `
      const { createRequestHandler } = require("@remix-run/vercel");
      module.exports = createRequestHandler({
        build: require("./build"),
      });
    `.trim()
  );

  end = Date.now();
  console.log(`COPIED IN ${end - start}ms`);
}

build();
