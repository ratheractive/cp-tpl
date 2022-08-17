const fs = require("fs")
const path = require("path")

const tplDir = async (srcDir, destDir, rules) => {
    const srcDirLstat = fs.lstatSync(srcDir)

    fs.mkdirSync(destDir, { mode: srcDirLstat.mode })

    const srcItems = fs.readdirSync(srcDir)

    for (let srcItemName of srcItems) {
        let srcItemPath = path.join(srcDir, srcItemName)
        if (shouldIgnore(srcItemPath, rules)) {
            continue
        }

        let destItemPath = path.join(destDir, templateString(srcItemName, rules))

        let srcItemLstat = fs.lstatSync(srcItemPath)
        if (srcItemLstat.isDirectory()) {
            await tplDir(srcItemPath, destItemPath, rules)
        } else {
            templateFile(srcItemPath, destItemPath, rules)
        }
    }
}

const shouldIgnore = (path, rules) => {
    return rules.filter(r => r.action === "ignore" && r.paths.find(p => path.includes(p)) !== undefined).length > 0
}

const templateString = (orig, rules) => {
    let newValue = orig;
    for (let rule of rules) {
        switch (rule.action) {
            case "replace": newValue = newValue.replaceAll(rule.from, rule.to)
        }
    }

    return newValue
}

const templateFile = (srcFilePath, destFilePath, rules) => {
    let srcFileContent = fs.readFileSync(srcFilePath, "utf-8")
    let srcFileLstat = fs.lstatSync(srcFilePath)
    let destFileContent = templateString(srcFileContent, rules)
    fs.writeFileSync(destFilePath, destFileContent, { mode: srcFileLstat.mode })
}

exports.tplDir = tplDir;