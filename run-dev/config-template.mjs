/**
 * @param {string} root
 * @param {BuildOptions} buildOptions
 * @returns {string}
 */
export default (root, buildOptions) => {

    const invoke = () => ({
        buildOptions: {
            "clean": true,
            "sourceMaps": true
        },
        mount: mountedDirectories(),
        plugins: [
            "@snowpack/plugin-sass",
            "@snowpack/plugin-react-refresh"
        ]
    });

    const mountedDirectories = () => ({
        [dir(buildOptions.client.rootDir)]: "/",
        ...buildOptions.shared.reduce(sharedDir, {}),
        [dir("bin")]: "/"
    });

    const sharedDir = (curr, item) => ({
        ...curr,
        [dir(item)]: `/${item}`
    });

    const dir = (item) => `${root.replace(/\\/g, '/')}/${item}`;

    return JSON.stringify(invoke(), null, 4) + "\n";

}
