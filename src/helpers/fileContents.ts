import { promises as fsp } from 'fs';

const _fileContents = (filePath: string) => fsp.readFile(filePath, 'utf8');

const fileContents_test = async (filePath: string, pattern: RegExp) => {
    const content = await _fileContents(filePath);
    const satisfies = pattern.test(content);

    return satisfies;
}

const fileContents = Object.assign(_fileContents, {
    test: fileContents_test
});

export default fileContents;