import path from "path";
import * as fs from "./file-system.mjs";

const root = process.cwd();

/**
 * @typedef {object} PackageJson
 * @property {ThisBuildOptions} buildOptions
 * @property {boolean} private
 */

const readJson = async () => {
    const fullFilename = path.join(root, "package.json");
    const fileBuffer = await fs.readFile(fullFilename);
    return JSON.parse(fileBuffer.toString());
};

const json = await readJson();

const isPrivate = json.private != null ? json.private : true;

/** @type ThisBuildOptions */
const buildOptions = {
    outDir: "build",
    inputs: [],
    client: null,
    api: null,
    shared: [],
    ...json.buildOptions
};

/**@type PackageJson*/
export {buildOptions, isPrivate};
