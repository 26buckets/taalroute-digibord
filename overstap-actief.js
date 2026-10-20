'use strict';
const transfer = globalThis.ActiefTransfer;
const statusElement = document.querySelector('#status');
const isDestination = location.hostname === 'actief.taalroute.nl' || location.hostname === 'localhost' || location.hostname === '127.0.0.1';
document.querySelector('#import-section').hidden = !isDestination;
document.querySelector('#export-section').hidden = isDestination;
let incoming, before, different = 0;
function download(data, name) {
  const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }));
  const link = document.createElement('a');
  link.href = url; link.download = name; link.click();
  setTimeout(() => URL.revokeObjectURL(url), 30000);
}
document.querySelector('#download').onclick = async () => {
  try {
    const data = await transfer.snapshot(localStorage, indexedDB);
    download(data, 'Taalroute-overstap-naar-Actief.json');
    statusElement.textContent = `${data.records.length} lesrecords en ${Object.keys(data.local).length} instellingen bewaard. Bewaar dit bestand totdat je je lessen in Actief hebt gecontroleerd.`;
  } catch (error) { statusElement.textContent = error.message; }
};
const restoreButton = document.querySelector('#restore');
document.querySelector('#backup').onchange = async event => {
  incoming = null; restoreButton.disabled = true;
  document.querySelector('#replace').checked = false;
  document.querySelector('#conflict-label').hidden = true;
  document.querySelector('#summary').textContent = '';
  try {
    const file = event.target.files[0];
    if (!file) return;
    if (file.size > 40 * 1024 * 1024) throw new Error('Dit bestand is te groot om veilig in één keer over te nemen.');
    incoming = transfer.validate(JSON.parse(await file.text()));
    before = await transfer.snapshot(localStorage, indexedDB);
    different = transfer.conflicts(before, incoming);
    document.querySelector('#summary').textContent = `${incoming.records.length} lesrecords en ${Object.keys(incoming.local).length} instellingen gevonden.${different ? ` ${different} bestaande gegevens verschillen.` : ''}`;
    document.querySelector('#conflict-label').hidden = !different;
    restoreButton.disabled = !!different;
    statusElement.textContent = '';
  } catch (error) { incoming = null; statusElement.textContent = error.message; }
};
document.querySelector('#replace').onchange = event => { restoreButton.disabled = !incoming || (different && !event.target.checked); };
restoreButton.onclick = async () => {
  if (!isDestination || !incoming || (different && !document.querySelector('#replace').checked)) return;
  restoreButton.disabled = true;
  try {
    download(before, 'Taalroute-Actief-herstel-voor-overstap.json');
    const result = await transfer.restore(incoming, localStorage, indexedDB, before);
    statusElement.textContent = `${result.records} lesrecords en ${result.settings} instellingen overgenomen. Open Actief en controleer Mijn lessen en je instellingen. Je gegevens op het oude adres zijn behouden.`;
    incoming = null;
  } catch (error) { statusElement.textContent = error.message; }
};
