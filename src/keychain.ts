import { prompt } from 'enquirer';
import keytar from 'keytar';
import { exitWithError } from './utilities';
import { DEFAULT_CONFIGURATION } from './commands/config';

const SERVICE = 'KSS-CLI';
const ENCRYPTION_KEY_ACCOUNT = 'KSS-CLI Encryption Key';
const CONFIGURATION_OPTIONS_ACCOUNT = 'KSS-CLI Configuration Options';

export const getEncryptionKey = async () => {
    let encryptionKey = await keytar.getPassword(SERVICE, ENCRYPTION_KEY_ACCOUNT);

    if (!encryptionKey) {
        ({ encryptionKey } = await prompt({
            type: 'invisible',
            name: 'encryptionKey',
            message: 'Encryption Key: (This encryption key will be stored in keychain and used to encrypt/decrypt all your secrets)'
        }));

        if ((encryptionKey?.length ?? 0) < 8) {
            exitWithError('Encryption Key can\'t be that short.');
        }

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
