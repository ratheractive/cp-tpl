import { lstatSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "fs"
import { join } from "path"

const tplDir = (srcDir, destDir, rules) => {
    const srcDirLstat = lstatSync(srcDir)

    mkdirSync(destDir, { mode: srcDirLstat.mode })

    const srcItems = readdirSync(srcDir)

    for (let srcItemName of srcItems) {
        let srcItemPath = join(srcDir, srcItemName)
        if (shouldExcludePath(srcItemPath, rules)) {
            continue
        }

        let destItemPath = join(destDir, replaceString(srcItemName, rules.replace))

        let srcItemLstat = lstatSync(srcItemPath)
        if (srcItemLstat.isDirectory()) {
            tplDir(srcItemPath, destItemPath, rules)
        } else {
            templateFile(srcItemPath, destItemPath, rules)
        }
    }
}

const shouldExcludePath = (path, rules) => {
    return rules.exclude.find(p => path.includes(p)) !== undefined
}

const replaceString = (orig, replaceRules) => {
    let newValue = orig;
    for (let rule in replaceRules) {
        newValue = newValue.replaceAll(rule, replaceRules[rule])
    }

    return newValue
}

const templateFile = (srcFilePath, destFilePath, rules) => {
    let srcFileContent = readFileSync(srcFilePath, "utf-8")
    let srcFileLstat = lstatSync(srcFilePath)
    let destFileContent = replaceString(srcFileContent, rules.replace)
    writeFileSync(destFilePath, destFileContent, { mode: srcFileLstat.mode })
}

const _tplDir = tplDir
export { _tplDir as tplDir }