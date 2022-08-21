#! /usr/bin/env node
import { cliArgs } from '../cliArgsParser.js'
import { tplDir } from '../index.js'

await tplDir(cliArgs.src, cliArgs.dest, {
    replace: cliArgs.replace,
    exclude: [...cliArgs.exclude, "node_modules", ".git", "dist", "codegen"]
})