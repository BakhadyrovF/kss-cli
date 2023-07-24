import Minisearch from 'minisearch';
import { getAllSecrets } from './database';

const minisearch = new Minisearch({
    fields: ['name'],
    storeFields: ['name', 'secret'],
    searchOptions: {
        fuzzy: 0.3,
        prefix: true
    }
});


export const searchBySecretName = async (secretName: string) => {
    minisearch.addAll(await getAllSecrets());
    const searchResults = minisearch.search(secretName);

    return searchResults;
}