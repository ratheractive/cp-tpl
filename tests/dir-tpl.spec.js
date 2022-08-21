import { join } from 'path';
import { lstatSync, rmSync } from "fs";
import { compare } from "dir-compare";
import { tplDir } from '..';

describe("When source directory is templatized", () => {
    let srcDirPath = join(process.cwd(), 'tests', 'test-input-dir')
    let expectedDirPath = join(process.cwd(), 'tests', 'test-output-dir')
    let destDirPath = join('/tmp', 'test-tpl-out-dir')
    let rules = {
        replace: {
            "TemplateValueOne": "ActualValueOne"
        },
        exclude: ["/ToNotBeCopied", "ToNotBeCopied.txt"]
    }

    beforeAll(async () => {
        rmSync(destDirPath, { recursive: true, force: true })
        await tplDir(srcDirPath, destDirPath, rules)
    })

    it("The output is correct", async () => {
        const diff = await compare(expectedDirPath, destDirPath, {
            compareContent: true, compareDate: false,
            resultBuilder: function (entry1, entry2, state, level, relativePath, options, statistics, diffSet, reason) {

                let modeDiff = entry1 !== undefined && entry2 !== undefined
                    ? lstatSync(entry1.absolutePath).mode !== lstatSync(entry2.absolutePath).mode
                    : false

                diffSet.push(
                    {
                        name1: entry1?.name,
                        name2: entry2?.name,
                        path1: entry1?.path,
                        path2: entry2?.path,
                        state: modeDiff ? "distinct" : state,
                        reason: modeDiff ? "different-mode" : reason
                    }
                )
            }
        })

        const diffs = diff.diffSet?.filter(ds => ds.state !== "equal")

        expect(diffs).toStrictEqual([])
    })
})