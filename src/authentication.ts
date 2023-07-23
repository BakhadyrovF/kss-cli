import authenticator from 'macos-touchid';

export const authenticate = async (): Promise<boolean> => {
    if (authenticator.canAuthenticate() === false) {
        throw new Error('No authentication method available')
    }

    const isAuthenticated = await new Promise(resolve => {
        authenticator.authenticate('You must be authenticated to perform this action.', (err: Error, didAuthenticate: boolean) => {
            if (err) {
                resolve(false);
            }

            didAuthenticate ? resolve(true) : resolve(false);
        })
    })

    return isAuthenticated as boolean;
}