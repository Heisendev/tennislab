import { getDatabase, closeDatabase } from './db.js';

// Schema creation is handled by db.js — this script only seeds data.
// It clears all existing rows first, so it can be re-run safely.
const db = getDatabase();

closeDatabase();
