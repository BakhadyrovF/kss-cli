"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/main.ts
var import_yargs = __toESM(require("yargs"));

// src/commands/add.ts
var import_enquirer3 = require("enquirer");

// src/utilities.ts
var import_chalk = __toESM(require("chalk"));
var exitWithError = (message, code = 1) => {
  console.log(import_chalk.default.red(`
${message}`));
  process.exit(code);
};
var logSuccessMessage = (message) => {
  console.log(import_chalk.default.green(`
${message}`));
};

// src/database.ts
var import_fs = __toESM(require("fs"));
var import_os = __toESM(require("os"));
var PATH_TO_DATABASE = `${import_os.default.homedir()}/.kss-cli/secrets.json`;
var insertNewSecret = (secretName, secret) => {
  if (!import_fs.default.existsSync(PATH_TO_DATABASE)) {
    import_fs.default.writeFileSync(PATH_TO_DATABASE, JSON.stringify([{
      id: getIdForNewSecret(),
      name: secretName,
      secret
    }]));
  } else {
    const secrets = getAllSecrets();
    secrets.push(
      {
        id: getIdForNewSecret(),
        name: secretName,
        secret
      }
    );
    import_fs.default.writeFileSync(PATH_TO_DATABASE, JSON.stringify(secrets));
  }
};
var getAllSecrets = () => {
  let secrets = [];
  try {
    const secretsJson = import_fs.default.readFileSync(PATH_TO_DATABASE).toString();
    if (secretsJson) {
      return JSON.parse(secretsJson);
    }
  } catch {
    return secrets;
  }
  return secrets;
};
var deleteBySecretName = (secretName) => {
  const secrets = getAllSecrets();
  const secretsWithoutTarget = secrets.filter((secret) => secret.name !== secretName);
  import_fs.default.writeFileSync(PATH_TO_DATABASE, JSON.stringify(secretsWithoutTarget));
};
var getIdForNewSecret = () => {
  const secrets = getAllSecrets();
  if (!secrets) {
    return 1;
  }
  const latestSecret = secrets.at(secrets.length - 1);
  if (!latestSecret) {
    return 1;
  }
  return latestSecret.id + 1;
};

// src/commands/add.ts
var import_node_encryption = require("node-encryption");
var import_chalk3 = __toESM(require("chalk"));

// src/search-engine.ts
var import_minisearch = __toESM(require("minisearch"));
var minisearch = new import_minisearch.default({
  fields: ["name"],
  storeFields: ["name", "secret"],
  searchOptions: {
    fuzzy: 0.3,
    prefix: true
  }
});
var searchBySecretName = (secretName) => {
  minisearch.addAll(getAllSecrets());
  const searchResults = minisearch.search(secretName);
  return searchResults;
};

// src/keychain.ts
var import_enquirer2 = require("enquirer");
var import_keytar = __toESM(require("keytar"));

// src/commands/config.ts
var import_enquirer = require("enquirer");

// src/authentication.ts
var import_macos_touchid = __toESM(require("macos-touchid"));
var authenticate = async () => {
  if (import_macos_touchid.default.canAuthenticate() === false) {
    throw new Error("No authentication method available");
  }
  const isAuthenticated = await new Promise((resolve) => {
    import_macos_touchid.default.authenticate("You must be authenticated to perform this action.", (err, didAuthenticate) => {
      if (err) {
        resolve(false);
      }
      didAuthenticate ? resolve(true) : resolve(false);
    });
  });
  return isAuthenticated;
};

// src/commands/config.ts
var import_chalk2 = __toESM(require("chalk"));
var AVAILABLE_CONFIGURATION_OPTIONS = [
  "keychain-always-allow"
];
var CONFIGURATION_OPTIONS_WITH_DESCRIPTION = [
  "keychain-always-allow  (Used to determine whether the user has granted 'always allow' in the keychain)"
];
var DEFAULT_CONFIGURATION = {
  "keychainAlwaysAllow": "enabled"
};
var configCommandName = "config [ls]";
var configCommandDescription = "Manage configuration options";
var configCommandHandler = async (argv) => {
  if (argv.ls) {
    console.log(CONFIGURATION_OPTIONS_WITH_DESCRIPTION.map((option) => import_chalk2.default.green(` - ${option}`)).join("\n"));
    return;
  }
  const answer = await (0, import_enquirer.prompt)({
    type: "select",
    name: "config",
    message: "Select a configuration option you want to change:",
    choices: Object.values(AVAILABLE_CONFIGURATION_OPTIONS)
  });
  const isAuthenticated = await authenticate();
  if (!isAuthenticated) {
    exitWithError("Authentication failed.");
  }
  if (answer.config === "keychain-always-allow") {
    await keychainAlwaysAllow();
  }
  logSuccessMessage("Configuration has been updated successfully.");
};
var keychainAlwaysAllow = async () => {
  const configurationOptions = await getConfigurationOptions();
  const answer = await (0, import_enquirer.prompt)({
    type: "select",
    name: "keychainAlwaysAllow",
    message: `${import_chalk2.default.green("keychain-always-allow")}: (current value - ${import_chalk2.default.green(configurationOptions.keychainAlwaysAllow)})`,
    choices: ["enable", "disable"]
  });
  await setConfigurationOptions({ ...configurationOptions, keychainAlwaysAllow: answer.keychainAlwaysAllow + "d" });
};

