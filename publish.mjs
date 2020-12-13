import build from "./build.mjs";
import bumpVersion from "./bump-version.mjs";
import {exec} from "child_process";
import buildOptions from "./build-options.mjs";

const publicFlags = process.argv.includes("--public") ? "--access public" : "";

const version = (process.env.version || "v0.1.0").slice(1);
const root = process.cwd();

await build(root, buildOptions);
await bumpVersion(root, version, buildOptions);

const command = `npm publish ./${buildOptions.outDir} ${publicFlags}`;
const child = exec(command, {env: process.env});
child.stdout.on("data", data => console.log(data.toString()));
child.stderr.on("data", data => console.error(data.toString()));
child.on("close", () => {});
