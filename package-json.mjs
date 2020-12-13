import path from "path";
import build from "./build.mjs";
import * as fs from "./file-system.mjs";

const root = process.cwd();

/**
 * @typedef {object} PackageJson
 * @property {BuildOptions} buildOptions
 * @property {boolean} private
 */

const readJson = async (filename) => {
    const fullFilename = path.join(root, filename);
    const fileBuffer = await fs.readFile(fullFilename);
    return JSON.parse(fileBuffer.toString());
};

const json = readJson();

export const isPrivate = json.private != null ? json.private : true;

export const buildOptions = {
    outDir: "build",
    inputs: [],
    ...json.buildOptions
};
