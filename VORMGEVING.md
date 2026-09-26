# Vaste woordlogo’s voor DigiBord

## Duidelijke voorbereidingsstappen — 25 september 2026

De genummerde hoofdstappen gebruiken ronde labels van 44 × 44 px met cijfers van 22 px en koppen van 19 px. De open stap heeft een lichtblauwe kopbalk en een blauw rondje met wit cijfer. Gesloten stappen houden een lichtblauw rondje en tonen de gemaakte keuze. Cijfers blijven ook op smalle schermen zichtbaar; de hele kop is klikbaar. Onderdeel, Spelvariant en Meer opties blijven ondergeschikt zonder extra nummering. Automatisch doorgaan en de vaste grote tongbrekertekst blijven behouden.

Spelen, Oefenen, Mijn lessen en Mijn collectie blijven buiten spellen altijd zichtbaar met tekstlabels. Tot 900 px breed staan ze op een aparte rij onder het logo. Een niet-beschikbaar onderdeel verdwijnt niet stilzwijgend: Woorden en zinnen toont ‘Nog niet nagekeken’, Live toont ‘Binnenkort’, en hervatten toont waarom een bewaarde les niet kan worden geopend. Deze ingangen geven geen toegang tot niet-nagekeken opdrachten.

Bij gezamenlijke oefenkaarten blijven situatie, opdracht en verborgen voorbeeld apart. Gespreksregels staan op aparte regels. De compacte kaartregel voor lage vensters mag `.content-reading` niet terugbrengen naar 15 px: de bestaande schaal van 18–24 px voor situatie en antwoord blijft gelden, met scrollruimte waar nodig. `tests/grammar-review-browser.cjs` controleert dit ook op een groot maar laag venster. De vaste tongbrekermaten blijven afzonderlijk beschermd.

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
- De SVG’s gebruiken `currentColor` en `viewBox="0 0 96 80"`. Gebruik de bestaande CSS-maskers in `content-ui.css` voor de kleur. Bij het samenstellen van een les: 48 × 40 px, op verzoek van Nico op 22 september 2026 verkleind. In het uitlegvenster: 64 × 53,33 px. Deze keuze vervangt de eerdere minimummaat van 56 × 46,67 px. Aanraakvlak minimaal 44 × 44 px. Op zeer smalle schermen staan de knoppen in twee rijen.
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

## Proefles — kleur en leesbaarheid (22 september 2026)

Op verzoek van Nico gebruikt de voorbereiding van de proefles Taalroute-blauw met lichtblauwe vlakken en donkerblauwe tekst. Geen beige, bruin of groen voor deze voorbereiding. In de gedeelde inhoudsspellen krijgen situatie, opdracht en mogelijk antwoord afzonderlijke koppen en ruimte. De bestaande spelachtergronden blijven behouden. De dobbelvorm gebruikt de bestaande zichtbare driedimensionale dobbelsteen.

## Vaste richting voor de hele app (22 september 2026)

Nico heeft de rustige opmaak van de proefles gekozen als richting voor de hele app: dezelfde menu’s en knoppen, Taalroute-blauw, minder zichtbare tekst en geen decoratieve gekleurde randen of achtergrondaccenten per categorie. Pas dit bij de volgende schermen consequent toe; de hele app is nog niet omgezet.

Gebruik compacte, goed leesbare niveaulabels A1, A1+, A2, B1, B2, C1 en C2. Het label zelf draagt de betekenis; verzin geen symbolen die een taalniveau moeten voorstellen. A1+ blijft de afgesproken tussenstap, geen extra officieel ERK-niveau. Gebruik bestaande Lucide-iconen bij korte handelingswoorden, bijvoorbeeld Tijd, Groep, Start, Bewaar en Instellingen. Geen pictogram zonder tekst als de betekenis niet vanzelf spreekt. Behoud toegankelijke namen, zichtbare focus en minimaal 44 px aanraakvlak.

Toon vooraf onderwerp, niveau, één korte omschrijving, keuzes en Start. Extra uitleg kan onder een informatieknop. De situatie die nodig is om een opdracht te begrijpen blijft tijdens het oefenen zichtbaar. Gebruik kleur functioneel voor selectie, focus of feedback; geen eigen decoratieve kleur per bank. De vier eerder goedgekeurde woordlogo’s blijven ongewijzigd.

## Iconen en draaischijf (22 september 2026)

