const commandLineArgs = require('command-line-args')
const fs = require('fs')

const args = commandLineArgs([
    { name: 'help', alias: 'h', type: Boolean, defaultValue: false },
    { name: 'src', type: String },
    { name: 'out', type: String },
    { name: 'replace', type: String, multiple: true },
    { name: 'exclude', type: String, multiple: true }
])

if (args.help) {
    console.log(`Usage: create-from-tpl-dir --src <template directory> --out <output directory> --replace "<tpl_val>:<out_val>" --ignore "<path>"
    --src                : template source directory
    --out                : output directory
    --replace val1=val2  : replace val1 with val2 while moving from src to out
    --exclude path1      : ignore path1 from the src while moving to out dir
  `)

    process.exit(0)
}

function parse(args) {
    if (!args.src) {
        return ["please provide the --src argument", undefined]
    }

    if (!fs.existsSync(args.src)) {
        return [`src "${args.src}" does not exist`, undefined]
    }

    if (!args.out) {
        return ["please provide the --out argument", undefined]
    }

    if (fs.existsSync(args.out)) {
        return [`out "${args.out}" already exists. Please delete it first.`, undefined]
    }

    const replaceList = args.replace?.map(r => r.split("="))

    const replaceDups = replaceList?.reduce((prev, cur) => {
        prev[cur[0]] = (prev[cur[0]] || 0) + 1;
        return prev
    }, {}) || {}

    const duplicates = Object.keys(replaceDups).filter(k => replaceDups[k] > 1)

    if (duplicates.length > 0) {
        return [`Duplicated replace keys: ${duplicates.join(',')}`, undefined]
    }

    const replace = replaceList?.reduce((prev, cur) => {
        prev[cur[0]] = cur[1];
        return prev
    }, {})

    return [undefined, {
        src: args.src,
        out: args.out,
        replace,
        exclude: args.exclude || []
    }]
}

const [validationMsg, cliArgs] = parse(args)

if (validationMsg !== undefined) {
    console.log(validationMsg)
    process.exit(1)
}

exports.cliArgs = cliArgs