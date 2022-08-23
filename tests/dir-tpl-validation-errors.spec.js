import { join } from 'path';
import { cpTpl } from '..';

describe("When things go wrong", () => {
    let srcDirPath = join(process.cwd(), 'tests', 'data', 'test-input-dir')
    let someFilePath = join(process.cwd(), 'tests', 'data', 'test-existing-file')
    let destDirPath = join('/tmp', 'test-tpl-out-dir')
    let rules = {
        replace: {
            "TemplateValueOne": "ActualValueOne"
        },
        exclude: ["/ToNotBeCopied", "ToNotBeCopied.txt"]
    }

    it("throws when srcDir is undefined", () => {
        expect.assertions(1);
        expect(cpTpl(undefined, destDirPath, rules)).rejects.toThrow(new Error("Invalid argument: srcDir can't be empty"))
    })

    it("throws when srcDir is missing", async () => {
        expect.assertions(1);
        expect(cpTpl(srcDirPath + "-missing", destDirPath, rules)).rejects.toThrow(new Error("Invalid argument: srcDir directory does not exist"))
    })

    it("throws when srcDir is not a directory", async () => {
        expect.assertions(1);
        expect(cpTpl(someFilePath, destDirPath, rules)).rejects.toThrow(new Error("Invalid argument: srcDir must be a directory"))
    })

    it("throws when destDir is undefined", async () => {
        expect.assertions(1);
        expect(cpTpl(srcDirPath, undefined, rules)).rejects.toThrow(new Error("Invalid argument: destDir can't be undefined"))
    })

    it("throws when destDir exists and is not a directory", async () => {
        expect.assertions(1);
        expect(cpTpl(srcDirPath, someFilePath, rules)).rejects.toThrow(new Error("Invalid argument: destDir must be a directory or not exist at all"))
    })
})