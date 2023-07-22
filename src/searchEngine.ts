import Minisearch from 'minisearch';
import { getAllSecrets } from './database';

const minisearch = new Minisearch({
    fields: ['name'],
    storeFields: ['name'],
    searchOptions: {
        fuzzy: 0.2
    }
});


export const searchBySecretName = (secretName: string) => {
    minisearch.addAll(getAllSecrets());
    const searchResults = minisearch.search(secretName);

    return searchResults;
}