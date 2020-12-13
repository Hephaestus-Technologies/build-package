import path from "path";
import build from "./build.mjs";
import bumpVersion from "./bump-version.mjs";
import * as fs from "./file-system.mjs";
import {spawn} from "child_process";

const version = (process.env.version || "v0.1.0").slice(1);
const root = process.cwd();

const readJson = async (filename) => {
    const fullFilename = path.join(root, filename);
    const fileBuffer = await fs.readFile(fullFilename);
    return JSON.parse(fileBuffer.toString());
};

const buildOptions = {
    outDir: "build",
    inputs: [],
    ...(await readJson("./package.json")).buildOptions
};
await build(root, buildOptions);
await bumpVersion(root, version, buildOptions);

const child = spawn("npm", ["publish", buildOptions.outDir]);
child.stdout.on("data", data => console.log(data));
child.stderr.on("data", data => console.error(data));
child.on("close", () => {});
