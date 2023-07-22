import fs from 'fs';

const PATH_TO_DATABASE = './database.json';
interface ISecret {
    id: number,
    name: string,
    secret: string
}

export const insertNewSecret = (secretName: string, secret: string) => {
    if (!fs.existsSync(PATH_TO_DATABASE)) {
        fs.writeFileSync(PATH_TO_DATABASE, JSON.stringify([{
            id: getIdForNewSecret(),
            name: secretName,
            secret
        }]));
    } else {
        const secrets = getAll();
        secrets.push(
            {
                id: getIdForNewSecret(),
                name: secretName,
                secret
            }
        );
        fs.writeFileSync(PATH_TO_DATABASE, JSON.stringify(secrets));
    }
}

export const getAll = (): Array<ISecret> => {
    let secrets: Array<ISecret> = [];
    try {
        const secretsJson = fs.readFileSync(PATH_TO_DATABASE).toString();

        if (secretsJson) {
            return JSON.parse(secretsJson);
        }
    } catch {
        return secrets;
    }

    return secrets
}

const insert = (payload: Omit<ISecret, 'id'>): void => {

}

const getIdForNewSecret = (): number => {
    const secrets = getAll();

    if (!secrets) {
        return 1;
    }

    const latestSecret = secrets.at(secrets.length - 1);

    if (!latestSecret) {
        return 1;
    }

    return latestSecret.id as number + 1;
}




