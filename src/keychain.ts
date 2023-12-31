import keytar from 'keytar';
import { DEFAULT_CONFIGURATION } from './commands/config';
import crypto from 'crypto';
import { ISecret } from 'database';

const SERVICE = 'KSS-CLI';
const ENCRYPTION_KEY_ACCOUNT = 'KSS-CLI Encryption Key';
const CONFIGURATION_OPTIONS_ACCOUNT = 'KSS-CLI Configuration Options';
const SECRETS_COLLECTION_ACCOUNT = 'KSS-CLI Secrets Collection';

export const getEncryptionKey = async () => {
    let encryptionKey = await keytar.getPassword(SERVICE, ENCRYPTION_KEY_ACCOUNT);

    if (!encryptionKey) {
        encryptionKey = generateEncryptionKey();

        keytar.setPassword(SERVICE, ENCRYPTION_KEY_ACCOUNT, encryptionKey as string);
    }

    return encryptionKey;
}

export const setConfigurationOptions = (config: Record<string, string>) => {
    return keytar.setPassword(SERVICE, CONFIGURATION_OPTIONS_ACCOUNT, JSON.stringify(config));
}

export const getConfigurationOptions = async (): Promise<Record<string, string>> => {
    let configurationOptions = await keytar.getPassword(SERVICE, CONFIGURATION_OPTIONS_ACCOUNT);

    // if it is first time use, then we will store default configuration options in the keychain.
    if (!configurationOptions) {
        keytar.setPassword(SERVICE, CONFIGURATION_OPTIONS_ACCOUNT, JSON.stringify(DEFAULT_CONFIGURATION));
        return DEFAULT_CONFIGURATION;
    }

    return JSON.parse(configurationOptions);
}

export const setSecretsCollection = (secrets: Array<ISecret>) => {
    return keytar.setPassword(SERVICE, SECRETS_COLLECTION_ACCOUNT, JSON.stringify(secrets));
}

export const getSecretsCollection = async (): Promise<Array<ISecret>> => {
    const secrets = await keytar.getPassword(SERVICE, SECRETS_COLLECTION_ACCOUNT);

    if (!secrets) {
        keytar.setPassword(SERVICE, SECRETS_COLLECTION_ACCOUNT, JSON.stringify([]));
        return [];
    }

    return JSON.parse(secrets);
}

const generateEncryptionKey = (): string => {
    const encryptionKey = crypto.randomBytes(64);

    return encryptionKey.toString('base64');
}