import { join } from 'path';
import { lstatSync, rmSync } from "fs";
import { compare } from "dir-compare";
import { cpTpl } from '..';

describe("When you copy directory with no transforms", () => {
    let srcDirPath = join(process.cwd(), 'tests', 'data', 'test-input-dir')
    let expectedDirPath = join(process.cwd(), 'tests', 'data', 'test-input-dir')
    let destDirPath = join('/tmp', 'test-tpl-out-happy-no-transforms')
    let rules = { gitignore: false }

    beforeAll(async () => {
        rmSync(destDirPath, { recursive: true, force: true })
        await cpTpl(srcDirPath, destDirPath, rules)
    })

    it("The output is as expected", async () => {
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