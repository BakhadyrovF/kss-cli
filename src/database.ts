import fs from 'fs';

export const insertNewSecret = (secretName: string, secret: string) => {
    insert({
        name: secretName,
        secret: secret
    });
}

const insert = (payload: Record<string, string>): void => {
    if (!fs.existsSync(PATH_TO_DATABASE)) {
        fs.writeFileSync(PATH_TO_DATABASE, JSON.stringify([payload]));
    } else {
        const secrets = getAll();
        secrets.push(payload);
        fs.writeFileSync(PATH_TO_DATABASE, JSON.stringify(secrets));
    }
}

const getAll = (): Array<Record<string, string>> => {
    const secrets = fs.readFileSync(PATH_TO_DATABASE).toString();
    console.log('get all', secrets);

    if (!secrets) {
        return [];
    }

    return JSON.parse(secrets);
}

const PATH_TO_DATABASE = './database.json';


