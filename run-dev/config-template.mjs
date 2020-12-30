/**
 * @param {string} root
 * @param {string} rootDir
 * @returns {string}
 */
export default (root, rootDir) => `
module.exports = {
    buildOptions: {
        clean: true,
        sourceMaps: true
    },
    mount: {
        "${root.replace(/\\/g, '/')}/${rootDir.replace(/\\/g, '/')}": "/",
        "${root.replace(/\\/g, '/')}/bin": "/"
    },
    plugins: [
        "@snowpack/plugin-sass",
        "@snowpack/plugin-react-refresh"
    ]
};
`;
