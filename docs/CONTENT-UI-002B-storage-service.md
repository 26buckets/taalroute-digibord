# CONTENT UI 002B opslagadapter en servicelaag

Bouwcontract: CONTENT UI 002A Edition 0.3.

Deze implementatie voegt geen nieuwe gebruikersinterface toe. Zij levert de gedeelde domeinservice en een verwisselbare opslaggrens voor SavedSelection, RecentSession, FavoriteRef en MixProfile.

## Bestanden

content-storage.js bevat:

createMemoryStorageAdapter

createLocalStorageAdapter

createContentStorageService

schema en statusconstanten

fingerprints

privacyvalidatie

historische contentreferentievalidatie

De bestaande ContentRuntime blijft de enige selectiemotor.

## Bewuste grens

Multi scope selecties kunnen worden opgeslagen in SavedSelection en MixProfile, maar worden nog niet stilzwijgend platgeslagen naar de huidige grammatica runtime. createSessionFromSelection blokkeert multi scope uitvoering totdat de bestaande selectiemotor clause aware selectie ondersteunt.

Dat voorkomt dat bijvoorbeeld onderwerp en niveau relaties onbedoeld als een cartesisch product worden geïnterpreteerd.

## Sessieacties

resumeRecentSession gebruikt dezelfde session_id, dezelfde geselecteerde contentversies en waar ondersteund dezelfde runtime_progress.

replayRecentSessionExact maakt een nieuwe session_id met exact dezelfde toegestane content en lege voortgang.

rerollRecentSession gebruikt dezelfde genormaliseerde selectiecriteria met een nieuwe seed en nieuwe trekking.

## Privacy

runtime_progress wordt vóór opslag recursief gecontroleerd op persoonsgebonden velden die buiten CONTENT UI 002 vallen.

Persoonsgebonden cursistresultaten horen niet in deze laag.

## Concurrency

Mutabele objecten gebruiken record_revision en expectedRevision.

Een mismatch resulteert in CONFLICT_REVISION.

## Tests

tests/content-storage.cjs controleert het domeincontract.

tests/content-storage-browser.cjs controleert echte browseropslag, reload, resume, replay, reroll, privacy en revision conflicts.

De volledige bestaande regressiesuite blijft verplicht.

De regressiepoort draait tegen de volledige afhankelijke CONTENT stack.
