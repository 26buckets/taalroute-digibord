# GRAM IMP 002 runtime en staging

Status: kandidaatimplementatie, niet gepubliceerd.

Deze branch generaliseert de eerdere CONTENT 000 ER B1 vertical slice naar de volledige canonieke GRAM PB 001 bron.

## Bron

Google Drive: `GRAM PB 001 Productiebank ER ZULLEN ZOUDEN`

Drive ID: `1ofjEPAW9Crq4CgLWlsUS-FTubsgvEh4S_giFY4vhxCQ`

Bronversie: `1.2`

Reviewpoort: `REVIEW_GO`

Bronhash SHA 256: `17516b89747772425798de5a1a18e58fd4303c4b67397c3f94146cb5e21ed550`

Aantal: 1440.

Verdeling:

* ER 540
* ZULLEN 450
* ZOUDEN 450
* A2 480
* B1 480
* B2 480

MODAAL is geen kopieerbank. Het filtert de bestaande 450 ZULLEN en 450 ZOUDEN records op de canonieke tag `MODAAL`.

## Stagingketen

Ruwe staging snapshot:

`staging/gram-pb001-v1.2-source.json`

Manifest:

`staging/gram-pb001-v1.2-manifest.json`

Runtimeprojectie:

`data/content-vert001-er-b1.js`

De historische bestandsnaam van de runtimeprojectie blijft in deze kandidaatbranch behouden om de bestaande PR 28 laadketen niet tegelijk te hernoemen. De inhoud is niet langer beperkt tot ER B1.

Projector en validatie:

`scripts/import-gram-pb001.cjs`

Controle:

`npm run check:gram`

Gecontroleerd schrijven:

`npm run import:gram`

De projector weigert dubbele IDs, onbekende topics, niveaus, oefenvormen, reviewstatussen, versies en onveilige bronrecords.

## Publicatiepoort

Alle geprojecteerde records hebben:

* `review_status = REVIEW_GO`
* `publication_status = staging_only`

`REVIEW_GO` is dus nadrukkelijk geen publicatiebesluit.

Een latere releasepoort moet `publication_status` expliciet wijzigen. Deze branch publiceert niets en merge niet automatisch naar main.

## InteractionTypes

De twaalf oefenvormen worden als volgt geprojecteerd:

* meerkeuze_vorm → IT_004_MULTIPLE_CHOICE
* invullen → IT_005_FILL_GAP
* zinnen_leggen → IT_008_ORDER
* fout_verbeteren → IT_006_CORRECT_ERROR
* betekenis_kiezen → IT_017_IDENTIFY
* scenario → IT_001_OPEN_ANSWER
* snelvraag → IT_002_RAPID_ANSWER
* herschrijven → IT_007_TRANSFORM_SENTENCE
* dialoog_aanvullen → IT_018_COMPLETE_SENTENCE
* functie_sorteren → IT_017_IDENTIFY
* vrije_productie → IT_012_CREATE_EXAMPLE
* meerkeuze_context → IT_004_MULTIPLE_CHOICE

IT_008_ORDER gebruikt in BOARD, WHEEL en CARDS de expliciete adapter `text_order`. De canonieke prompt bevat de te ordenen zinsdelen. De adapter verandert geen antwoord of grammaticale inhoud. Een latere interactieve sleep renderer kan dezelfde InteractionType overnemen zonder nieuwe contentbank.

## Selectie

De docent kan afzonderlijk kiezen:

* ER
* ZULLEN
* ZOUDEN
* MODAAL

Per ingang:

* A2
* B1
* B2

De runtime weigert onbekende topics, niveaus, productievormen, moeilijkheden en familietags. Er is geen stille fallback.

BOARD, WHEEL en CARDS ontvangen exact dezelfde `selected_item_ids` uit dezelfde `SessionConfig`.

## Rollback

Pre import Git SHA:

`d1c7c4202e974481aed3dc4233442fc88725ebfd`

Databackup:

`bank-backups/content-vert001-er-b1-v1.1.js`

Alleen de databron terugzetten:

`node scripts/import-gram-pb001.cjs --rollback bank-backups/content-vert001-er-b1-v1.1.js`

Voor een volledige runtime rollback moet de kandidaatbranch naar de vastgelegde pre import Git SHA worden teruggebracht of moeten de GRAM IMP 002 commits worden gerevert.

Main en live zijn in GRAM IMP 002 niet gewijzigd.

## Acceptatie

IMPORT_READY mag pas worden toegekend wanneer:

1. staging en runtimeprojectie exact 1440 records bevatten
2. alle IDs uniek zijn
3. alle topic en niveau filters lekvrij zijn
4. MODAAL geen duplicaten produceert
5. de drie engineprojecties dezelfde IDs gebruiken
6. de importprojector en buildguard groen zijn
7. de browser smoke groen is
8. de volledige bestaande regressiesuite groen blijft
9. geen deploy of main merge is uitgevoerd
