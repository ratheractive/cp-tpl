const fs = require("fs")
const path = require("path")

const tplDir = async (srcDir, destDir, rules) => {
    const srcLstat = fs.lstatSync(srcDir)

    fs.mkdirSync(destDir, { mode: srcLstat.mode })

    const srcItems = fs.readdirSync(srcDir)

    for (let srcItemName of srcItems) {
        let srcPath = path.join(srcDir, srcItemName)
        let destPath = path.join(destDir, templateString(srcItemName, rules))

        let lstat = fs.lstatSync(srcPath)
        if (lstat.isDirectory()) {
            await tplDir(srcPath, destPath, rules)
        } else {
            templateFile(srcPath, destPath, rules)
        }
    }
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