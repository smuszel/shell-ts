export const flatten = (arr: any[]): any[] => {
    const h = (flat, toFlatten) => flat.concat(Array.isArray(toFlatten)
        ? flatten(toFlatten)
        : toFlatten
    );
    
    return arr.reduce(h, []);
}