// src/keychain.ts
var SERVICE = "KSS-CLI";
var ENCRYPTION_KEY_ACCOUNT = "KSS-CLI Encryption Key";
var CONFIGURATION_OPTIONS_ACCOUNT = "KSS-CLI Configuration Options";
var getEncryptionKey = async () => {
  let encryptionKey = await import_keytar.default.getPassword(SERVICE, ENCRYPTION_KEY_ACCOUNT);
  if (!encryptionKey) {
    ({ encryptionKey } = await (0, import_enquirer2.prompt)({
      type: "invisible",
      name: "encryptionKey",
      message: "Encryption Key: (This encryption key will be stored in keychain and used to encrypt/decrypt all your secrets)"
    }));
    if ((encryptionKey?.length ?? 0) < 8) {
      exitWithError("Encryption Key can't be that short.");
    }
    import_keytar.default.setPassword(SERVICE, ENCRYPTION_KEY_ACCOUNT, encryptionKey);
  }
  return encryptionKey;
};
var setConfigurationOptions = (config) => {
  return import_keytar.default.setPassword(SERVICE, CONFIGURATION_OPTIONS_ACCOUNT, JSON.stringify(config));
};
var getConfigurationOptions = async () => {
  let configurationOptions = await import_keytar.default.getPassword(SERVICE, CONFIGURATION_OPTIONS_ACCOUNT);
  if (!configurationOptions) {
    import_keytar.default.setPassword(SERVICE, CONFIGURATION_OPTIONS_ACCOUNT, JSON.stringify(DEFAULT_CONFIGURATION));
    return DEFAULT_CONFIGURATION;
  }
  return JSON.parse(configurationOptions);
};

// src/commands/add.ts
var questions = [
  {
    type: "input",
    message: `${import_chalk3.default.green("name")}: (The name of the secret to keep)`,
    name: "secretName"
  },
  {
    type: "password",
    message: `${import_chalk3.default.green("secret")}: (The secret itself, don't worry, it will be safe)`,
    name: "secret"
  },
  {
    type: "password",
    message: `${import_chalk3.default.green("secret-confirmation")}: (The secret confirmation to avoid mistakes)`,
    name: "secretConfirmation"
  }
];
var addCommandName = "add [name]";
var addCommandDescription = "Add a new secret";
var addCommandHandler = async (argv) => {
  const encryptionKey = await getEncryptionKey();
  let answers;
  if (argv.name) {
    answers = await (0, import_enquirer3.prompt)(questions.filter((question) => question.name !== "secretName"));
  } else {
    answers = await (0, import_enquirer3.prompt)(questions);
  }
  answers["secretName"] ??= argv.name;
  validateForBlankString(answers);
  validateSecretConfirmation(answers.secret, answers.secretConfirmation);
  validateSecretNameForUniqueness(answers.secretName);
  insertNewSecret(answers.secretName, (0, import_node_encryption.encrypt)(answers.secret, encryptionKey));
  logSuccessMessage("New secret has been successfully saved. I will keep it safe for you!");
};
var validateForBlankString = (answers) => {
  for (let [key, value] of Object.entries(answers)) {
    if (value === "") {
      exitWithError(`Blank string is not acceptable for the argument \`${key}\`!`);
    }
  }
};
var validateSecretConfirmation = (password, passwordConfirmation) => {
  if (password !== passwordConfirmation) {
    exitWithError("Secrets do not match!");
  }
};
var validateSecretNameForUniqueness = (secretName) => {
  const closestMatch = searchBySecretName(secretName)[0];
  if (closestMatch?.name === secretName) {
    exitWithError(`Secret with name ${import_chalk3.default.green(`'${secretName}'`)} already exists`);
  }
};

