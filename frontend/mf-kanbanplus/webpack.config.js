const HtmlWebpackPlugin = require("html-webpack-plugin");
const { ModuleFederationPlugin } = require("webpack").container;
const { dependencies } = require("./package.json");
const Dotenv = require("dotenv-webpack");
const WebpackShellPluginNext = require('webpack-shell-plugin-next');
const webpack = require("webpack"); // <-- Añadir esta linea
// Cargar dotenv manualmente para verificación //descomentar si se quiere local
require('dotenv').config({ path: './.env.development' });
console.log('Variables de entorno cargadas:', Object.fromEntries(
   Object.entries(process.env).filter(([key]) => key.startsWith('REACT_APP'))
));

module.exports = {
entry: "./src/entry",
mode: "development",
devServer: {
    //port: 3017, // Modificar -> LISTO
    port: process.env.REACT_APP_MF_KANBANPLUS_PORT, // Modificar -> listo
    allowedHosts: ["deptmeeting.diinf.usach.cl"], // Convierte la variable en un array con un solo host
},
module: {
    rules: [
    {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: [
        {
            loader: "babel-loader",
            options: {
            presets: [
                "@babel/preset-env",
                "@babel/preset-react",
                "@babel/preset-typescript",
            ],
            },
        },
        ],
    },
    {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
        loader: "babel-loader",
        options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
        },
        },
    },
    {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
    },
    ],
},
plugins: [

    // Añadir DefinePlugin para inyectar variables de entorno //comentar si sequiere local
        new webpack.DefinePlugin({
            "process.env.REACT_APP_BACKEND_IP": JSON.stringify(
                process.env.REACT_APP_BACKEND_IP
            ),
            "process.env.REACT_APP_BACKEND_PORT": JSON.stringify(
                process.env.REACT_APP_BACKEND_PORT
            ),
            "process.env.REACT_APP_MF_LOGIN_PORT": JSON.stringify(
                process.env.REACT_APP_MF_LOGIN_PORT
            ),
            "process.env.REACT_APP_MF_DESARROLLOREUNION_PORT": JSON.stringify(
                process.env.REACT_APP_MF_DESARROLLOREUNION_PORT
            ),
        }),
    

    //new Dotenv({ path: "./.env.development" }), //Modificar si se quiere hacer local

    new WebpackShellPluginNext({
            onBuildStart: {
                scripts: ['echo \x1b]0;mf-kanban\x07'],
                blocking: true,
                parallel: false
            },
        }),


    new HtmlWebpackPlugin({
    template: "./public/index.html",
    }),
    new ModuleFederationPlugin({
    name: "mf_kanbanplus", // Modificar -> listo
    filename: "remoteEntry.js",
    exposes: {
        "./KanbanPlus": "./src/components/KanbanPlus", // Ejemplo, aqui se exponen los componentes -> LISTO
    },
    shared: {
        ...dependencies,
        react: {
        singleton: true,
        requiredVersion: dependencies["react"],
        },
        "react-dom": {
        singleton: true,
        requiredVersion: dependencies["react-dom"],
        },
    },
    }),
],
resolve: {
    extensions: [".tsx", ".ts", ".js", ".jsx"],
},
target: "web",
};

// Solo modificar las lineas que tienen comentarios