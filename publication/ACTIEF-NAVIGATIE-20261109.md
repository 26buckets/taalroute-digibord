# Actief: navigatie — expliciet akkoord Nico, 9 november 2026

Nico: “Ja, voer deze navigatie zo door in de hele app en zet het direct live. Zorg dat de lopende les en voortgang behouden blijven en laat voorbeelden zien van wat je daadwerkelijk hebt aangepast. Een complete UI review ronde hieroverheen. Een advocaat van de duivel en daarna weer een review ronde. En alles wat je dan krijgt werkt dat en zet dat online.”

Dit is de nieuwe concrete toestemming voor de eerder beoordeelde navigatie, inclusief de drie hoofdlinks in de header en publicatie. De overige headerfuncties en de bestaande appopzet blijven behouden. De oudere headerbevriezing wordt uitsluitend voor deze wijziging bijgewerkt; de oorspronkelijke tag, herstelmanifesten en publicatiecontrole blijven ongewijzigd.

## Vastgestelde basis

Livebron ed36e1e18ad26d94937baa68558a327a1a77a07f, Cloudflare ba787c26-6466-4870-aad3-8cedfb1a8ac9. Canonieke main 03424ae is een administratieve afstammeling. Alle 1.447 gepubliceerde bestanden zijn vóór wijzigingen tegen hun bronvingerafdrukken gecontroleerd: nul afwijkingen. Canoniek: 26buckets/taalroute-digibord, main, https://actief.taalroute.nl.

## Begrensde wijziging

- Spelen, Oefenen en Mijn lessen zichtbaar in de header; Mijn collectie blijft in het hamburgermenu. Logo/appkeuze, fullscreen en hamburger blijven op hun plek.
- Iedere les krijgt terug naar de herkomst, Les aanpassen, terugkijken en Les afronden. Buiten de les blijft Hervat les beschikbaar. De nieuwe-lesknoppen en directe ingangen maken hun werking vooraf duidelijk.
- Kaarten krijgen Vorige opdracht, Overzicht en Volgende opdracht. Terugkijken verandert geen beurt. De laatste kaart blijft staan totdat de docent bewust afrondt of opnieuw schudt.
- De browsergeschiedenis werkt op schermniveau. Een paginavernieuwing op de lesroute herstelt dezelfde les. Bewerkkeuzes veranderen een actieve les pas bij een nieuwe start.
- Antwoordweergave, leespositie en klassiek kaartantwoord worden per kaart onthouden. Lopende bordvragen, dobbelstenen, scores en oefenvoortgang gebruiken de bestaande opslag. Een nog getypt quizantwoord blijft bij menugebruik in het geheugen; vrije antwoorden worden volgens de bestaande privacyafspraak niet duurzaam opgeslagen.
- De navigatiegeschiedenis wordt niet vermenigvuldigd in elke spelundo. Spelundo blijft afzonderlijk werken.
- Kleine schermen houden leesbare tekst en scrollbare inhoud; bij weinig schermhoogte kan ook de werkruimte scrollen. De donkere header behoudt voldoende tekstcontrast.

Geen bronbank, antwoordmodel, vrijgavebeleid, afbeelding, opname of opslagmigratie wordt gewijzigd. Alle 480 goedgekeurde opnamen blijven behouden. Geen nieuwe afhankelijkheid of cloudworkflow.

## Drie reviewrondes

1. UI-review: hoofdschermen, negen beschikbare gezamenlijke oefenvormen, beide zelfstandige dobbelspellen, klassieke kaarten, instellingen, menu, desktop en mobiel. Hersteld: verborgen hoofdlinks, onduidelijke terugknoppen, onbereikbare kaartbediening en afgekorte titels.
2. Kritische tegenreview: geopende antwoorden, getypte quiztekst, lopende bordvraag, geheugen/volgorde/koppelselectie, beurt en scores, menu-uitstap, verlaten van lesaanpassing, herladen, browser terug/vooruit, laatste kaart, opnieuw schudden en spelundo. Hersteld: uitgestelde opslag na schermwissel, antwoordweergave bij terugkeer, onnodige kopieën in undo, quiztekst bij terugkeer en de race bij sluiten van instellingen.
3. Herstelreview: dezelfde routes opnieuw, 320–1920 pixels, lage schermen, licht/donker en de verplichte lokale regressies. Hersteld: donkere headertekst en minimale leesruimte op lage schermen. Testverwachtingen volgen de bewuste veranderingen: directe hervatting bij herladen, expliciete keuze na de laatste kaart en nieuwe terugknoppen. Inhoudelijke behoudscontroles blijven intact.

De uitgevoerde controles en eventuele herstelrondes staan in ACTIEF-NAVIGATIE-CONTROLES-20261109.json. De livecontrole krijgt een afzonderlijk verslag en echte schermafbeeldingen. Geen nieuwe klasproef of controle op fysieke digibordhardware claimen.

## Publicatie

Alle zware controles lokaal. De enige GitHub-workflow is handmatig en maximaal twee minuten; deze taak start geen GitHub Actions-run. Publiceer alleen de gecontroleerde afstammeling vanaf canonieke main met npm run deploy en wrangler.jsonc. Gebruik het bestaande scoped release-besluit. Tijdens de benodigde main-updates wordt uitsluitend de updateblokkering binnen deze expliciete vrijgave tijdelijk geopend; verwijder- en force-pushbeveiliging en de oorspronkelijke tag blijven beschermd. Herstel de blokkering onmiddellijk en zet de publicatie na livecontrole opnieuw vast.

## Afwerking uit de livevoorbeelden
De eerste publicatie 573bf8f6f9a64f80bb494c0f0bca8433724a540b / 17eb9528-6074-4929-b997-54d0e8e22325 slaagde voor de live navigatiecontrole en de 8.094 WZ-projecties. De zichtbare voorbeelden gaven aanleiding tot twee kleine verbeteringen binnen dezelfde opdracht: herkenbare kaarttekst in het overzicht in plaats van het algemene “Opdracht”, en een laadmelding bij Mijn lessen. De aanvullende navigatiecontrole wacht nu ook op de werkelijk geladen lessen en controleert het kaartlabel. Negen oefenvormen en voortgang opnieuw geslaagd; broninhoud en opslag blijven ongewijzigd.