// src/commands/rm.ts
var import_enquirer4 = require("enquirer");
var import_chalk4 = __toESM(require("chalk"));
var rmCommandName = "rm [name]";
var rmCommandDescription = "Delete a specific secret by the given name";
var rmCommandHandler = async (argv) => {
  let secretName;
  if (argv.name) {
    secretName = argv.name;
  } else {
    ({ secretName } = await (0, import_enquirer4.prompt)({
      type: "input",
      name: "secretName",
      message: "name: (The name of the secret to be removed)"
    }));
  }
  const searchResults = searchBySecretName(secretName);
  if (searchResults.length === 0) {
    exitWithError(`No matches found for the given name: ${import_chalk4.default.green(`'${secretName}'`)}`);
  }
  const closestMatch = searchResults[0];
  if (closestMatch.name !== secretName) {
    const confirmation2 = await (0, import_enquirer4.prompt)({
      type: "confirm",
      name: "isRightSecret",
      message: `Secret ${import_chalk4.default.green(`'${secretName}'`)} not found. Did you mean ${import_chalk4.default.green(`'${closestMatch.name}'`)}?`
    });
    if (!confirmation2.isRightSecret) {
      exitWithError("Operation cancelled.");
    }
    secretName = closestMatch.name;
  }
  const confirmation = await (0, import_enquirer4.prompt)({
    type: "confirm",
    name: "removalConfirmation",
    message: `Are you sure you want to delete the secret '${import_chalk4.default.green(secretName)}'?`
  });
  if (!confirmation.removalConfirmation) {
    exitWithError("Operation cancelled.");
  }
  const isAlwaysAllowEnabled = (await getConfigurationOptions()).keychainAlwaysAllow === "enabled";
  if (isAlwaysAllowEnabled) {
    const isAuthenticated = await authenticate();
    if (!isAuthenticated) {
      exitWithError("Authentication failed");
    }
  }
  deleteBySecretName(secretName);
  logSuccessMessage("Secret has been successfully removed.");
};

// src/commands/ls.ts
var import_chalk5 = __toESM(require("chalk"));
var lsCommandName = "ls [name]";
var lsCommandDescription = "List all secrets or specific ones by their name";
var lsCommandHandler = async (argv) => {
  let secrets;
  if (argv.name) {
    secrets = searchBySecretName(argv.name);
  } else {
    secrets = getAllSecrets();
  }
  const secretNames = secrets.map((secret) => import_chalk5.default.bold.green(` - ${secret.name}`));
  if (secretNames.length === 0) {
    return;
  }
  console.log(secretNames.join("\n"));
};

// src/commands/cp.ts
var import_enquirer5 = require("enquirer");
var import_chalk6 = __toESM(require("chalk"));
var import_node_clipboardy = __toESM(require("node-clipboardy"));
var import_node_encryption2 = require("node-encryption");
var cpCommandName = "cp [name]";
var cpCommandDescription = "Copy specific secret to clipboard";
var cpCommandHandler = async (argv) => {
  const encryptionKey = await getEncryptionKey();
  let secretName;
  if (argv.name) {
    secretName = argv.name;
  } else {
    ({ secretName } = await (0, import_enquirer5.prompt)({
      type: "input",
      name: "secretName",
      message: "name: (The name of the secret to be copied)"
    }));
  }
  const searchResults = searchBySecretName(secretName);
  if (searchResults.length === 0) {
    exitWithError(`No matches found for the given name: ${import_chalk6.default.green(`'${secretName}'`)}`);
  }
  const closestMatch = searchResults[0];
  if (closestMatch.name !== secretName) {
    const confirmation = await (0, import_enquirer5.prompt)({
      type: "confirm",
      name: "isRightSecret",
      message: `Secret ${import_chalk6.default.green(`'${secretName}'`)} not found. Did you mean ${import_chalk6.default.green(`'${closestMatch.name}'`)}?`
    });
    if (!confirmation.isRightSecret) {
      exitWithError("Operation cancelled.");
    }
    secretName = closestMatch.name;
  }
  const isAlwaysAllowEnabled = (await getConfigurationOptions()).keychainAlwaysAllow === "enabled";
  if (isAlwaysAllowEnabled) {
    const isAuthenticated = await authenticate();
    if (!isAuthenticated) {
      exitWithError("Authentication failed");
    }
  }
  import_node_clipboardy.default.writeSync((0, import_node_encryption2.decrypt)(closestMatch.secret, encryptionKey).toString());
  logSuccessMessage(`Secret has been copied to clipboard.`);
};

// src/main.ts
var import_fs2 = __toESM(require("fs"));
var import_os2 = __toESM(require("os"));
var APP_DIRECTORY = `${import_os2.default.homedir()}/.kss-cli`;
if (!import_fs2.default.existsSync(APP_DIRECTORY)) {
  import_fs2.default.mkdirSync(APP_DIRECTORY);
}
var positionalName = (yargs2) => {
  yargs2.positional("name", {
    describe: "The name of the secret, if not set, it will be taken interactively"
  });
};
var kss = import_yargs.default.scriptName("kss").help("help").version("1.0.0").demandCommand(1, "You must provide at least one command.").strictCommands().command(addCommandName, addCommandDescription, positionalName, addCommandHandler).command(rmCommandName, rmCommandDescription, positionalName, rmCommandHandler).command(lsCommandName, lsCommandDescription, positionalName, lsCommandHandler).command(cpCommandName, cpCommandDescription, positionalName, cpCommandHandler).command(configCommandName, configCommandDescription, (yargs2) => {
  yargs2.positional("ls", {
    describe: "List available configuration options with their description"
  });
}, configCommandHandler);
import_yargs.default.getOptions().boolean.splice(-2);
kss.parse();
