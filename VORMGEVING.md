# Vaste woordlogo’s voor DigiBord

Goedgekeurd door Nico op 22 september 2026. Dit besluit geldt voor de hele DigiBord-app en gaat voor op eerdere voorstellen voor deze vier iconen.

| Opschrift | Betekenis / ondertitel | Vast bestand |
|---|---|---|
| LOWAN | Leerroute | `assets/guidance/lowan-leerroute.svg` |
| ERK | Taalniveau | `assets/guidance/erk-taalniveau.svg` |
| F | Referentieniveau | `assets/guidance/f-referentieniveau.svg` |
| BOW | Leskwaliteit | `assets/guidance/bow-leskwaliteit.svg` |

## Gebruik

- Gebruik steeds deze vier SVG-bestanden. Het zijn eigen woordlogo’s van DigiBord, geen officiële organisatielogo’s.
- Alle vier hebben dezelfde tekstballon. De letters staan erin. BOW heeft daaronder twee open vakjes met regels. Geen vinkjes of teken van goedkeuring toevoegen.
- LOWAN is gespeld met een W. LOHAN en de eerdere losse pictogrammen zijn vervallen. Maak geen nieuwe varianten zonder een nieuwe keuze van de gebruiker.
- Toon een korte ondertitel. Herhaal de letters niet direct naast het logo.
- De SVG’s gebruiken `currentColor` en `viewBox="0 0 96 80"`. Gebruik de bestaande CSS-maskers in `content-ui.css` voor de kleur. Normale maat: 64 × 53,33 px; niet kleiner dan 56 × 46,67 px. Aanraakvlak minimaal 44 × 44 px. Op zeer smalle schermen staan de knoppen in twee rijen.
- Het beeld is decoratief naast de toegankelijke knopnaam. De knopnaam bevat de betekenis en actuele koppelstatus. Alle vier openen hetzelfde bestaande uitlegvenster bij het gekozen onderdeel.
- Bij Oefenen horen de knoppen bij de werkelijk gekozen opdrachten. Houd het leerlingenscherm tijdens het spelen rustig. Gebruik gewone woorden in knoppen, instructies, uitleg, instellingen en foutmeldingen.

## Betekenis blijft apart

LOWAN, ERK en F zijn afzonderlijke koppelingen; geen automatische gelijkstelling. Een bestaand niveaufilter is geen bewijs. Ontbrekende koppelingen heten ‘Nog niet gekoppeld’. BOW geeft hulp bij leskwaliteit en betekent geen taalniveau, certificaat of bewezen uitvoering van de les. Eigen afspraken van Taalroute blijven apart herkenbaar.

## Bronset en onderhoud

De vaste bronset staat op [Google Drive](https://drive.google.com/drive/folders/1lZbrj1pDDqggOGrfVW7pZlTeFFZVco7P), onder Taalroute → 07_Publicatie_media_en_vormgeving → 02_Digibord_UI_assets → Vaste_woordlogos_LOWAN_ERK_F_BOW_v1.0.

- [Vastgesteld besluit en gebruiksafspraken](https://drive.google.com/file/d/1TXZ26KGfmf4W_K1buf5am5hpqy3qDMkY/view)
- [Definitieve BOW met twee open vakjes](https://drive.google.com/file/d/1YRNG_Lg-eAUPg5lUz8HDaUkoest9bYl7/view)
- [Manifest van de vaste set](https://drive.google.com/file/d/1kHVbI474cZ5pLnnJtOnNW2uKAH94CqxP/view)

De aangeleverde lokale bronset staat in `/Users/nicoknoester/Documents/Codex/2026-09-11/q/outputs/digibord-woordlogos/`. Alleen de vier SVG-appassets worden opgenomen in de app; geen overzicht, ZIP of documentatie in de appbundel.

Gebruik voor nieuwe plekken de bestaande knoppen, stijlen en bestanden. Vervang een logo alleen na een expliciete ontwerpkeuze, werk dan de bronverwijzing bij en controleer tekstpassing, kleur, aanraakbediening en toetsenbord. Verander inhouds-ID’s, niveaukoppelingen of opslag niet vanwege een wijziging van het logo.
