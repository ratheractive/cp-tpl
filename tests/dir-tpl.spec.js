const path = require('path')
const fs = require("fs")
const { compareSync, Options, Result } = require("dir-compare");
const { tplDir } = require('..')

describe("When source directory is templatized", () => {
    let srcDirPath = path.join(process.cwd(), 'tests', 'test-input-dir')
    let expectedDirPath = path.join(process.cwd(), 'tests', 'test-output-dir')
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

    it("The output is correct", async () => {
        const diff = compareSync(expectedDirPath, destDirPath, {
            compareContent: true, compareDate: false,
            resultBuilder: function (entry1, entry2, state, level, relativePath, options, statistics, diffSet, reason) {
                let modeDiff = fs.lstatSync(entry1.absolutePath).mode !== fs.lstatSync(entry2.absolutePath).mode

                diffSet.push(
                    {
                        name1: entry1.name,
                        name2: entry2.name,
                        path1: entry1.path,
                        path2: entry2.path,
                        state: modeDiff ? "distinct" : "equal",
                        reason: modeDiff ? "different-mode" : reason
                    }
                )
            }
        })

        const diffs = diff.diffSet?.filter(ds => ds.state !== "equal")

        expect(diffs).toStrictEqual([])
    })
})