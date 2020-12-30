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
        import Root from "./${clientOptions.rootComponent}";
        ReactDom.render(React.createElement(Root), document.querySelector(".app"));
    </script>
</body>
</html>
`;
