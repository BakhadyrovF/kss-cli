import yargs from 'yargs';
import { saveCommandName, saveCommandDescription, saveCommandHandler } from './commands/add';
import { rmCommandName, rmCommandDescription, rmCommandHandler } from './commands/rm';
import dotenv from 'dotenv';
import { lsCommandDescription, lsCommandHandler, lsCommandName } from './commands/ls';

const positionalName = (yargs: Record<string, Function>) => {
    yargs.positional('name', {
        describe: 'The name of the secret, if not set, it will be taken interactively'
    });
}
dotenv.config();
const commands = yargs
    .scriptName('kss-cli')
    .help('help')
    .version('1.0.0')
    .command(saveCommandName, saveCommandDescription, positionalName, saveCommandHandler)
    .command(rmCommandName, rmCommandDescription, positionalName, rmCommandHandler)
    .command(lsCommandName, lsCommandDescription, positionalName, lsCommandHandler);

yargs.getOptions().boolean.splice(-2);
commands.parse();