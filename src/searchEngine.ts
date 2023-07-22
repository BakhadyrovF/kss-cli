import Minisearch from 'minisearch';
import { getAll } from './database';

const minisearch = new Minisearch({
    fields: ['secretName'],
});


export const searchBySecretName = (secretName: string) => {
    minisearch.addAll(getAll());
    const searchResults = minisearch.search(secretName);

    return searchResults;
}