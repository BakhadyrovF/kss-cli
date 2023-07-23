import { prompt } from 'enquirer';
import { searchBySecretName } from '../search-engine';
import { exitWithError, logSuccessMessage } from '../utilities';
import chalk from 'chalk';
import ncp from 'node-clipboardy';
import { decrypt } from 'node-encryption';
import { getEncryptionKey } from '../keychain';


export const cpCommandName = 'cp [name]';
export const cpCommandDescription = 'Copy specific secret to clipboard';
export const cpCommandHandler = async (argv: any) => {
    const encryptionKey = await getEncryptionKey();
    let secretName: string;

    if (argv.name) {
        secretName = argv.name;
    } else {
        ({ secretName } = await prompt({
            type: 'input',
            name: 'secretName',
            message: 'name: (The name of the secret to be copied)'
        }));
    }

    const searchResults = searchBySecretName(secretName);

    if (searchResults.length === 0) {
        exitWithError(`No matches found for the given name: ${chalk.green(`'${secretName}'`)}`);
    }

    const closestMatch = searchResults[0];

    if (closestMatch.name !== secretName) {
        const confirmation: Record<string, boolean> = await prompt({
            type: 'confirm',
            name: 'isRightSecret',
            message: `Secret ${chalk.green(`'${secretName}'`)} not found. Did you mean ${chalk.green(`'${closestMatch.name}'`)}?`
        });

        if (!confirmation.isRightSecret) {
            exitWithError('Operation cancelled.');
        }
        secretName = closestMatch.name;
    }

    ncp.writeSync(decrypt(closestMatch.secret, encryptionKey).toString());

    logSuccessMessage(`Secret has been copied to clipboard.`);
} 