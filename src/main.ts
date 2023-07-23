import yargs from 'yargs';
import { addCommandName, addCommandDescription, addCommandHandler } from './commands/add';
import { rmCommandName, rmCommandDescription, rmCommandHandler } from './commands/rm';
import { lsCommandDescription, lsCommandHandler, lsCommandName } from './commands/ls';
import { cpCommandDescription, cpCommandHandler, cpCommandName } from './commands/cp';
import { configCommandDescription, configCommandHandler, configCommandName } from './commands/config';
import fs from 'fs';
import os from 'os';

const APP_DIRECTORY = `${os.homedir()}/.kss-cli`;
if (!fs.existsSync(APP_DIRECTORY)) {
    fs.mkdirSync(APP_DIRECTORY);
}

const positionalName = (yargs: Record<string, Function>) => {
    yargs.positional('name', {
        describe: 'The name of the secret, if not set, it will be taken interactively'
    });
}

const kss = yargs
    .scriptName('kss')
    .help('help')
    .version('1.0.0')
    .demandCommand(1, 'You must provide at least one command.')
    .strictCommands()
    .command(addCommandName, addCommandDescription, positionalName, addCommandHandler)
    .command(rmCommandName, rmCommandDescription, positionalName, rmCommandHandler)
    .command(lsCommandName, lsCommandDescription, positionalName, lsCommandHandler)
    .command(cpCommandName, cpCommandDescription, positionalName, cpCommandHandler)
    .command(configCommandName, configCommandDescription, (yargs: Record<string, Function>) => {
        yargs.positional('ls', {
            describe: 'List available configuration options with their description'
        });
    }, configCommandHandler);

yargs.getOptions().boolean.splice(-2);
kss.parse();