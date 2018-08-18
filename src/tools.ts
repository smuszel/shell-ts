export const flatten = (arr: any[]): any[] => {
    const h = (flat, toFlatten) => flat.concat(Array.isArray(toFlatten)
        ? flatten(toFlatten)
        : toFlatten
    );
    
    return arr.reduce(h, []);
}

export const zipWith = (a1, a2, f) => a1.map((x, i) => f(x, a2[i]));

