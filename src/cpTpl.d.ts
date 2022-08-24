/**
 * Copy src directory recursively to dest directory while transforming the content according to the rules
 * @param srcDir source directory
 * @param destDir destination directory
 * @param rules transformation rules (by defalt only gitignore is set to true)
 */
export function cpTpl(
    srcDir: string,
    destDir: string,
    rules?: {
        replace?: { [key: string]: string },
        exclude?: string[],
        gitignore?: boolean
    }
): Promise<void>;