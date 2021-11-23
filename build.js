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
    copyDir("public", ".output/static"),
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
    ),
  ]);

  end = Date.now();
  console.log(`COPIED IN ${end - start}ms`);
}

async function copyDir(src, dest) {
  const entries = await fsp.readdir(src, { withFileTypes: true });
  await fsp.mkdir(dest, { recursive: true });
  for (let entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath);
    } else {
      await fsp.copyFile(srcPath, destPath);
    }
  }
}

build();
