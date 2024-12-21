const HtmlWebpackPlugin = require("html-webpack-plugin");
const { ModuleFederationPlugin } = require("webpack").container;
const { dependencies } = require("./package.json");
const WebpackShellPluginNext = require('webpack-shell-plugin-next');
const webpack = require("webpack");
const Dotenv = require("dotenv-webpack");
// Cargar dotenv manualmente para verificación
//require('dotenv').config({ path: './.env.development' });
//console.log('Variables de entorno cargadas:', Object.fromEntries(
//    Object.entries(process.env).filter(([key]) => key.startsWith('REACT_APP'))
//  ));

module.exports = {
entry: "./src/entry",
mode: "development",
devServer: {
    port: process.env.REACT_APP_MF_DESARROLLOREUNION_PORT, // Modificar -> listo
    allowedHosts: process.env.REACT_APP_ALLOWED_HOSTS ? [process.env.REACT_APP_ALLOWED_HOSTS] : [],
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
    {
        // AÑADIR -> permite la carga de imagenes
        test: /\.(png|jpe?g|gif|pdf)$/i,
        use: [
        {
            loader: "file-loader",
            options: { name: 'assets/[hash].[ext]' },
        },
        ],
    }
    ],
},
plugins: [

    // new Dotenv({ path: "./.env.development" }), // Jyr Comentario: Si quieres usarlo adelante, pero no estaré de acuerdo...
    // Razon? Porque se cargan las variables del archivo, lo siguiente sigue siendo necesario para el despliegue.
    // Si bien ambos pueden convivir prefiero evitarlo, ya que declararlos deja en claro que variables son usadas en el codigo.
    // En lo personal creo que la claridad es importante para el desarrollador. En especial para los que se unan al proyecto.
    new webpack.DefinePlugin({
        "process.env.REACT_APP_BACKEND_GATEWAY": JSON.stringify(
            process.env.REACT_APP_BACKEND_GATEWAY
        ),
        "process.env.REACT_APP_BACKEND_IO": JSON.stringify(
            process.env.REACT_APP_BACKEND_IO
        ),
    }),

    new WebpackShellPluginNext({
        onBuildStart:{
          scripts: ['echo \x1b]0;mf-desarrolloreunion\x07'],
          blocking: true,
          parallel: false
        },
      }),
    new HtmlWebpackPlugin({
    template: "./public/index.html",
    }),
    new ModuleFederationPlugin({
    name: "mf_desarrolloreunion", // Modificar -> listo
    filename: "remoteEntry.js",
    exposes: {
        "./FormularioPreReunion": "./src/components/FormularioPreReunion", // Ejemplo, aqui se exponen los componentes -> listo
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

module.exports.plugins.map((plugin) => {console.log(plugin)});
console.log(module.exports.devServer);
// Solo modificar las lineas que tienen comentarios