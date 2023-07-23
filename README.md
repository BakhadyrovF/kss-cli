# KSS-CLI: Keep Secrets Safe - Command Line Interface

**KSS-CLI** is a powerful and secure Command Line Interface (CLI) tool designed to help developers manage and store sensitive information, such as passwords, API keys, and other secrets, in a safe and encrypted manner. With a strong focus on security and ease of use, **KSS-CLI** utilizes a Secrets Manager approach, allowing users to securely store their secrets on their local devices and access them through the CLI.

## Installation

To install **KSS-CLI** globally, use the following **npm** command:

```bash
npm install -g kss-cli
```
> If command above gives an error, it is because `npm` can't create a symlink in your `usr/local/bin` (may be different depending on OS) directory.
Since **KSS-CLI** only for personal usage in your own device, you can use `sudo` to resolve this error.  

## Key Features

**Encryption Key Management**: When you run any command for the first time, **KSS-CLI** will attempt to retrieve the encryption key from the system's keychain. If the key is not found, **KSS-CLI** will generate a cryptographically secure encryption key and store it in the keychain. This ensures that your secrets remain secure, and **KSS-CLI** can access the key without further user intervention.

**Passwords/Secrets Management**: **KSS-CLI** securely stores passwords and secrets in an encrypted form. All encryption and decryption operations are performed using the encryption key stored in the system's keychain, ensuring your sensitive information is protected.

## Commands

1. **Add (`add`) Command**: Use `kss-cli add` to add new secrets.

2. **Remove (`rm`) Command**: Use `kss-cli rm` to remove specific secrets. **KSS-CLI** will perform a search based on the provided `secret-name` and prompt for authorization before removing the secret.

3. **Copy (`cp`) Command**: Use `kss-cli cp` to copy specific secrets to the clipboard. KSS-CLI will perform a full-text search based on the provided `secret-name` and prompt for authorization before copying the secret.

4. **List (`ls`) Command**: Use `kss-cli ls` to list all stored secrets. Provide a `[name]` argument to filter the results based on `secret-name`.

5. **Config (`config`) Command**: Use `kss-cli config` to change configuration options. Currently, the available option is `keychain-always-allow`, which determines whether your app has "Always Allow" access in the keychain. By default, this option is set to `enabled`.

# Examples

**Add (`add`) Command**. Use the `add` command to securely store a new secret:  
![add command example](https://raw.githubusercontent.com/BakhadyrovF/kss-cli/master/media/examples/add.gif)

**Remove (`rm`) Command**. Use the `rm` command to remove a specific secret:
![rm command example](https://raw.githubusercontent.com/BakhadyrovF/kss-cli/master/media/examples/rm.gif)

**Copy (`cp`) Command**. Use the `cp` command to copy a specific secret to the clipboard:
![cp command example](https://raw.githubusercontent.com/BakhadyrovF/kss-cli/master/media/examples/cp.gif)

**List (`ls`) Command**. Use the `ls` command to list all stored secrets or filter results based on `secret-name`:
![ls command example](https://raw.githubusercontent.com/BakhadyrovF/kss-cli/master/media/examples/ls.gif)