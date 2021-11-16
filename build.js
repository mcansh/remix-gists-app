const path = require("path");

const esbuild = require("esbuild");

async function build() {
  let start = Date.now();
  console.log("BUILDING");

  /**
   * @type {import('esbuild').BuildOptions}
   */
  const default_options = {
    entryPoints: ["server/index.js"],
    outfile: path.join(".output/server/pages", "index.js"),
    bundle: true,
    platform: "node",
  };

  await esbuild.build(default_options);

  let end = Date.now();
  console.log(`BUILT IN ${end - start}ms`);
}

build();
