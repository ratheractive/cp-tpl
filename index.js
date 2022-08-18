const fs = require("fs")
const path = require("path")

const tplDir = (srcDir, destDir, rules) => {
    const srcDirLstat = fs.lstatSync(srcDir)

    fs.mkdirSync(destDir, { mode: srcDirLstat.mode })

    const srcItems = fs.readdirSync(srcDir)

    for (let srcItemName of srcItems) {
        let srcItemPath = path.join(srcDir, srcItemName)
        if (shouldExcludeFile(srcItemPath, rules.exclude)) {
            continue
        }

        let destItemPath = path.join(destDir, replaceString(srcItemName, rules.replace))

        let srcItemLstat = fs.lstatSync(srcItemPath)
        if (srcItemLstat.isDirectory()) {
            tplDir(srcItemPath, destItemPath, rules)
        } else {
            templateFile(srcItemPath, destItemPath, rules)
        }
    }
}

const shouldExcludeFile = (path, excludeRules) => {
    return excludeRules.find(p => path.includes(p)) !== undefined
}

const replaceString = (orig, replaceRules) => {
    let newValue = orig;
    for (let rule in replaceRules) {
        newValue = newValue.replaceAll(rule, replaceRules[rule])
    }

    return newValue
}

const templateFile = (srcFilePath, destFilePath, rules) => {
    let srcFileContent = fs.readFileSync(srcFilePath, "utf-8")
    let srcFileLstat = fs.lstatSync(srcFilePath)
    let destFileContent = replaceString(srcFileContent, rules.replace)
    fs.writeFileSync(destFilePath, destFileContent, { mode: srcFileLstat.mode })
}

exports.tplDir = tplDir;