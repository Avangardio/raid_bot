"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DB = void 0;
const nedb_init_1 = require("./database/nedb.init");
const extendedDB_1 = require("./database/extendedDB");
const path = require('node:path');
exports.DB = {
    raids: undefined,
    specs: undefined,
};
// this is a top-level await
(() => __awaiter(void 0, void 0, void 0, function* () {
    // Инициализация базы данных
    exports.DB.raids = new extendedDB_1.NEDB({ filename: path.join(__dirname, '..', 'database', 'raids.data.db') });
    exports.DB.specs = new extendedDB_1.NEDB({ filename: path.join(__dirname, '..', 'database', 'specs.data.db') });
    yield (0, nedb_init_1.loadDatabaseAsync)(exports.DB.raids);
    yield (0, nedb_init_1.loadDatabaseAsync)(exports.DB.specs);
    require('./handlers/client.handler');
}))();
