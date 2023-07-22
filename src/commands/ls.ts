import { ISecret, getAllSecrets } from '../database';
import { SearchResult } from 'minisearch';
import { searchBySecretName } from '../searchEngine';
import chalk from 'chalk';

export const lsCommandName = 'ls [name]';
export const lsCommandDescription = 'List all secrets or specific ones by their name';
export const lsCommandHandler = async (argv: Record<string, string>) => {
    let secrets: Array<SearchResult | ISecret>;

    if (argv.name) {
        secrets = searchBySecretName(argv.name);
    } else {
        secrets = getAllSecrets();
    }

    const secretNames = secrets.map(secret => chalk.bold.green((` - ${secret.name}`)));

    if (secretNames.length === 0) {
        return;
    }

    console.log(secretNames.join('\n'));
}