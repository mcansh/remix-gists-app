const path = require("path");

const esbuild = require("esbuild");
const fse = require("fs-extra");

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

  await esbuild.build({
    entryPoints: [`${base}/index.js`],
    outfile: path.join(".output/server/pages", "index.js"),
    bundle: true,
    platform: "node",
  });

  let end = Date.now();
  console.log(`BUILT FOR VERCEL IN ${end - start}ms`);

  ///////////////////////////////////////////////////////////////

  start = Date.now();

  console.log("COPYING FILES TO .OUTPUT");

  await Promise.all([
    fse.copy("public/build", ".output/static/build"),
    fse.writeJSON(".output/routes-manifest.json", {
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
    }),
  ]);

  end = Date.now();
  console.log(`COPIED IN ${end - start}ms`);
}

build();
