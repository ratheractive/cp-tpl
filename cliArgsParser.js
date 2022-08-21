const commandLineArgs = require('command-line-args')
const commandLineUsage = require('command-line-usage')
const fs = require('fs')

const args = commandLineArgs([
    { name: 'help', alias: 'h', type: Boolean, defaultValue: false },
    { name: 'src', type: String },
    { name: 'dest', type: String },
    { name: 'replace', type: String, multiple: true },
    { name: 'exclude', type: String, multiple: true }
])

if (args.help) {
    console.log(commandLineUsage([
        {
            header: 'Directory based templating engine.',
            content: 'Use any directory as a template. ' +
                'Unlike other templating engines, this one does not require using any special syntax in the file names or in the files content. ' +
                'All you need to do is specify which strings should be replaced with what, and those will be replaced in both the paths and the content.'
        },
        {
            header: 'Options',
            optionList: [
                {
                    name: 'src',
                    typeLabel: '{underline directory}',
                    description: 'The input template directory.'
                },
                {
                    name: 'dest',
                    typeLabel: '{underline directory}',
                    description: 'The destinations directory.'
                },
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
                    "example": "create-from-tpl-dir --src dir-in --dest dir-out --replace var1=var2 vara=varb --ignore coverage.xml"
                }
            ]
        }
    ]))

    process.exit(0)
}

function parse(args) {
    if (!args.src) {
        return ["please provide the --src argument", undefined]
    }

    if (!fs.existsSync(args.src)) {
        return [`src "${args.src}" does not exist`, undefined]
    }

    if (!args.dest) {
        return ["please provide the --dest argument", undefined]
    }

    if (fs.existsSync(args.dest)) {
        return [`Destination directory "${args.dest}" already exists. Please delete it first.`, undefined]
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
        dest: args.dest,
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