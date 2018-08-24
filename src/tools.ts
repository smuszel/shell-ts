export const zipWith = <T, U, Q>(
    as: T[], bs: U[], zipper: (a: T, b: U) => Q)
    : Q[] => as.map((x, i) => zipper(x, bs[i]));


export const assert = (supposedlyTuthy: any, msg?: string): void => {
    if (!supposedlyTuthy) {
        throw new Error(msg);
    }
}

// At the time of writing this module (8 Aug) latest node was using V8 6.7,
// which did not yet have support for Array.prototype.flat and others
export const flatten = <T>(arr: T[][]): T[] => {
    const h = (flat, toFlatten) => flat.concat(Array.isArray(toFlatten)
        ? flatten(toFlatten)
        : toFlatten
    );

    return arr.reduce(h, []);
}