import path from "path";

/**
 * @param {string} root
 * @param {ThisBuildOptions} buildOptions
 * @param {string[]} plugins
 * @returns {string}
 */
export default (root, buildOptions, plugins) => {

    const invoke = () => ({
        buildOptions: {
            "clean": true,
            "sourcemap": true
        },
        mount: {
            [directory(buildOptions.client.rootDir)]: "/",
            ...buildOptions.shared.reduce((curr, item) => ({
                ...curr,
                [directory(item)]: `/${item}`
            }), {}),
            [directory("bin")]: "/"
        },
        plugins
    });

    const directory = (dirname) => {
        return path
            .join(root, dirname)
            .split("\\")
            .join("/");
    }

    return JSON.stringify(invoke(), null, 4) + "\n";

}
