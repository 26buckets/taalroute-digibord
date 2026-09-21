# Audioverslag — Tongbrekers 240

21 september 2026. Het pakket blijft voorbereid voor inbouw; de actieve bank is niet vervangen en er is niet gepusht of gepubliceerd.

## Resultaat

- 240 kaarten, 240 unieke gekoppelde MP3-bestanden; geen ontbrekende opnames.
- De oorspronkelijke 94 koppelingen en bestandshashes zijn exact behouden.
- De 146 aanvullingen bestaan uit 140 nieuw gegenereerde opnames en zes exacte opnames uit de bestaande ElevenLabs-geschiedenis. De zes zijn opnieuw via hun exacte tekst geselecteerd en gedownload; de oudere onvolledige downloadlijst is niet op volgorde overgenomen.
- Stemverdeling: Rick 80, Jennifer 80, Roland 80. Bestaande steminstellingen behouden; Jennifer met dezelfde volumecorrectie. Roland gebruikt de bestaande v3-voordrachtaanwijzing.
- Totale audio: 17,56 MB, 814,1 seconden. Oude audiobestanden buiten deze selectie blijven bewaard.
- Kaartteksten, IDs, klankvallen, niveaus en moeilijkheden zijn ongewijzigd tegenover het voorbereide 240-pakket.

## Uitgevoerde controles

- Alle 240 MP3-bestanden volledig gedecodeerd; positieve duur, unieke bestandshashes, geen gemeten true peak op of boven 0 dBTP.
- Pakketvalidator geslaagd: bronexactheid, 240 unieke kaarten, vier groepen van 60, JSON/bundle-pariteit, 240 audioverwijzingen, 94 ongewijzigde oorspronkelijke opnames, 28 filtercombinaties en 240 bestaande-rendereruitkomsten.
- Tijdelijke browserweergave met de bestaande app en uitsluitend de nieuwe bank als testbron: Kaartspellen → Tongbrekers, 240-kaarttelling, alle 28 niveau/moeilijkheidscombinaties, volgende kaart en voorlezen. Afspelen gecontroleerd voor bestaande audio, nieuwe Jennifer- en Roland-audio en teruggevonden Rick-audio. Geen consolefouten waargenomen. Geen volledige individuele luisterreview uitgevoerd.
- `npm test`, `npm run test:activities`, `npm run lint` en `npm run build` geslaagd. De standaard typecontrole stuitte op de omgevingsafhankelijkheid `undici-types`; dezelfde controle slaagde met `npm run types -- --moduleResolution node`. Hiervoor is geen applicatiecode veranderd.
- Niet opnieuw uitgevoerd: volledige afzonderlijke bord- en bank-browserregressiesuites. De actieve applicatiecode en actieve banken zijn in deze opdracht niet gewijzigd.

## Bestanden en status

Bijgewerkt: de voorbereide Tongbrekers-JSON en JS-bundle, audio-plan, manifest, README en pakketvalidator. Toegevoegd: `tongbrekers-audio-240.json`, dit verslag en 146 bestanden onder `assets/audio/tongbrekers/tr-tongue-d240-*.mp3`.

Back-up vóór audiokoppeling: `work/tongbrekers-240-audio/before` in de taakmap `referenced-chatgpt-conversation-this-is-an`. Het productiejournaal en oorspronkelijke downloads zijn daar respectievelijk in de lokale werkmap en de Downloads-map behouden.

Technische pakketstatus: gereed, audio compleet, lokaal gecontroleerd. Menselijke review en lespilot: niet door deze taak uitgevoerd. Publicatie: niet uitgevoerd. De voorbereide bestanden worden gecommit op de bestaande publicatietak en gaan met de volgende push mee; daadwerkelijke activering blijft de inbouwstap uit README.md.
