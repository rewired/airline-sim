# VISION_SCOPE
> Vollständigkeitsregel: Alle Details aus `docs/IDEAS.md` bleiben verbindlich; dieses Dokument strukturiert die Inhalte ohne Erweiterung.

## Produktthese
Die Simulation ist **kein Casual-Tycoon** und **kein B2B-Tool**, sondern ein browserbasiertes **Airline-Ops- und Network-Management-Spiel** für Spieler, die echte operative Tiefe wollen, ohne in regulatorischem Mikromanagement zu ersticken.

Kernnutzen:

> Plane ein Airline-Netz, betreibe es unter realistischen Zwängen und rette den Betrieb, wenn die Realität dir in die Turbinen greift.

Mischung aus:
- Netzwerkplanung
- Rotationsbau
- operativer Leitstelle
- wirtschaftlicher Steuerung
- Krisenmanagement

Nicht wie:
- Wartezeit-Simulator
- Excel mit Jetfuel-Theme
- Clicker mit Flugzeugen

## Zielgruppe
### Primärzielgruppe
- Midcore- bis Hardcore-Spieler
- Tycoon-/Management-Spieler
- Airline-/Flight-Sim-Enthusiasten
- Spieler mit Spaß an Systemoptimierung, Störungen, Recovery, KPIs

### Nicht-Zielgruppe
- reine Mobile-F2P-Wartezeitspieler
- Spieler, die primär 3D-Flugzeuge fliegen wollen
- Spieler, die maximale Regeltreue bis ins letzte Crew-Rest-Detail verlangen

## Kernfantasie
Nicht:
> Ich besitze eine Airline.

Sondern:
> Ich halte eine komplexe Airline mit knappen Ressourcen unter Druck stabil und profitabel.

## Spielmodi
### Single-Airline Career
- Fokusmodus
- ideal für Start und MVP

### Shared World / Async Competition
- später
- mehrere Airlines im selben Markt
- Wettbewerb um Nachfrage / Slots / Reputation

### Scenario Mode
- vordefinierte Starts
- low-cost carrier
- legacy hub carrier
- Inselhüpfer
- Krisenszenario mit Wetter / Maintenance / knappen Slots

## Monetarisierung
Empfohlen:
- Premium Buy-to-Play oder Premium + Expansions
- kein Pay-to-Skip
- kein Energie-/Wartezeitmodell
- kosmetische oder Content-DLCs möglich

Für dieses Segment ist Vertrauen wichtiger als kurzfristige IAP-Reibung.

## MVP-Scope
### MVP 0.1 — vertikaler Schnitt
#### Enthalten
- eine Airline
- private Welt
- 30–80 Flughäfen
- 4–6 Flugzeugmuster
- Route planning basic
- Rotation builder
- schedule validation
- profitability model basic
- maintenance light
- operations events basic
- recovery actions basic
- dashboard + analytics basic

#### Nicht enthalten
- Multiplayer
- Allianzen
- Cargo
- detaillierte Crew-Legality
- komplexe Slotverhandlungen
- historische Startjahre
- Modding-Schicht

### MVP-Erfolgskriterien
- 1 Woche Flugplan spielbar ohne UI-Frust
- Delay-Ketten nachvollziehbar
- mindestens 3 sinnvolle Recovery-Optionen pro Störungsklasse
- Spieler versteht, warum seine Airline Geld verliert
- kein kollabierendes UI bei 200+ Legs

## Roadmap
### Phase 1 — Core
- Airline- und Flughafendatenmodell
- Demand/Economy light
- Flotte
- Rotation Builder
- Publish/Versioning

### Phase 2 — Ops
- Event Engine
- Delay propagation
- Tail swaps
- Maintenance windows
- Alert Center

### Phase 3 — Insight
- KPI decomposition
- Explain-Why Panels
- Heatmaps / Hub diagnostics
- Forecasting

### Phase 4 — Wettbewerb
- KI-Airlines oder Shared World
- Yield pressure
- Reputation races
- slot scarcity

### Phase 5 — Ecosystem
- scenarios
- replay system
- import/export
- modding hooks

## North Star
Die perfekte browserbasierte Airline-Simulation für Midcore → Hardcore ist:

**ein hochbedienbares, erklärbares, operations-zentriertes Systemspiel**, in dem der Spieler nicht nur ein Netz baut, sondern es **unter realistischem Druck stabil, effizient und profitabel halten** muss.

Der Browser ist dafür ideal, wenn das Produkt als:
- Planungsoberfläche
- Leitstellen-Konsole
- Analysewerkzeug
- Recovery-Spielraum

gedacht wird — und nicht als billiger Ersatz für einen Desktop-Client.

## Nächste Schritte / Artefakte
Direkt ableitbar:
1. Screenflow für MVP 0.1
2. Domänenmodell als JSON/TypeScript-Schema
3. technische Monorepo-Struktur
4. Ticketliste für Vertical Slice
5. UI-Informationsarchitektur für Dashboard / Schedule / Ops

Aus diesem Stand sollten als Nächstes erzeugt werden:
1. UI-Informationsarchitektur pro Kernscreen
2. JSON-/TS-Schemas für alle Kernobjekte
3. Repo-/Monorepo-Struktur
4. erste 20–30 konkrete Build-Tickets
5. Wireframe-Textspec für Dashboard / Schedule / Ops

## Definition of Done für MVP 0.1
Ein Build gilt als MVP-tauglich, wenn:
- ein Spieler eine Airline starten kann
- mindestens 10 sinnvolle Routen planbar sind
- ein Wochenflugplan gebaut und veröffentlicht werden kann
- Konflikte sauber erklärt werden
- Störungen erzeugt und bearbeitet werden können
- Dashboard, Schedule und Ops logisch zusammenspielen
- die Ursachen von Gewinnen, Verlusten und Delays nachvollziehbar sind

## Empfohlene Sprintblöcke
- Sprintblock 1: T001–T012
- Sprintblock 2: T013–T024
- Sprintblock 3: T025–T035
- Sprintblock 4: T036–T045
- Sprintblock 5: T046–T055
- Sprintblock 6: T056–T060

## Minimaler Vertical Slice
- Route simulieren
- in Draft Schedule übernehmen
- Rotation validieren
- Schedule publizieren
- Incident erzeugen
- Recovery anwenden
- KPI-Veränderung sehen

Wenn das sitzt, lebt das Spiel. Wenn das nicht sitzt, ist alles andere Deko.
