export function cpTpl(
    srcDir: string,
    destDir: string,
    rules: {
        src: string,
        dest: string,
        replace: { [key: string]: string },
        exclude: string[]
    }
): Promise<void>;
