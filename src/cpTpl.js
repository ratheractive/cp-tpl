import fs from 'fs-extra'
import { join, dirname } from "path"
import { globby } from "globby"

const validate = (srcDir, destDir, rules) => {
    if (!srcDir) {
        throw new Error("Invalid argument: srcDir can't be empty")
    }

    if (!fs.existsSync(srcDir)) {
        throw new Error(`Invalid argument: srcDir directory does not exist`)
    }

    if (!fs.lstatSync(srcDir).isDirectory()) {
        throw new Error("Invalid argument: srcDir must be a directory")
    }

    if (!destDir) {
        throw new Error("Invalid argument: destDir can't be undefined")
    }

    if (fs.existsSync(destDir) && !fs.lstatSync(destDir).isDirectory()) {
        throw new Error("Invalid argument: destDir must be a directory or not exist at all")
    }
}

const applyDefaultRules = (rules = {}) => ({
    replace: rules.replace ?? {},
    exclude: rules.exclude ?? [],
    gitignore: rules.gitignore ?? true
})

const cpTpl = async (srcDir, destDir, rules) => {
    rules = applyDefaultRules(rules)

    validate(srcDir, destDir, rules)

    const files = await globby(["**/*.*"], { gitignore: rules.gitignore, absolute: false, dot: true, cwd: srcDir })

    let pathMap = files
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
    if (Object.keys(replaceRules).length === 0) {
        return orig
    }

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

export { cpTpl }