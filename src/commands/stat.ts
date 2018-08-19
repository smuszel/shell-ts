import { resolve } from 'path';
import { Stats, stat, promises } from 'fs';

class Stat {

    shx(...names): Promise<Stats> {
        const pt = resolve(...names);
        return promises.stat(pt);
    }
}

export default new Stat