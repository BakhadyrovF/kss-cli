import yargs from 'yargs';
import { saveCommandName, saveCommandDescription, saveCommandHelper, saveCommandHandler } from './commands/save';
import { rmCommandName, rmCommandDescription, rmCommandHandler } from './commands/rm';
import dotenv from 'dotenv';

dotenv.config();
yargs
    .scriptName('kss-cli')
    .version('1.0.0')
    .command(saveCommandName, saveCommandDescription, saveCommandHelper, saveCommandHandler)
    .command(rmCommandName, rmCommandDescription, {}, rmCommandHandler)
    .parse();