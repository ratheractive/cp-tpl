const path = require('path')
const fs = require("fs")
const { tplDir } = require('..')

describe("When source directory is templatized", () => {
    let srcDirPath = path.join(process.cwd(), 'tests', 'test-tpl-dir')
    let destDirPath = path.join('/tmp', 'test-tpl-out-dir')
    let rules = [
        {
            action: "replace",
            from: "TemplateValueOne",
            to: "ActualValueOne"
        }
    ]


    beforeAll(async () => {
        fs.rmSync(destDirPath, { recursive: true, force: true })
        await tplDir(srcDirPath, destDirPath, rules)
    })

    it("", async () => {
    })
})  