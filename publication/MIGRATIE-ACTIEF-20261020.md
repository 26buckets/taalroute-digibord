# Taalroute Actief en het methode-DigiBord — 20 oktober 2026

Nico heeft in de chat ‘Adviseer DigiBord-naamgeving’ opdracht gegeven:

> het huidige digibord.taalroute.nl moet verbonden worden via Cloudflare aan het digibord wat ik aan het maken ben […] En het actief.taalroute.nl moet via Cloudflare het digibord worden.

Hij heeft bevestigd dat de methodeomgeving uit ‘FUNDAMENT: Lesbord’ de bestemming is. Na het stappenplan voor naamgeving, alle menu’s, gegevensoverdracht, beide Cloudflare-adressen, controles en back-up gaf Nico de uitvoeringsopdracht:

> pas alles maar aan.

Deze opdracht staat de gecontroleerde verhuizing naar Actief toe. Zij is geen algemene opheffing van publicatiecontroles. De oorspronkelijke V01.25-tag, het oorspronkelijke manifest en het vastzetbesluit blijven als herstelbron behouden. `publication-freeze.json` verwijst naar een expliciet besluit met de exacte toegestane bestandsvingerafdrukken. Iedere oorspronkelijke asset blijft bytegelijk, behalve de afzonderlijk vastgelegde naam- en menuwijzigingen. Een afwijkend bestand blokkeert.

De canonieke bron blijft `26buckets/taalroute-digibord`, branch `main`. De bestaande Cloudflare Worker `taalroute-digibord` blijft de app Actief aanbieden. Alleen het zichtbare product en het publieke adres wijzigen. De bestaande Durable Objects, inhoud, 480 audio-opnamen, opslagcodes, vrijgavefilters en functies blijven behouden.

De nieuwe methodeomgeving heeft een afzonderlijke bron en Worker `taalroute-methode-digibord`, met het adres `digibord.taalroute.nl`. Zij is een bèta bij de boeken; bestaande open productie- en praktijkreviewpunten zijn niet automatisch afgerond door deze verhuizing.

`digibord.taalroute.nl/overstap-actief.html` blijft de gegevens van het oude adres kunnen lezen. Gebruikers downloaden daar hun lessen en instellingen en nemen die op `actief.taalroute.nl/overstap-actief.html` over. Gegevens worden alleen lokaal verwerkt. Het oude adres wordt niet gewist. Bij conflicten vraagt de import om een bewuste keuze en downloadt zij eerst een herstelkopie. Opslagfouten breken de IndexedDB-transactie af en herstellen de betrokken instellingen.

Het methode-DigiBord gebruikt een afzonderlijke opslagcode. Oude instellingen-, Zinnenbouwer- en meedoen-links verwijzen naar Actief. Bestaande Live-verzoeken en oude media blijven via de bestaande Worker bereikbaar. Er is geen algemene doorverwijzing van de nieuwe DigiBord-homepage.

Gebruik voor Actief uitsluitend `npm run build` en `npm run deploy` met de canonieke `wrangler.jsonc`. Controleer de actuele release op **actief.taalroute.nl**, niet op het adres van de nieuwe methodeomgeving. De controle vereist een schone bron, exact de canonieke hoofdbranch, afstamming van de liveversie, behoud van alle oorspronkelijke assets buiten het vastgelegde wijzigingsbereik en de gecontroleerde audiohashes.

Uitgebreide controles draaien lokaal. De bestaande handmatige, begrensde GitHub-workflow blijft uitgeschakeld; er worden geen automatische cloudcontroles of automatische publicaties toegevoegd.

## Expliciete vrijgave na controle

Nico bevestigde op 20 oktober 2026 na de geslaagde lokale controles uitdrukkelijk: “Ja, publiceer deze gecontroleerde migratie en hef daarvoor de bevriezing eenmalig op”. Dit autoriseert uitsluitend de in het vrijgavebestand vastgelegde migratie en domeinomschakeling. De oorspronkelijke vastzetting, goedgekeurde tag, audio en herstelbasis blijven bewaard. De GitHub-updatevergrendeling wordt alleen voor deze fast-forward geopend en direct hersteld.
