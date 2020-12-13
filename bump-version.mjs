import * as fs from "./file-system.mjs";
import * as path from "path";

/**
 * @param {string} root
 * @param {string} version
 * @param {BuildOptions} buildOptions
 * @param buildOptions.outDir
 * @returns {Promise<void>}
 */
export default async (root, version, {outDir}) => {

    const templatePath = path.join(root, "./package.json");
    const outputPath = path.join(root, path.join("./", outDir, "package.json"));

    const raw = await fs.readFile(templatePath);
    const {buildOptions, scripts, ...json} = JSON.parse(raw.toString());
    const result = JSON.stringify({version, ...json}, null, 2);

    await fs.writeFile(outputPath, result);

};
