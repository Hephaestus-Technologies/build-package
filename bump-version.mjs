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

    const defaults = {
        description: "",
        repository: "",
        license: "MIT"
    };

    const templatePath = path.join(root, "./package.json");
    const outputPath = path.join(root, path.join("./", outDir, "package.json"));

    const raw = await fs.readFile(templatePath);
    const {name, buildOptions, scripts, ...json} = JSON.parse(raw.toString());
    const result = JSON.stringify({name, version, ...defaults, ...json}, null, 2);

    await fs.writeFile(outputPath, result);

};
