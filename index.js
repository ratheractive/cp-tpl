import fs from 'fs-extra'
import { join, dirname } from "path"
import { globbySync } from "globby"

const tplDir = (srcDir, destDir, rules) => {
    const exclude = rules.exclude
    const files = globbySync(["**/*.*", "!.git", "!templatize"], { gitignore: true, absolute: false, dot: true, cwd: srcDir })

    const pathMap = files
        .map(f => [join(srcDir, f), join(destDir, replaceString(f, rules.replace))])
        .filter(f => !exclude.some(e => f[0].includes(e)))

    copyDirectoryStructure(pathMap)

    for (let [srcFile, destFile] of pathMap) {
        templateFile(srcFile, destFile, rules)
    }
}

const copyDirectoryStructure = (pathsMap) => {
    const paths = pathsMap.map(m => [dirname(m[0]), dirname(m[1])]).reduce((prev, cur) => {
        prev[cur[0]] = cur[1];
        return prev;
    }, {})

    for (let path in paths) {
        let plstat = fs.lstatSync(path).mode
        fs.mkdirSync(paths[path], { mode: plstat, recursive: true })
    }
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

export { tplDir }