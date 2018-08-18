import LS from './commands/ls';
import Touch from './commands/touch';

class Shell {
    get ls() {
        return new LS();
    }

    get touch() {
        return new Touch();
    }
}

const main = async () => {
    const $ = new Shell();

    const name = 'xyz.txt';

    const res = await $.ls.r.shx(name).full;
    console.log(res);
    
    const r = await $.touch.shx('xyz.txt');

    const res2 = await $.ls.r.shx(name).full;
    console.log(res2);
}; main();





