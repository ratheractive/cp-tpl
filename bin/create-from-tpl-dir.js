#! /usr/bin/env node
import { cliArgs } from '../src/cliArgsParser.js'
import { tplDir } from '../src/tplDir.js'

await tplDir(cliArgs.src, cliArgs.dest, {
    replace: cliArgs.replace,
    exclude: [...cliArgs.exclude, "node_modules", ".git", "dist", "codegen"]
})