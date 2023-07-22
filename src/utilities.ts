import chalk from "chalk";

export const exitWithError = (message: string, code: number = 1) => {
    console.log(chalk.red(`\n${message}`));
    process.exit(code);
}

export const logSuccessMessage = (message: string): void => {
    console.log(chalk.green(`\n${message}`));
}