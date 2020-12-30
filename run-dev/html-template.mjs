export default (clientOptions) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Dev</title>
</head>
<body>
    <div class="app"></div>
    <script type="module">
        import * as React from "react";
        import * as ReactDom from "react-dom";
        import App from "./${clientOptions.app}";
        ReactDom.render(React.createElement(App), document.querySelector(".app"));
    </script>
</body>
</html>
`;
