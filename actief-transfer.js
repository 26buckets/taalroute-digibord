(function (global) {
  'use strict';
  const databaseName = 'taalroute-lessons-v1';
  const format = 'taalroute-actief-transfer';
  const allowedKey = key => typeof key === 'string' && key.startsWith('taalroute-') && !key.startsWith('taalroute-methode-digibord');
  function validate(data) {
    if (!data || data.format !== format || data.version !== 1 ||
        !data.local || Array.isArray(data.local) || typeof data.local !== 'object' ||
        !Array.isArray(data.records)) throw new Error('Dit is geen reservekopie voor de overstap naar Actief.');
    for (const [key, value] of Object.entries(data.local)) {
      if (!allowedKey(key) || typeof value !== 'string') throw new Error('De reservekopie bevat onbekende instellingen.');
    }
    const seen = new Set();
    for (const row of data.records) {
      if (!Array.isArray(row) || row.length !== 2 || typeof row[0] !== 'string' ||
          !/^(saved_selection|mix_profile|recent_session):/.test(row[0]) ||
          !row[1] || typeof row[1] !== 'object' || Array.isArray(row[1]) || seen.has(row[0])) {
        throw new Error('De reservekopie bevat een ongeldig lesrecord.');
      }
      seen.add(row[0]);
    }
    return data;
  }
  function open(indexedDB) {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(databaseName, 1);
      request.onupgradeneeded = () => request.result.createObjectStore('records');
      request.onerror = () => reject(request.error);
      request.onblocked = () => reject(new Error('Sluit andere vensters van deze app en probeer opnieuw.'));
      request.onsuccess = () => {
        request.result.onversionchange = () => request.result.close();
        resolve(request.result);
      };
    });
  }
  function localSnapshot(storage) {
    const result = Object.create(null);
    const keys = Array.from({length:storage.length}, (_,i) => storage.key(i)).filter(allowedKey).sort();
    for (const key of keys) {
      const value = storage.getItem(key);
      if (value !== null) result[key] = value;
    }
    return result;
  }
  async function snapshot(storage, indexedDB) {
    const db = await open(indexedDB);
    try {
      const records = await new Promise((resolve, reject) => {
        const rows = [], tx = db.transaction('records'), request = tx.objectStore('records').openCursor();
        request.onsuccess = () => {
          const cursor = request.result;
          if (cursor) { rows.push([cursor.key, cursor.value]); cursor.continue(); }
        };
        tx.oncomplete = () => resolve(rows);
        tx.onabort = () => reject(tx.error || new Error('Lessen konden niet worden gelezen.'));
        tx.onerror = () => {};
      });
      return { format, version: 1, exportedAt: new Date().toISOString(), local: localSnapshot(storage), records };
    } finally { db.close(); }
  }
  function conflicts(before, incoming) {
    const records = new Map(before.records);
    return Object.entries(incoming.local).filter(([key, value]) => key in before.local && before.local[key] !== value).length +
      incoming.records.filter(([key, value]) => records.has(key) && JSON.stringify(records.get(key)) !== JSON.stringify(value)).length;
  }
  async function restore(data, storage, indexedDB, expected) {
    validate(data);
    const before = await snapshot(storage, indexedDB);
    if (expected && (JSON.stringify(before.local) !== JSON.stringify(expected.local) ||
        JSON.stringify(before.records) !== JSON.stringify(expected.records))) {
      throw new Error('De opgeslagen gegevens zijn intussen gewijzigd. Lees de reservekopie opnieuw in.');
    }
    const db = await open(indexedDB);
    try {
      await new Promise((resolve, reject) => {
        const tx = db.transaction('records', 'readwrite');
        let failure;
        tx.oncomplete = resolve;
        tx.onerror = () => {};
        tx.onabort = () => {
          try {
            for (const key of Object.keys(data.local)) storage.removeItem(key);
            for (const key of Object.keys(data.local)) {
              if (key in before.local) storage.setItem(key, before.local[key]);
            }
          } catch {
            reject(new Error('Herstel is onderbroken. Bewaar het gedownloade herstelbestand en sluit dit venster niet.'));
            return;
          }
          reject(failure || tx.error || new Error('Overnemen is niet gelukt. De bestaande gegevens zijn hersteld.'));
        };
        try {
          for (const [key, value] of data.records) tx.objectStore('records').put(value, key);
          for (const [key, value] of Object.entries(data.local)) {
            storage.setItem(key, value);
            if (storage.getItem(key) !== value) throw new Error('De browser kon de instellingen niet bewaren.');
          }
        } catch (error) { failure = error; tx.abort(); }
      });
      return { settings: Object.keys(data.local).length, records: data.records.length };
    } finally { db.close(); }
  }
  const api = { validate, snapshot, restore, conflicts };
  if (typeof module === 'object' && module.exports) module.exports = api;
  else global.ActiefTransfer = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
