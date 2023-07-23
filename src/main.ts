import yargs from 'yargs';
import { addCommandName, addCommandDescription, addCommandHandler } from './commands/add';
import { rmCommandName, rmCommandDescription, rmCommandHandler } from './commands/rm';
import dotenv from 'dotenv';
import { lsCommandDescription, lsCommandHandler, lsCommandName } from './commands/ls';
import { cpCommandDescription, cpCommandHandler, cpCommandName } from './commands/cp';

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
    .demandCommand(1, 'You must provide at least one command.')
    .strictCommands()
    .command(addCommandName, addCommandDescription, positionalName, addCommandHandler)
    .command(rmCommandName, rmCommandDescription, positionalName, rmCommandHandler)
    .command(lsCommandName, lsCommandDescription, positionalName, lsCommandHandler)
    .command(cpCommandName, cpCommandDescription, positionalName, cpCommandHandler);

yargs.getOptions().boolean.splice(-2);
commands.parse();