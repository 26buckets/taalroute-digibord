# MATCH 001 Paarcontract en bronveiligheid

Status: technisch groen op pull request 28. MATCH is nog niet CONTENT_READY.

## Doel

MATCH 001 bepaalt welke canonieke relaties veilig als links-rechts paar gebruikt mogen worden door toekomstige Koppelen en Memory motoren.

Deze poort bouwt nog geen nieuwe MATCH renderer en schakelt de bestaande Koppelen motor nog niet universeel in.

## Hoofdregel

Een paar is alleen geldig wanneer beide zijden aantoonbaar uit het canonieke ContentItem of een expliciete betrouwbare canonieke relatie komen.

Niet toegestaan:

betekenis verzinnen

functie herformuleren

afbeelding koppelen zonder expliciete mediarelatie

open modelantwoord presenteren als enige correcte relatie

meerdere items met dezelfde rechterzijde in één automatisch paarcontract toelaten

## Contract

Machineleesbare bron:

match-pair-contract.js

Contractversie:

MATCH001-1.0

Ieder veilig paar bevat minimaal:

pair_id

content_item_id

pair_type

relation

left.kind

left.value

left.source

right.kind

right.value

right.source

topic

cefr_level

source_bank

source_version

contract_version

## Veilige paarsoorten in GRAM PB 001

### ERROR_CORRECTION

Bron:

exercise_type = fout_verbeteren

InteractionType:

IT_006_CORRECT_ERROR

Linkerzijde:

de expliciete foute zin na de eerste dubbele punt in prompt

Rechterzijde:

correct_answer

Relatie:

incorrect_sentence_to_correct_sentence

Aantal:

144

### ORDER_TO_SENTENCE

Bron:

exercise_type = zinnen_leggen

InteractionType:

IT_008_ORDER

Linkerzijde:

de expliciet aangeboden door elkaar geplaatste zinsdelen na de eerste dubbele punt in prompt

Rechterzijde:

correct_answer

Relatie:

scrambled_parts_to_correct_sentence

Aantal:

144

## Totaal veilig

Bronrecords:

1440

Veilige paren:

288

Geblokkeerd:

1152

Unieke linkerzijden binnen veilige pool:

288

Unieke rechterzijden binnen veilige pool:

288

Dubbele linkerzijden:

0

Dubbele rechterzijden:

0

Links gelijk aan rechts:

0

Kruisconflicten tussen linker en rechter pool:

0

## Geblokkeerde categorieën

### OPTION_CONTEXT_REQUIRED

Aantal:

240

Oefenvormen:

meerkeuze_vorm

meerkeuze_context

Reden:

de prompt is vaak generiek en de betekenis van de vraag hangt samen met de opties. Alleen prompt naar correct_answer koppelen zou context weggooien. Prompt plus opties naar correct_answer zou bovendien het antwoord al zichtbaar maken en is daarom geen bruikbaar MATCH paar.

### RIGHT_SIDE_NOT_UNIQUE_BY_DESIGN

Aantal:

384

Oefenvormen:

invullen

betekenis_kiezen

functie_sorteren

Reden:

de rechterzijde herhaalt structureel vaak.

Voorbeelden:

veel invulitems hebben correct_answer er

veel functie items delen dezelfde grammaticale functiebeschrijving

Een matching motor kan dan niet ondubbelzinnig bepalen welk rechterkaartje bij welk linkerkaartje hoort.

### OPEN_RELATION_NOT_UNIQUE

Aantal:

528

Oefenvormen:

scenario

snelvraag

herschrijven

dialoog_aanvullen

vrije_productie

Reden:

het modelantwoord is een voorbeeld of geleide uitwerking, maar niet noodzakelijk de enige natuurlijke correcte formulering.

MATCH mag een open modelantwoord daarom niet presenteren als één exclusief correcte relatie.

## Niet beschikbaar in PB001

### woord naar betekenis

PB001 bevat geen afzonderlijk canoniek betekenisveld dat één op één bij een woordrecord hoort.

Daarom:

niet veilig in MATCH 001.

### vorm naar functie

surface_form en language_function bestaan wel, maar zijn geen veilige itemparen.

Veel records delen dezelfde vorm of functie.

De labels zijn bovendien deels technische taxonomie.

Daarom:

niet automatisch vrijgegeven.

### afbeelding naar woord

PB001 bevat geen canonieke mediarelatie voor deze grammatica items.

media_requirements is leeg.

Daarom:

niet beschikbaar.

Een toekomstige Beeldbank of woordbank kan dit wel leveren wanneer een expliciete beeld woord relatie in de bron aanwezig is.

## Belangrijke randzaak

ER_B1_027 bevat in het promptaanbod onder andere:

eraan

Het correct_answer bevat:

Ik doe er volgend jaar weer aan mee.

Voor MATCH 001 is dit veilig als:

scrambled parts naar correcte zin

omdat beide zijden letterlijk uit canonieke bronvelden komen.

MATCH 001 probeert niet het woord eraan semantisch te splitsen of te interpreteren.

## Uniciteitsregel

Een matchset moet niet alleen veilige records bevatten.

Binnen de feitelijke set moet gelden:

iedere linkerwaarde uniek

iedere rechterwaarde uniek

geen linkerwaarde gelijk aan een rechterwaarde in dezelfde set wanneer dat de spelrelatie ambigu maakt

geen content_item_id dubbel

MATCH 002 moet deze checks opnieuw toepassen op de werkelijk getrokken sessieset.

## Geen automatische afleiding

MATCH 001 introduceert nadrukkelijk geen AI of heuristische betekenisextractie.

Toekomstige paarsoorten mogen alleen worden toegevoegd wanneer:

de bronvelden expliciet bestaan

de relatie semantisch stabiel is

de cardinaliteit geschikt is voor matching

de gebruikersweergave didactisch verantwoord is

uniciteit technisch gecontroleerd kan worden

## Technisch bewijs

Repository:

26buckets/taalroute-digibord

Branch:

content-vert001-er-b1-runtime

Pull request:

https://github.com/26buckets/taalroute-digibord/pull/28

Geteste commit:

52f3671a5b8f9e68167791280a35c125830a18f7

GitHub Actions run:

35722770093

Eindstatus:

SUCCESS

Expliciet bewijs:

PASS: MATCH 001 pair contract exposes exactly 288 source-derived unique pairs and blocks ambiguous or open relations.

Daarnaast blijven groen:

CONTENT ENG 002 QUIZ

CONTENT ENG 002 SEQUENCE

volledige PB001 browserruntime

CONTENT UI 001

alle zeven bestaande activiteitenspellen

build

deploymentcontrole

bestaande Koppelen motor

bestaande Memory motor

overige DigiBord regressies

## Status van MATCH engine

MATCH blijft:

integrationStatus = EXISTING_SPECIALIZED

contentSessionEnabled = false

MATCH is dus nog niet universeel aangesloten.

## Volgende poort

CONTENT ENG 002 Fase 3 MATCH 002

Koppelen runtime adapter en browserpoort.

Doel:

de bestaande Koppelen motor laten werken op MatchPairContract paren

alleen veilige paren uit de actuele SessionConfig gebruiken

geen nieuwe content kopiëren

set uniciteit opnieuw controleren

onvoldoende veilige paren blokkeren zonder scope fallback

bestaande Koppelen activiteit buiten canonieke sessies ongewijzigd houden

pas na groene runtime en browserregressie MATCH op CONTENT_READY zetten.
