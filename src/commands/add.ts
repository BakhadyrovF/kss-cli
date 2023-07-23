import { prompt } from 'enquirer';
import { exitWithError, logSuccessMessage } from '../utilities';
import { insertNewSecret } from '../database';
import { encrypt } from 'node-encryption'
import chalk from 'chalk';
import { searchBySecretName } from '../search-engine';
import { getEncryptionKey } from '../keychain';



const questions = [
    {
        type: 'input',
        message: `${chalk.green('name')}: (The name of the secret to keep)`,
        name: 'secretName'
    },
    {
        type: 'password',
        message: `${chalk.green('secret')}: (The secret itself, don\'t worry, it will be safe)`,
        name: 'secret'
    },
    {
        type: 'password',
        message: `${chalk.green('secret-confirmation')}: (The secret confirmation to avoid mistakes)`,
        name: 'secretConfirmation'
    }
]

export const addCommandName = 'add [name]';
export const addCommandDescription = 'Add a new secret';
export const addCommandHandler = async (argv: Record<string, string>) => {
    const encryptionKey = await getEncryptionKey();
    if (argv.secretName) {
        questions.shift();
    }

    const answers: Record<string, string> = await prompt(questions);
    answers['secretName'] ??= argv.secretName;

    validateForBlankString(answers);
    validateSecretConfirmation(answers.secret, answers.secretConfirmation);
    validateSecretNameForUniqueness(answers.secretName);

    insertNewSecret(answers.secretName, encrypt(answers.secret, encryptionKey));

    logSuccessMessage('New secret has been successfully saved. I will keep it safe for you!');
};

const validateForBlankString = (answers: Record<string, string>): void => {
    for (let [key, value] of Object.entries(answers)) {
        if (value === '') {
            exitWithError(`Blank string is not acceptable for the argument \`${key}\`!`);
        }
    }
}

const validateSecretConfirmation = (password: string, passwordConfirmation: string): void => {
    if (password !== passwordConfirmation) {
        exitWithError('Secrets do not match!');
    }
}

const validateSecretNameForUniqueness = (secretName: string): void => {
    const closestMatch = searchBySecretName(secretName)[0];

    if (closestMatch?.name === secretName) {
        exitWithError(`Secret with name ${chalk.green(`'${secretName}'`)} already exists`);
    }
}