Bij de voorbereiding hebben verschillende keuzes een eigen herkenbaar icoon: inhoud = lagen, onderwerp = label, niveau = oplopende streepjes, lesvoorstel = notitieboek, onderdeel = vertakking, moeilijkheid = meter, tijd = klok, groep = personen. Algemene koppen zoals ‘Je les’ hebben geen extra icoon. De vier vaste woordlogo’s staan zichtbaar bij de gekozen inhoud, ook bij de proefles; hun uitleg opent via de knoppen.

Tijdens de gedeelde inhoudsspellen staat het niveau alleen in de bovenste balk. De draaischijf heeft een witte kop over de volle breedte van het hout, een blauwe schijf met duidelijke aanwijzer en genummerde vakken. Het gekozen vak staat ook bij de opdracht en is gemarkeerd in de lijst.

De vier knoppen blijven bij de gekozen les staan in een compacte rij van maximaal 400 px. Het uitlegvenster toont ze groter. De proefles heeft geen eigen promotieknop meer naast het inhoudsoverzicht; ze blijft herkenbaar als proef vindbaar en bewaarde lessen blijven werken. Vanuit de proefles is ‘Kies andere inhoud’ direct bereikbaar.

## Labels in het inhoudsoverzicht

Niveaus staan als losse blauwe labels (A2, B1, C1 enzovoort). Een groeibereik zoals A0 → A1 blijft één paars label; het wordt niet omgezet in twee behaalde niveaus. Niveauvrij en de spelsoort zijn grijs. Proefles is een afzonderlijk amberkleurig statuslabel. Kleur ondersteunt de zichtbare tekst en is nooit de enige betekenisdrager. Aantallen blijven rustige tekst naast de labels; onderwerpen behouden hun naam. Gebruik deze gedeelde labels ook bij volgende bankaansluitingen. Voeg geen decoratieve kleur per inhoudsfamilie toe.


## Lesuitleg — 23 september 2026

BOW groepeert gelijke doelen en toont Hulp, Bespreek en Daarna per oefenvorm. Algemene lestips staan onder Zo kun je de les geven. De vier bestaande woordlogo's blijven gelijk. Een bronniveau heet bijvoorbeeld B1 · bron; een beginnersroute heet A0 → A1 · route. Eerder beoordeelde adviezen houden hun normale niveaulabel. LOWAN toont Route bij de cursist; F toont Taalonderdeel zolang geen onderbouwd F-niveau is toegekend. Dit is onderbouwde gebruiksuitleg, geen automatische route- of niveaukoppeling. Ontbrekende of onbekende versies blijven Nog niet gekoppeld.


## Vastgezet: grote tongbrekers — 23 september 2026

Op uitdrukkelijk verzoek van Nico blijft de tongbreker de grote, centraal geplaatste leestekst. Lettergrootte `clamp(36px, 5vw, 88px)`, gewicht 700, regelafstand 1,25. Dat is 72 px bij een vensterbreedte van 1440 px en 88 px bij 1920 px. Smalle schermen houden minimaal 36 px. Een laag venster of langere tekst mag de letters niet verkleinen: de tekst loopt door op volgende regels en de bestaande kaartweergave kan zo nodig schuiven. Geen afkapping of kleine binnenste tekstscrollbalk.

Deze afspraak geldt voor alle tongbrekers en blijft buiten de compacte tekstregels van andere kaarten. Wijzig deze vaste maten alleen op expliciet verzoek van Nico. De bestaande browsercontrole tests/tongbrekers-browser.cjs bewaakt lettergrootte, regelafstand, gewicht en bediening op acht schermmaten, waaronder brede lage vensters en de langste bestaande tongbreker. Versoepel die controle niet om een onbedoelde verkleining te laten slagen.


## MR03 — open teksttaken (23 september 2026)

De MR03-taken gebruiken dezelfde rustige blauwe lesweergave in kaarten, speelbord en draaischijf. Bronblokken, opdracht, eigen antwoord en bespreking staan apart. Bij tekstverbetering is elke zin bewerkbaar; de oorspronkelijke tekst blijft opvraagbaar. Twee antwoordkolommen komen onder elkaar wanneer de beschikbare ruimte smal is. Aanraakvlakken minimaal 44 px en invoervelden met zichtbare labels en toetsenbordfocus. Het voorbeeld opent pas na een eigen poging; de algemene voorbeeldknoppen worden voor deze taken verborgen. De vaste tongbrekerstijl blijft ongewijzigd.


## Inhoudsoverzicht en Mijn lessen — 23 september 2026

