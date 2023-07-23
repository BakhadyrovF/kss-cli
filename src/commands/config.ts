import { prompt } from "enquirer";
import { getConfigurationOptions, setConfigurationOptions } from "../keychain";
import { exitWithError, logSuccessMessage } from "../utilities";
import { authenticate } from "../authentication";
import chalk from "chalk";

const AVAILABLE_CONFIGURATION_OPTIONS = [
    'keychain-always-allow'
];

const CONFIGURATION_OPTIONS_WITH_DESCRIPTION = [
    'keychain-always-allow  (Used to determine whether the user has granted \'always allow\' in the keychain)'
];

export const DEFAULT_CONFIGURATION = {
    'keychainAlwaysAllow': 'enabled'
};

export const configCommandName = 'config [ls]';
export const configCommandDescription = 'Manage configuration options';
export const configCommandHandler = async (argv: any) => {
    if (argv.ls) {
        console.log(CONFIGURATION_OPTIONS_WITH_DESCRIPTION.map(option => chalk.green(` - ${option}`)).join('\n'));
        return;
    }

    const answer: Record<string, string> = await prompt({
        type: 'select',
        name: 'config',
        message: 'Select a configuration option you want to change:',
        choices: Object.values(AVAILABLE_CONFIGURATION_OPTIONS)
    });

    const isAuthenticated = await authenticate();

    if (!isAuthenticated) {
        exitWithError('Authentication failed.');
    }

    if (answer.config === 'keychain-always-allow') {
        await keychainAlwaysAllow();
    }

    logSuccessMessage('Configuration has been updated successfully.');
}

const keychainAlwaysAllow = async () => {
    const configurationOptions = (await getConfigurationOptions());

    const answer: Record<string, string> = await prompt({
        type: 'select',
        name: 'keychainAlwaysAllow',
        message: `${chalk.green('keychain-always-allow')}: (current value - ${chalk.green(configurationOptions.keychainAlwaysAllow)})`,
        choices: ['enable', 'disable']
    });

    await setConfigurationOptions({ ...configurationOptions, keychainAlwaysAllow: answer.keychainAlwaysAllow + 'd' });
}