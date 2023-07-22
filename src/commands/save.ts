import { prompt } from "enquirer";
import { exitWithError } from '../utilities';
import { insertNewSecret } from "../database";
import { encrypt } from 'node-encryption'
import chalk from "chalk";


const questions = [
    {
        type: 'input',
        message: 'name: (The name of the secret to keep)',
        name: 'name'
    },
    {
        type: 'password',
        message: 'secret: (The secret itself, don\'t worry, it will be safe)',
        name: 'secret'
    },
    {
        type: 'password',
        message: 'secret-confirmation: (The secret confirmation to avoid mistakes)',
        name: 'secretConfirmation'
    }
]

export const saveCommandName = 'save [name]';
export const saveCommandDescription = 'Create a new secret or update an existing one';
export const saveCommandHelper = (yargs: any) => {
    return yargs.positional('name', {
        describe: 'The name of the secret, if not set, it will be taken interactively'
    });
}

export const saveCommandHandler = async (argv: Record<string, string>) => {
    if (argv.name) {
        questions.shift();
    }

    const answers: Record<string, string> = await prompt(questions);
    answers['name'] ??= argv.name;

    validateForBlankString(answers);
    validateSecretConfirmation(answers.secret, answers.secretConfirmation);

    insertNewSecret(answers.name, encrypt(answers.secret, process.env.ENCRYPTION_KEY));

    console.log(chalk.green('\nNew secret has been successfully saved. I will keep it safe for you!'));
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