Het inhoudsoverzicht toont aangesloten onderwerpen per familie, met zoeken op onderwerp en een niveaufilter. Een niveaulabel is hier ook een knop naar de voorbereiding (minimaal 44 px hoog, met toegankelijke naam). Aantallen tellen unieke opdrachten; mixen voegen geen kopieën toe. Niet-beschikbare niveaus geven een duidelijke lege uitkomst. Uitgestelde broninhoud blijft buiten het speelbare overzicht.

Mijn lessen, mixen en recent gebruiken dezelfde niveaulabels als Oefenen. Verberg daar de algemene spel-niveaukeuze: de niveaus horen bij de afzonderlijke lessen. Gebruik rustige blauwe knoppen en eenvoudige panelen zonder decoratieve gekleurde randen. Bestaande lesnamen en voortgang behouden. De vaste grote tongbrekerstijl blijft ongewijzigd.


## Rustiger kiezen — 23 september 2026

Deze afspraak vervangt de eerdere verplichte zichtbaarheid van de vier woordlogo’s: bij de voorbereiding staan ze nu onder de ingeklapte knop **Bij deze les**, gekoppeld aan de werkelijke selectie. De logo’s zelf en hun maten blijven gelijk. Eerst niveau, inhoud en onderwerp; daarna een onderdeel en optioneel een voorbeeld. Alle niveaus blijven kiesbaar; ontbrekende inhoud geeft een duidelijke melding. Mixen staan niet meer tussen de afzonderlijke onderwerpen in het overzicht. Bestaande opgeslagen mixen blijven geldig.

Het inhoudsoverzicht heeft maximaal één open familie; zoeken en filteren klappen geen families automatisch open. Aantallen zeggen bij welk filter ze horen; de les toont het aantal **opdrachten in deze les**. Grammaticaonderwerpen gebruiken gewone hoofdletters: Er, Zullen, Zouden. De vaste grote tongbrekers veranderen niet.

## Oefenen — goedgekeurde rustige lijst (24 september 2026)

Deze keuze vervangt de eerdere vaste volgorde niveau → inhoud → onderwerp.
Standaard is Onderwerp eerst, rustige lijst. Instellingen → Oefenen laat de docent kiezen tussen Onderwerp eerst, Niveau eerst, Lesdoel eerst, Spel eerst en Eerder gebruikt. Bewaar die voorkeur lokaal; verander hierdoor geen inhoud of opgeslagen voortgang.

- Eén voorbereidingsstap tegelijk open; klikken op een keuze opent direct de volgende stap, ook bij opnieuw kiezen van het al geselecteerde niveau.
- Inhoudsgroepen beginnen dicht. Eén groep tegelijk open; zoeken mag meerdere passende groepen openen. Lange groepen scrollen met hun kop in beeld.
- Witte lijsten, dunne neutrale scheidingen, Taalroute lichtblauw voor geselecteerde keuzes. Geen decoratieve gekleurde randen of extra animaties.
- Alleen aanwezige onderwerp-niveaus en geschikte spelkeuzes. Een spelbeperking zoals Zin bouwen moet zichtbaar zijn voordat het onderwerp wordt gekozen.
- Niveauvrij en A0 → A1 behouden hun eigen betekenis. C2 blijft onderdeel van de indeling zonder lege lesknoppen.
- Extra opties, voorbeeld en Bij deze les blijven ingeklapt. Gebruik de bestaande kleine LOWAN-, ERK-, F- en BOW-beelden.
- De keuze-indeling gebruikt dezelfde motor en opslag. Ook oorzaak en gevolg heeft dezelfde voorbereiding.
- De vaste grote tongbrekertekst en alle bestaande spelopmaak vallen buiten deze aanpassing.

## Open en rustig — volledige voorbereiding en instellingen (24 september 2026)

Nico heeft uiterlijk 1, Open en rustig, gekozen. De volledige voorbereiding en alle instellingenpagina's gebruiken de gedeelde stijl in `open-quiet.css`: systeemlettertype (-apple-system / Segoe UI), 15 px gewone tekst, 29 px paginatitel, gewichten 400/500, witte werkruimte, dunne neutrale scheidingen en lichtblauw voor selectie. Geen decoratieve gekleurde randen of geneste kaarten.

