/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-undef */
const fs = require("fs-extra")
const Webpack = require("webpack")
const paths = require("../config/paths")
const config = require("../config/webpack.config")

fs.emptyDirSync(paths.appBuild)
fs.copySync(paths.appPublic, paths.appBuild, {
    dereference: true,
    filter: (file) => !/\.html$/.test(file)
})

const compileStartAt = Date.now()
process.env.NODE_ENV = "production"

console.log("NODE_ENV:", process.env.NODE_ENV)
Webpack(config(process.env.NODE_ENV)).run((err, _stats) => {
    const compileEndAt = Date.now()

    if (err === null) {
        console.info(`Build compiled successfully in ${compileEndAt - compileStartAt} ms`)
    } else {
        console.error(err)
        return
    }

    fs.copySync(paths.appBuild, paths.appRelease, {})
    console.info("Build copied to release directory")
})
