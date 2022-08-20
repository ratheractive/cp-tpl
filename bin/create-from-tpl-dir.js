#! /usr/bin/env node
const { cliArgs } = require('../cliArgsParser')
const { tplDir } = require('../index')

console.log(cliArgs)

tplDir(cliArgs.src, cliArgs.out, {
    replace: cliArgs.replace,
    exclude: cliArgs.exclude
})