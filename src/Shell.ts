import LS from './commands/ls';
import Touch from './commands/touch';
import Stat from './commands/stat';
import Cp from './commands/cp';

export default class Shell {
    get ls() {
        return new LS();
    }

    get touch() {
        return new Touch();
    }

    get stat() {
        return new Stat();
    }

    get cp() {
        return new Cp();
    }
}