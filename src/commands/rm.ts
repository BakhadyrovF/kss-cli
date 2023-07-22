import { prompt } from 'enquirer';
import { searchBySecretName } from '../searchEngine';
import chalk from 'chalk';
import { SearchResult } from 'minisearch';
import { deleteBySecretName } from '../database';
import { exitWithError, logSuccessMessage } from '../utilities';

export const rmCommandName = 'rm [name]';
export const rmCommandDescription = 'Delete a specific secret by the given name'
export const rmCommandHandler = async (argv: Record<string, string>) => {
    let secretName: string;
    if (argv.name) {
        secretName = argv.name
    } else {
        ({ secretName } = await prompt({
            type: 'input',
            name: 'secretName',
            message: 'name: (The name of the secret to be removed)'
        }));
    }

    const searchResults: Array<SearchResult> = searchBySecretName(secretName);

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

    const confirmation: Record<string, boolean> = await prompt({
        type: 'confirm',
        name: 'removalConfirmation',
        message: `Are you sure you want to delete the secret '${chalk.green(secretName)}'?`
    });

    if (!confirmation.removalConfirmation) {
        exitWithError('Operation cancelled.');
    }

    deleteBySecretName(secretName);

    logSuccessMessage('Secret has been successfully removed.');
};