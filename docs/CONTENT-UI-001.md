# CONTENT UI 001 Docentselectie en universele sessiestarter

Status: implementatie op pull request 28, nog niet gemerged naar main.

## Doel

CONTENT UI 001 is de universele docentstarter bovenop CONTENT 000. De docent kiest inhoud en werkvorm. De runtime maakt één canonieke SessionConfig. BOARD, WHEEL, CARDS en iedere later geregistreerde compatibele GameEngine projecteren daarna dezelfde geselecteerde content IDs. DICE is de vierde bewezen engine.

De interface is niet gebonden aan ER B1. De huidige stagingcatalogus bevat GRAM PB 001 met ER, ZULLEN, ZOUDEN en de modale mix op A2, B1 en B2. De catalogusstructuur kan later extra contentfamilies opnemen zonder een tweede sessiemotor te bouwen.

## Bindende scope

1. Contentfamilie kiezen.
2. Onderwerp of selectieprofiel kiezen.
3. Niveau kiezen.
4. Subonderwerp of alles kiezen.
5. Oefenfocus kiezen.
6. Productief, receptief of gemengd kiezen.
7. Moeilijkheid kiezen.
8. Tijdsduur kiezen.
9. Organisatievorm kiezen.
10. Alleen compatibele spelvormen tonen.
11. Beschikbare contenttelling tonen.
12. Eén SessionConfig genereren.
13. BOARD, WHEEL en CARDS vanuit diezelfde sessie starten.
14. Inhoud eerst en spel eerst moeten dezelfde semantische configuratie opleveren.
15. Ongeldige of onvoldoende selectie mag nooit stilzwijgend worden aangevuld met een ander niveau, onderwerp, filter of organisatievorm.

## Docentlabels

Technische InteractionType waarden worden niet als docentkeuze getoond. De docent ziet didactische labels zoals Herkennen, Invullen, Zin bouwen, Fout verbeteren, Snel antwoorden, Herschrijven en Zelf produceren.

## Organisatievormen

Klassikaal, groepen, duo's en individueel zijn echte sessieparameters. De gekozen organisatievorm wordt in SessionConfig bewaard en door de spelruntime gebruikt.

## Compatibiliteit

De interface leest spelmotoren uitsluitend uit GameEngineRegistry en vraagt de centrale runtime welke geregistreerde engines de actuele selectie veilig kunnen uitvoeren. Niet compatibele of nog gespecialiseerde spelvormen worden niet in de keuzelijst getoond.

De huidige GRAM PB 001 stagingruntime ondersteunt ook IT_008_ORDER via de lichte text_order adapter. Dit is een tekstgebaseerde volgordeprojectie. Een rijkere interactieve ordering renderer kan later worden toegevoegd zonder de canonieke records te wijzigen.

## Contenttelling en capaciteit

De interface toont aantallen uit de actuele canonieke selectie. De gekozen tijdsduur wordt gecontroleerd tegen de geschatte totale contentduur. Een te smalle selectie wordt geblokkeerd. De runtime verlaagt niet automatisch het niveau, wisselt niet van onderwerp en verruimt geen filters om een sessie alsnog te vullen.

## Twee routes, één motor

Inhoud eerst:
Oefenen, inhoud kiezen, spelvorm kiezen, starten.

Spel eerst:
Een spel openen via de oefenstarter, inhoud kiezen, starten.

Bij gelijke keuzes en gelijke seed moeten beide routes dezelfde selectieopties en dezelfde geselecteerde content IDs opleveren.

## Bron en staging

Canonieke stagingbron: GRAM PB 001 v1.2.

Aantal records: 1440.

Onderwerpen: ER, ZULLEN, ZOUDEN.

Niveaus: A2, B1, B2.

MODAAL is een selectieprofiel over bestaande ZULLEN en ZOUDEN records. Het maakt geen nieuwe inhoudskopieën.

Stagingpariteit en bronhash worden door de import en buildtests bewaakt.

## Buiten scope van CONTENT UI 001

CONTENT UI 002 bevat de persoonlijke en herbruikbare docentlaag:

Mijn selecties

Opgeslagen lesconfiguraties

Recente sessies

Favorieten

Mixprofielen

Deze functies mogen later SessionConfig en selectieprofielen opslaan, maar krijgen geen tweede selectiemotor en geen eigen kopieën van taalcontent.

## Acceptatiebewijs

De regressiesuite moet minimaal bewijzen:

de volledige stagingbron valideert

onbekende filterwaarden worden geweigerd

ongeldige onderwerpen en niveaus geven geen fallback

te smalle selecties worden geblokkeerd

contenttelling volgt de actieve filters

alleen compatibele spelmotoren worden aangeboden

inhoud eerst en spel eerst zijn semantisch gelijk

gelijke seed en selectie geven dezelfde content IDs

BOARD, WHEEL, CARDS en DICE gebruiken één SessionConfig

duo's bereiken de echte spelruntime

standaard spelstart beëindigt een actieve canonieke contentsessie

bestaande DigiBord regressies blijven groen

## Releasegrens

Een groene CONTENT UI 001 poort op de pull request is technische bouwvrijgave. Main wordt niet automatisch gewijzigd. Merge en productierelease blijven afzonderlijke besluiten.
