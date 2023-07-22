import { prompt } from "enquirer";
import { searchBySecretName } from "../searchEngine";
import chalk from "chalk";
import { SearchResult } from "minisearch";
import { deleteBySecretName } from "../database";

export const rmCommandName = 'rm [name]';
export const rmCommandDescription = 'Delete a specific secret by the given name'
export const rmCommandHandler = async (argv: Record<string, string>) => {
    let secretName = '';
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
        console.log(chalk.red(`No matches found for the given name: '${chalk.green(secretName)}'`));
        return;
    }

    const closestMatch = searchResults[0];

    if (closestMatch.name !== secretName) {
        const confirmation: Record<string, boolean> = await prompt({
            type: 'confirm',
            name: 'isRightSecret',
            message: `Secret '${chalk.green(secretName)}' not found. Did you mean '${chalk.green(closestMatch.name)}'?`
        });

        if (!confirmation.isRightSecret) {
            console.log(chalk.red('Operation cancelled.'));
            return;
        }
        secretName = closestMatch.name;
    }

    const confirmation: Record<string, boolean> = await prompt({
        type: 'confirm',
        name: 'removalConfirmation',
        message: `Are you sure you want to delete the secret '${chalk.green(secretName)}'?`
    });

    if (!confirmation.removalConfirmation) {
        console.log(chalk.red('Operation cancelled.'))
        return;
    }

    deleteBySecretName(secretName);

    console.log(chalk.green('Secret has been successfully removed.'));
};