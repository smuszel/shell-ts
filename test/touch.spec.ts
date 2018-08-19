import { promises as fsp, existsSync } from 'fs';
import { expect, assert } from 'chai';
import { resolve } from 'path';
import touch from '../src/commands/touch';

const name1 = resolve('temp', 'touch1.ts');
const name2 = resolve('temp', 'touch2.ts');
const name3 = resolve('temp', 'touch-non-existing', 'touch3.ts');

describe('touch', () => {

    it('given non existing file, makes new file', async () => {
        await touch.shx(name1, name2);

        const stat1 = await fsp.stat(name1);
        const stat2 = await fsp.stat(name2);
    
        await fsp.unlink(name1);
        await fsp.unlink(name2);

        expect(stat1).to.be.a('object');
        expect(stat2).to.be.a('object');
    });

    it('given existing file, does not affect stats', async () => {        
        await touch.shx(name1);
        const statBefore = await fsp.stat(name1);

        await new Promise(rez => setTimeout(rez, 1));

        await touch.shx(name1);
        const statAfter = await fsp.stat(name1);
        
        await fsp.unlink(name1);

        expect(statBefore).deep.equal(statAfter);
    });

    it('given existing file, does not overwrite it', async () => {
        await fsp.writeFile(name1, 'abc');

        const before = await fsp.readFile(name1, 'utf8');
        await touch.shx(name1);
        const after = await fsp.readFile(name1, 'utf8');
        await fsp.unlink(name1);

        expect(before).to.be.equal(after);
    });

    it('given non existing directory in path, throws', async () => {
        const x = await touch.shx(name3).catch(x => 'throw');
        expect(x).to.equal('throw');
    });
})

describe('touch -c', () => {

    it('given non existing file, does not make new file', async () => {
        await touch.c.shx(name1);

        const wasCreated = existsSync(name1);
        expect(wasCreated).false;
    });

    it('given existing file, does not affect stats', async () => {
        // no c flag because file has to be created first
        await touch.shx(name1);
        const statBefore = await fsp.stat(name1);

        await new Promise(rez => setTimeout(rez, 1));

        await touch.c.shx(name1);
        const statAfter = await fsp.stat(name1);

        await fsp.unlink(name1);

        expect(statBefore).deep.equal(statAfter);
    });

    it('given existing file, does not overwrite it', async () => {
        await fsp.writeFile(name1, 'abc');

        const before = await fsp.readFile(name1, 'utf8');
        await touch.c.shx(name1);
        const after = await fsp.readFile(name1, 'utf8');
        await fsp.unlink(name1);

        expect(before).to.be.equal(after);
    });

    it('given non existing directory in path, returns nothing', async () => {
        await touch.c.shx(name3);
    });
})