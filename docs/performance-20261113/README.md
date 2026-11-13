# Besparing voorbereid op 13 november 2026

Status: ontwikkelbranch. Niet gepubliceerd. Nog niet volledig publicatieklaar: de bestaande browsercontrole blijft hangen bij terugkeer uit het instellingenscherm. Dezelfde fout is gereproduceerd op de oorspronkelijke bronversie. Zie validation.json.

Negen oorspronkelijke PNG bestanden hebben afgeleide WebP versies. De zes eerste overzichtskaarten samen gaan van 11.796.500 naar 525.360 bytes. De app gebruikt de nieuwe bestanden; de originele beelden blijven ongewijzigd. De bestandsnamen bevatten een inhoudshash en krijgen een jaar browsercache. Het Theaterlezen menuicoon heeft een kleinere webvariant. Spelinhoud, opslag en vrijgavebeleid wijzigen niet.

## Meting

media-sizes.json bevat de exacte bestandsomvang en SHA256 van de webvarianten. Deze cijfers vergelijken bestanden op schijf. Ze zijn geen gemeten vermindering van alle aanvragen, gecomprimeerd netwerkverkeer, serverkosten of gebruikerssessies. De oorspronkelijke bestanden zijn behouden.

PNG beelden zijn omgezet met cwebp, methode 6, kwaliteit 86 en maximaal 1200 pixels breed. Het kleine Missies beeld is 160 pixels breed. De Theaterlezen achtergrond is 2400 pixels breed; de pauzeknop 192 pixels met kwaliteit 90. Bij de SVG bestanden is alleen de ingebedde PNG textuur vervangen door WebP van 512 pixels breed, kwaliteit 92. Vectorpaden en uitsneden zijn behouden.

## Controles

Zie validation.json voor uitgevoerde controles en hun werkelijke uitkomst. De eerste werkkopie gaf lokale leesproblemen. De uiteindelijke controles draaien vanuit een schone kopie. Testservers moeten actief zijn: Studio gebruikt 4173, Theaterlezen gebruikt TEST_URL. Er zijn geen cloudinstellingen, productiedata of vrijgaveblokkades gewijzigd.

## Publicatie en vervolg

Publicatie gebeurt uitsluitend vanuit de bestaande canonieke route, na de toepasselijke vrijgave. Actief en Spreektijd blijven uitdrukkelijk bevroren. Vergelijk na publicatie eerste bezoek, herhaalbezoek en een volledige les onder gelijke omstandigheden. Registreer totale aanvragen, functieaanroepen, ontvangen bytes, opgeslagen voortgang, fouten en laadtijd afzonderlijk.

Deze eerste ronde behandelt beelden en levering van openbare bestanden. Inhoud pas op aanvraag laden, kleinere offline pakketten en eventuele bundeling van serveropslag zijn een volgende ronde. Studio bewaart voorbereiding al lokaal; daar is geen serveropslagverkeer om te bundelen. Het nieuwe laadbeleid mag geen opgeslagen les of voortgang verliezen.
