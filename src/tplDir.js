import fs from 'fs-extra'
import { join, dirname } from "path"
import { globby } from "globby"

const tplDir = async (srcDir, destDir, rules) => {
    const files = await globby(["**/*.*", "!.git"], { gitignore: true, absolute: false, dot: true, cwd: srcDir })

    const pathMap = files
        .map(f => [join(srcDir, f), join(destDir, replaceString(f, rules.replace))])
        .filter(f => !rules.exclude.some(e => f[0].includes(e)))

    await copyDirectoryStructure(pathMap)

    for (let [srcFile, destFile] of pathMap) {
        await templateFile(srcFile, destFile, rules)
    }
}

const copyDirectoryStructure = async (pathsMap) => {
    const paths = pathsMap.map(m => [dirname(m[0]), dirname(m[1])]).reduce((prev, cur) => {
        prev[cur[0]] = cur[1];
        return prev;
    }, {})

    for (let path in paths) {
        let plstat = await fs.lstat(path).mode
        await fs.mkdir(paths[path], { mode: plstat, recursive: true })
    }
}

const replaceString = (orig, replaceRules) => {
    let newValue = orig;
    for (let rule in replaceRules) {
        newValue = newValue.replaceAll(rule, replaceRules[rule])
    }

    return newValue
}

const templateFile = async (srcFilePath, destFilePath, rules) => {
    let srcFileContent = await fs.readFile(srcFilePath, "utf-8")
    let srcFileLstat = await fs.lstat(srcFilePath)
    let destFileContent = replaceString(srcFileContent, rules.replace)
    await fs.writeFile(destFilePath, destFileContent, { mode: srcFileLstat.mode })
}

export { tplDir }