import { promises as fsp, existsSync } from 'fs';
import { expect, assert } from 'chai';
import { resolve, join } from 'path';
import ls from '../src/commands/ls';

const root = resolve('temp', 'lsroot');
const nonExisting = join(root, 'nonexisting');
const subdirectory1 = join(root, 'dir1');
const subdirectory2 = join(root, '.dir2');
const file1 = join(root, 'ls1.ts');
const file2 = join(subdirectory1, 'ls2.ts');
const file3 = join(subdirectory1, 'ls3.ts');
const file4 = join(subdirectory2, '.ls4.ts');

before('set up directory structure', async () => {
    if (existsSync(root)) {
        return;
    }
    
    await fsp.mkdir(root);
    await fsp.mkdir(subdirectory1);
    await fsp.mkdir(subdirectory2);

    await Promise.all([
        fsp.writeFile(file1, 'a'),
        fsp.writeFile(file2, 'b'),
        fsp.writeFile(file3, 'c'),
        fsp.writeFile(file4, 'd')
    ]);
});

after('remove directory', async () => {
    await Promise.all([
        fsp.unlink(file1),
        fsp.unlink(file2),
        fsp.unlink(file3),
        fsp.unlink(file4),
    ]);

    await Promise.all([
        await fsp.rmdir(subdirectory1),
        await fsp.rmdir(subdirectory2),
    ]);

    await fsp.rmdir(root);
});

describe('ls', async () => {

    it('given a directory, returns all absolute names', async () => {
        const names = await ls.shx(root);

        expect(names).to.include(file1);
        expect(names).to.include(subdirectory1);
        expect(names).to.include(subdirectory2);
    });

    it('given a directory, will not return contents of directories below', async () => {
        const names = await ls.shx(root);

        expect(names).to.not.include(file2);
        expect(names).to.not.include(file3);
        expect(names).to.not.include(file4);
    });

    it('given a hidden directory, returns all absoulte names', async () => {
        const names = await ls.shx(subdirectory2);

        expect(names).to.include(file4);
        expect(names).to.length(1);
    })

    it('given a file, returns absolute name of that file in array', async () => {
        const names = await ls.shx(file1);

        expect(names).to.include(file1);
        expect(names).to.length(1);
    })

    it('given a non existing entry, will throw', async () => {
        const names = await ls.shx(nonExisting).catch(x => 'throw');
        expect(names).to.equal('throw');
    })
});

describe('ls -r', async () => {

    it('given a directory, returns all file names in that branch', async () => {
        const names = await ls.r.shx(root);

        expect(names).to.include(file1);
        expect(names).to.include(file2);
        expect(names).to.include(file3);
        expect(names).to.include(file4);
    });

    it('given a directory, returns all directory names in that branch', async () => {
        const names = await ls.r.shx(root);

        expect(names).to.include(subdirectory1);
        expect(names).to.include(subdirectory2);
    });

    it('given a directory, will not include its name in output', async () => {
        const names = await ls.r.shx(root);
        expect(names).to.not.include(root);
    });

    it('given a file, throws', async () => {
        const names = await ls.r.shx(file1).catch(() => 'throw');
        expect(names).to.equal('throw');
    });

    it('given a non existing entry, throws', async () => {
        const names = await ls.r.shx(nonExisting).catch(() => 'throw');
        expect(names).to.equal('throw');
    })
});