- Wat wil je oefenen? is de eerste zichtbare stap. Het inhoudsoverzicht staat onderaan, ingeklapt. De vijf opgeslagen indelingen blijven werken.
- Links staan de opeenvolgende leskeuzes. Rechts staat Je les met de gekozen inhoud, kleine niveaulabels, native keuzelijsten voor Tijd en Met wie?, Start les en bewaren. Op smalle schermen staan deze onderdelen onder elkaar.
- Extra opties, voorbeeld en lesuitleg blijven ingeklapt. De vier vaste woordlogo's behouden hun betekenis en maat.
- Alle twaalf instellingenpagina's gebruiken dezelfde letters, rustige lijsten, knoppen en geselecteerde kleur. De navigatie schuift op kleine schermen boven de instellingen; bediening blijft minimaal 44 px.
- Alleen de voorbereiding en instellingen krijgen deze stijl. Inhoud, bronversies, opgeslagen lessen, groepen, pionnen en de vaste grote tongbrekertekst veranderen hierdoor niet.
- `npm run test:practice:browser` controleert de routes, bewaren/hervatten, voorkeuren, de positie van het inhoudsoverzicht en alle instellingenpagina's op vier schermbreedtes.

## Tongbrekeraudio tijdelijk uit — 25 september 2026

Op verzoek van Nico blijft Voorlezen zichtbaar, grijs en uitgeschakeld bij alle tongbrekers. Toon ‘Voorlezen · tijdelijk uit’. Ook hervatten, andere niveaus en de kaartenkast mogen de audio niet activeren. De opnames blijven bewaard; de vaste grote tongbrekertekst blijft ongewijzigd. Audio pas weer inschakelen op expliciet verzoek.

## Vaste opdrachtregel: nadruk op oefenwoorden — 25 september 2026

Deze regel geldt voor alle online oefeningen en nieuwe aansluitingen. De nadruk hoort bij wat de cursist moet gebruiken of beoordelen, niet bij een toevallig gekozen voorbeeld.

- Maak verplichte woorden, woordgroepen, beginwoorden en eindwoorden vet. Doe dit ook bij ‘Vul … in’, ‘Reageer met’, ‘Zeg hetzelfde met’, ‘Herschrijf met’ en ‘Vervang … door …’. Meerdere aanwijzingen binnen één opdracht krijgen elk de juiste nadruk.
- Zet de twee mogelijkheden bij ‘Kies:’ vet. Maak een aangehaalde term waarover een vraag gaat eveneens vet, bijvoorbeeld het woord **‘compact’**.
- Alleen de bedoelde woorden zijn vet (gewicht 800). Instructiewoorden zoals Gebruik, Begin met, een vorm van, en en of blijven normaal (gewicht 400). Een volledige geciteerde woordgroep blijft één geheel.
- Concrete taalaanwijzingen staan op een rustige lichtblauwe regel. De zin die moet worden bewerkt en losse bouwstenen blijven daarbuiten. Aangehaalde termen binnen een gewone vraag blijven in die vraag staan.
- Pas dit toe in voorbereiding, kaarten, speelbord, draaischijf, quiz, dobbelspel en Zin bouwen, voor zover het spel geschikt is. De klassieke ingangen en hervatte goedgekeurde lessen gebruiken dezelfde opmaak.
- Laat een open vraag zonder verplichte woorden gewoon leesbaar. Bedenk geen verplichte woorden, verklap geen antwoord en maak niet de hele opdracht vet om aan de regel te voldoen.
- Behoud de letterlijke tekst, bronnen, inhoudsversies en opgeslagen voortgang. De vastgelegde grote tongbrekers en uitgeschakelde audio blijven behouden.

De gedeelde functie contentPromptHtml past deze regel toe. tests/content-prompt.cjs controleert de vormen en veilige tekstweergave; tests/grammar-review-browser.cjs controleert alle 4.061 gepubliceerde opdrachtteksten en de verschillende spelweergaven. Bij nieuwe instructievormen moet de controle bevestigen dat de bedoelde woorden nadruk krijgen voordat ze online komen.

## Vaste regel: duidelijke taal in de live app — 25 september 2026

Docenten en cursisten zien geen interne beoordelings- of ontwikkelstatus, zoals ‘nog niet nagekeken’, bronrecords of reviewstatus. Een komende activiteit krijgt het korte label **Binnenkort** en is niet aanklikbaar. De volledige tegel inclusief afbeelding is grijs; het label staat leesbaar boven op de afbeelding, ook op een telefoon. Bewaar de oorspronkelijke kleurenafbeelding. Voor een opgeslagen les die niet kan worden geopend: ‘Deze les is nu niet beschikbaar. Je opgeslagen les blijft bewaard.’ Interne voortgang staat alleen in werkdocumenten en verslagen. Controleer ook meldingen, inhoudsoverzicht en hervatten op deze regel.

## Bordopties en spelopties — Open en rustig

