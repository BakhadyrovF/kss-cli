import { prompt } from "enquirer";
import { searchBySecretName } from "../searchEngine";

export const rmCommandName = 'rm [name]';
export const rmCommandDescription = 'Delete a specific secret by the given name'
export const rmCommandHandler = async (argv: Record<string, string>) => {
    console.log('rm command handler');
    let secretName = '';
    if (argv.name) {
        secretName = argv.name
    } else {
        ({ secretName } = await prompt({
            type: 'input',
            name: 'secretName',
            message: 'The name of the secret to be removed'
        }));
    }

    console.log(searchBySecretName(secretName));


};