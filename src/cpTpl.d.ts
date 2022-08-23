export function cpTpl(
    srcDir: string,
    destDir: string,
    rules: {
        replace?: { [key: string]: string },
        exclude?: string[]
    } = {}
): Promise<void>;
s