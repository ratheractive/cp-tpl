import commandLineArgs from 'command-line-args'
import commandLineUsage from 'command-line-usage'
import { existsSync, lstatSync } from 'fs'

const aboutCli = commandUsage()

let rawCliArgs, args

try {
    rawCliArgs = extractArgs()

    if (rawCliArgs.help) {
        console.log(aboutCli)
        process.exit(0)
    }

    args = validateAndMap(rawCliArgs)
} catch (e) {
    console.error(e.message)
    process.exit(1)
}

function commandUsage() {
    return commandLineUsage([
        {
            header: 'Copy files while replacing values.',
            content: 'This tool allows you to use any directory as a template. It will copy source directory into destination while ' +
                'replacing values and excluding given paths as instructed.'
        },
        {
            header: 'Usage',
            content: 'cp-tpl <src dir> <dest dir> [--replace key1=val1 key2=val2] [--exclude path1 path2]'
        },
        {
            header: 'Options',
            optionList: [
                {
                    name: 'replace',
                    typeLabel: '{underline key=value}',
                    description: 'Replace key with value while materializing the template.'
                },
                {
                    name: 'exclude',
                    typeLabel: '{underline path}',
                    description: 'Exclude the path while materializing the template.'
                },
                {
                    name: 'help',
                    description: 'Print this usage guide.'
                }
            ]
        },
        {
            header: "Examples",
            content: [
                {
                    "example": "cp-tpl dir-in dir-out --replace var1=var2 vara=varb --ignore coverage.xml"
                }
            ]
        }
    ])
}

function extractArgs() {
    let srcArg = commandLineArgs([{ name: "src", defaultOption: true }], { stopAtFirstUnknown: true })

    let destArg = commandLineArgs([{ name: "dest", defaultOption: true }], { stopAtFirstUnknown: true, argv: srcArg._unknown || [] })

    let args = commandLineArgs([
        { name: 'help', alias: 'h', type: Boolean, defaultValue: false },
        { name: 'replace', type: String, multiple: true },
        { name: 'exclude', type: String, multiple: true },
    ], { argv: destArg._unknown || [] })

    return { ...args, src: srcArg.src, dest: destArg.dest }
}

function validateAndMap(args) {
    if (!args.src) {
        throw new Error("Missing argument: source")
    }

    if (!existsSync(args.src)) {
        throw new Error(`Invalid argument: source does not exist - ${args.src}`)
    }

    if (!lstatSync(args.src).isDirectory()) {
        throw new Error("Invalid argument: source must be a directory")
    }

    if (!args.dest) {
        throw new Error("Missing argument: destination")
    }

    if (existsSync(args.dest) && !lstatSync(args.src).isDirectory()) {
        throw new Error("Invalid argument: destination must be a directory")
    }

    const replaceList = args.replace?.map(r => r.split("="))

    const replaceDups = replaceList?.reduce((prev, cur) => {
        prev[cur[0]] = (prev[cur[0]] || 0) + 1;
        return prev
    }, {}) || {}

    const duplicates = Object.keys(replaceDups).filter(k => replaceDups[k] > 1)

    if (duplicates.length > 0) {
        throw new Error(`Invalid argument: duplicated replace keys: ${duplicates.join(',')}`)
    }

    const replace = replaceList?.reduce((prev, cur) => {
        prev[cur[0]] = cur[1];
        return prev
    }, {})

    return {
        src: args.src,
        dest: args.dest,
        replace,
        exclude: args.exclude || []
    }
}

export { args }