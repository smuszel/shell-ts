import mv from './commands/mv';

const main = async () => {

    const name1 = 'testdir';
    const name2 = 'testdir123';
    const name3 = 'xyz.txt';
    const name4 = './aaa/abc.txt';

    const b = await mv.shx(name3, name1);

    console.log(b);
    
};

main();




