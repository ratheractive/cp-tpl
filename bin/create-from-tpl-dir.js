#! /usr/bin/env node
const { cliArgs } = require('../cliArgsParser')
const { tplDir } = require('../index')

tplDir(cliArgs.src, cliArgs.out, {
    replace: cliArgs.replace,
    exclude: [...cliArgs.exclude, "node_modules", ".git", "dist", "codegen"]
})