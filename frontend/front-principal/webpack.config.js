const HtmlWebpackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const { dependencies } = require("./package.json");
const webpack = require("webpack"); // <-- Añadir esta linea
// Cargar dotenv manualmente para verificación //descomentar si se quiere local
//require('dotenv').config({ path: './.env.development' });
//console.log('Variables de entorno cargadas:', Object.fromEntries(
//    Object.entries(process.env).filter(([key]) => key.startsWith('REACT_APP'))
//  ));
const WebpackShellPluginNext = require("webpack-shell-plugin-next");

// Cargar dotenv manualmente para verificación
// require("dotenv").config({ path: "./.env.development" });
//console.log(
  //"Variables de entorno cargadas:",
  //Object.fromEntries(
//    Object.entries(process.env).filter(([key]) => key.startsWith("REACT_APP"))
//  )
//);

module.exports = {
  entry: "./src/entry",
  mode: "development",
  devServer: {
    port: process.env.REACT_APP_PRINCIPAL_PORT, // Puerto donde se levanta la app -> listo
    historyApiFallback: true, // Necesario para que funcione React Router
    allowedHosts: process.env.REACT_APP_ALLOWED_HOSTS ? [process.env.REACT_APP_ALLOWED_HOSTS] : [], // Convierte la variable en un array con un solo host
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
    // Añadir DefinePlugin para inyectar variables de entorno
    new webpack.DefinePlugin({
      "process.env.REACT_APP_BACKEND_URL": JSON.stringify(
          process.env.REACT_APP_BACKEND_URL
      ),
    }),

    //new Dotenv({ path: "./.env.development" }), //Modificar si se quiere hacer local

    new WebpackShellPluginNext({
      onBuildStart: {
        scripts: ["echo Front-principal"],
        blocking: true,
        parallel: false,
      },
    }),
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
    new ModuleFederationPlugin({
      name: "front_principal", // Aqui se define el nombre de la aplicación -> listo
      remotes: {
        MF_HOME: `mf_home@${process.env.REACT_APP_MF_URL}${process.env.REACT_APP_MF_HOME}/remoteEntry.js`, // Nombre de la aplicación hijo + @http://ip:puertoMFhijo/RemoteEntry.js -> listo
        MF_LOGIN: `mf_login@${process.env.REACT_APP_MF_URL}${process.env.REACT_APP_MF_LOGIN}/remoteEntry.js`,
        MF_PROYECTOS: `mf_proyectos@${process.env.REACT_APP_MF_URL}${process.env.REACT_APP_MF_PROYECTOS}/remoteEntry.js`,
        MF_PERFIL: `mf_perfil@${process.env.REACT_APP_MF_URL}${process.env.REACT_APP_MF_PERFIL}/remoteEntry.js`,
        MF_DESARROLLOREUNION: `mf_desarrolloreunion@${process.env.REACT_APP_MF_URL}${process.env.REACT_APP_MF_DESARROLLOREUNION}/remoteEntry.js`,
        MF_INFORMACION: `mf_informacion@${process.env.REACT_APP_MF_URL}${process.env.REACT_APP_MF_INFORMACION}/remoteEntry.js`,
        MF_TAREAS: `mf_tareas@${process.env.REACT_APP_MF_URL}${process.env.REACT_APP_MF_TAREAS}/remoteEntry.js`,
        MF_KANBANPLUS: `mf_kanbanplus@${process.env.REACT_APP_MF_URL}${process.env.REACT_APP_MF_KANBANPLUS}/remoteEntry.js`,
      },
      shared: {
        ...dependencies, // other dependencies
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
    extensions: [".js", ".jsx", ".ts", ".tsx"],
  },
  target: "web",
  optimization: {
    minimize: false,
  },
};

module.exports.plugins.map((plugin) => {console.log(plugin)});
console.log(module.exports.devServer);