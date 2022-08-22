#! /usr/bin/env node
import { args } from '../src/cliArgsParser.js'
import { cpTpl } from '../src/cpTpl.js'

await cpTpl(args.src, args.dest, {
    replace: args.replace,
    exclude: [...args.exclude, ".git"]
})