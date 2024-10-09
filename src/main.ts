import Datastore from 'nedb';
import {loadDatabaseAsync} from "./database/nedb.init";
import {NEDB} from "./database/extendedDB";
const path = require('node:path');

export let DB: {
    raids: NEDB,
    specs: NEDB
} = {
    raids: undefined,
    specs: undefined,
};

// this is a top-level await
(async () => {
    // Инициализация базы данных
    DB.raids = new NEDB({filename: path.join(__dirname, '..', 'database', 'raids.data.db') });
    DB.specs = new NEDB({filename: path.join(__dirname, '..', 'database', 'specs.data.db') });

    await loadDatabaseAsync(DB.raids);
    await loadDatabaseAsync(DB.specs);

    require('./handlers/client.handler')
})()
