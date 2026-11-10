# Gecontroleerde kaartmenuvrijgave — 10 november 2026

Nico: “Doe een compleet reviewronde en geef advies over het cijfer en wat nog beter moets. En natuurlijk gaat alles live wat je nu hebt gedaan.”

Dit is de expliciete publicatievrijgave voor de reeds getoonde kaartmenu- en niveauvoorvertoning (859e380, d8256e1 en b2ce3fd), inclusief de afgeronde UI-review. De eerdere previewbeperking vervalt uitsluitend voor dit gecontroleerde resultaat.

Livebasis vóór publicatie: ed839c65811d6ffed9d9ea5468e9b562c737d433; canonieke main 96bfb91c125b85852154afece5254d1158f5f57a. Browser en curl bevestigen dezelfde release. De preview is hiervan een afstammeling. De vier gewijzigde appbestanden zijn app.js, app-navigation.js, app-navigation.css en content-ui.js. De overige previewwijzigingen zijn controles en reviewverslagen. Inhoud, media, 480 opnamen, opslagformaat, vrijgavebeleid en overige routes blijven behouden.

De oorspronkelijke vastzetting, tag en manifest blijven ongewijzigd. De bestaande publicatiebeslissing bevat exacte bestandsvingerafdrukken. Alleen de updateblokkade van canonieke main wordt tijdens een gecontroleerde fast-forward push kort vrijgegeven; verwijder- en force-pushbeveiliging blijven actief, de updateblokkade wordt onmiddellijk hersteld. Publicatie verloopt via npm run deploy en de ongewijzigde guard. Na livecontrole opnieuw vastzetten.

De enige GitHub-workflow is handmatig met twee minuten limiet. Geen push-/PR-trigger en geen cloudtest gestart. Zware controles lokaal. Zie ACTIEF-KAARTMENU-REVIEW-20261110.json voor beoordelingsgrenzen, bewijs en advies. De nieuwe adviezen vormen geen onderdeel van deze publicatie.
