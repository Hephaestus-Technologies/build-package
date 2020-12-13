import path from "path";
import build from "./build.mjs";
import * as fs from "./file-system.mjs";

const root = process.cwd();

/**
 * @typedef {object} PackageJson
 * @property {BuildOptions} buildOptions
 * @property {boolean} private
 */

const readJson = async () => {
    const fullFilename = path.join(root, "package.json");
    const fileBuffer = await fs.readFile(fullFilename);
    return JSON.parse(fileBuffer.toString());
};

const json = await readJson();

const isPrivate = json.private != null ? json.private : true;

const buildOptions = {
    outDir: "build",
    inputs: [],
    ...json.buildOptions
};

export {buildOptions, isPrivate};
