export function cpTpl(
    srcDir: string,
    destDir: string,
    rules?: {
        replace: { [key: string]: string } = {},
        exclude: string[] = [],
        gitignore: boolean = true
    }
): Promise<void>;
s