Bordopties en de algemene spelopties gebruiken dezelfde systeemletters, witte achtergrond, dunne scheidingen en lichtblauwe selectie als Oefenen. Labels 15 px, sectiekoppen 16 px, paneeltitel 23 px; bediening minimaal 44 px. Gelijke knoppen en keuzelijsten, volledige breedte waar nodig. Bordopties zijn gegroepeerd onder Spelen, Beeld en geluid en Nieuwe ronde. De drie hulp-/instellingenknoppen onder het bord zijn even groot, met gelijke pictogrammen en tussenruimtes. Op smallere schermen komen ze in een eigen rij. Donkere modus, instellingen, bordwerking en opslag blijven behouden.

## Verder en gooien

De vervolgknop op het bord gebruikt een rustig lichtblauw vlak, dunne blauwe rand en dezelfde systeemletters als de bordopties. Een dobbelsteenpictogram staat naast ‘Verder en gooien’; de sneltoets Spatie staat als klein afzonderlijk toetslabel. Op een klein scherm staan actie en toetslabel naast elkaar in één brede knop. Het blijft één knop: klikken, Enter en Spatie houden dezelfde werking.

## Alle uitlegvensters — Open en rustig

Dezelfde opmaak geldt ook voor Bij deze les, Spelregels, spelopties en alle andere uitlegvensters: systeemletters, gewone tekst 16 px, titel 23 px, dunne scheidingen, lichtblauwe selectie. Geen interne broncodes, beoordelingsnamen of versienummers tonen. De volledige bron- en beoordelingsgegevens blijven intern bewaard. LOWAN/ERK/F/BoW tonen informatie bij de werkelijk gekozen oefeningen; een ontbrekende niveau- of routekoppeling mag niet worden verzonnen.

Lesuitleg is maximaal 1.040 px breed. Titel en kleine woordlogo’s blijven in beeld; alleen de inhoud scrolt. Feiten en lestips staan in een tabel met duidelijke rijlabels. Tablabels worden niet midden in woorden afgebroken. Op kleine schermen komen de vier tabbladen in twee rijen. Informatie-iconen zijn 16 px binnen een klikvlak van minimaal 44 px. Dit verandert geen opgeslagen inhoud of de vaste grote tongbrekertekst.

## Bevroren voorbereiding en stapsgewijs herstel — 26 september 2026

De huidige voorbereiding is leidend en blijft ongewijzigd: indeling, keuzevolgorde, automatisch doorgaan, inhoudsmotor en vormgeving. Vraag Nico vooraf akkoord voor iedere afzonderlijke herstelstap. Stap 1 is uitsluitend goedgekeurd voor vaste posities van Spelen, Oefenen, Mijn lessen en Mijn collectie op die vier hoofdpagina’s. Houd de ruimte van de verborgen niveaukeuze gereserveerd, zodat de navigatie niet verschuift. Spelpagina’s blijven in deze stap ongewijzigd.

Voor latere stappen: behoud de huidige kaartspel-look. Nico wil expliciet de bestaande beweging terug waarbij een kaart uit de stapel komt en openvliegt; respecteer Minder beweging. Herstel van spelmenu’s, kaartanimatie en zelfstandige spellen vereist afzonderlijk akkoord. Alleen een menukaart terugzetten geeft oude tekstinhoud nog niet vrij.

## Stap 2: kaart vliegt open — 26 september 2026

Nico heeft stap 2 afzonderlijk goedgekeurd. De gezamenlijke kaartenroute gebruikt dezelfde bestaande kaartanimatie als de klassieke kaarten: vanuit de stapel naar de open kaart. De huidige kaartspel-look blijft behouden. Respecteer zowel Minder beweging in de app als de systeemvoorkeur. Tijdens de beweging mag een tweede klik geen kaart overslaan. De voorbereiding, spelmenu’s en vrijgave van andere spellen veranderen niet.

## Stap 3: kaartspelmenu — 26 september 2026

Nico heeft stap 3 goedgekeurd. Kaartspellen opent een rustige lijst met Grammatica en Snelvragen, die naar de bestaande voorbereiding voor kaarten leiden. De negen overige kaartspellen staan grijs en uitgeschakeld met Binnenkort, waaronder Tongbrekers en Verhalen vertellen. Die zichtbaarheid geeft geen oude inhoud vrij. In de gezamenlijke kaartspelweergave opent de knop Kaartspellen hetzelfde menu; Verder met je kaarten hervat de bestaande les. Behoud de huidige kaartspel-look, animatie en Minder beweging. De voorbereiding, inhoud, grote tongbrekertekst en audio blijven intact. Verhaaldobbelstenen zijn een afzonderlijke volgende stap en vallen buiten dit akkoord.
