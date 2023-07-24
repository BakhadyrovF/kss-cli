import { getSecretsCollection, setSecretsCollection } from './keychain';

export interface ISecret {
    id: number,
    name: string,
    secret: string
}

export const insertNewSecret = async (secretName: string, secret: string): Promise<void> => {
    const secrets = await getAllSecrets();

    secrets.push({
        id: await getIdForNewSecret(),
        name: secretName,
        secret
    });

    return setSecretsCollection(secrets);
}

export const getAllSecrets = (): Promise<Array<ISecret>> => {
    return getSecretsCollection();
}

export const deleteBySecretName = async (secretName: string): Promise<void> => {
    const secrets = await getAllSecrets();

    const secretsWithoutTarget = secrets.filter(secret => secret.name !== secretName);

    return setSecretsCollection(secretsWithoutTarget);
}

const getIdForNewSecret = async (): Promise<number> => {
    const secrets = await getAllSecrets();

    if (secrets.length === 0) {
        return 1;
    }

    const latestSecret = secrets.at(secrets.length - 1) as ISecret;

    return latestSecret.id as number + 1;
}




