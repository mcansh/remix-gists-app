const path = require("path");

const esbuild = require("esbuild");
const fse = require("fs-extra");

async function build() {
  let start = Date.now();
  console.log("BUILDING");

  await esbuild.build({
    entryPoints: ["server/index.js"],
    outfile: path.join(".output/server/pages", "index.js"),
    bundle: true,
    platform: "node",
  });

  let end = Date.now();
  console.log(`BUILT IN ${end - start}ms`);

  ///////////////////////////////////////////////////////////////

  start = Date.now();

  console.log("COPYING FILES TO .OUTPUT");

  await fse.mkdir(".output/static", { recursive: true });

  await Promise.all([
    fse.copy("public/build", ".output/static/build"),
    fse.copyFile("routes-manifest.json", ".output/routes-manifest.json"),
  ]);

  end = Date.now();
  console.log(`COPIED IN ${end - start}ms`);
}

build();
