# AGENTS.md
> Vollständigkeitsregel: Details aus `docs/IDEAS.md` gelten vollständig; diese Datei ergänzt nur Arbeitsregeln für die Umsetzung.

## Geltungsbereich
Diese Datei gilt für das gesamte Repository.

## Dokument-Priorität
Bei Widerspruch gilt strikt:
1. `SEC.md`
2. `DD.md`
3. `TDD.md`
4. `AGENTS.md`
5. `VISION_SCOPE.md`

## Arbeitsprinzipien
- Fokus auf Entscheidungstiefe statt Klickvolumen.
- Explainability immer mitdenken (Warum profitabel/unprofitabel, warum Delay-Kaskade, warum Instabilität etc.).
- Kernloop respektieren: planen, validieren, veröffentlichen, beobachten, reparieren, lernen.
- Browser-first Bedienbarkeit priorisieren: Tabellen, Filter, Bulk-Operationen, Reaktionsgeschwindigkeit.
- Progressive Disclosure: Tiefe in Schichten (Netzwerk, Rotation, Ops, Yield, Wartung, Wettbewerb).

## Architektur-Leitplanken
- Server ist autoritativ.
- Keine kritischen Entscheidungen rein clientseitig.
- Commands müssen validierte Zustandsänderungen erzeugen.
- Draft-Validierung, What-if und KPI-Vorschau dürfen lokal laufen, final entscheidet der Server.

## Modell- und Feature-Disziplin
- MVP 0.1 Grenzen einhalten (kein Multiplayer, keine Allianzen, kein Cargo, keine Crew-Legality-Details, keine komplexen Slotverhandlungen, keine historischen Startjahre, keine Modding-Schicht).
- Bei neuen Tickets und Implementierungen die Vertical-Slice-Reihenfolge respektieren.
- Package-Abhängigkeitsregeln aus `TDD.md` einhalten.

## Dokumentationspflicht (verbindlich)
- Änderungen immer dokumentieren.
- `CHANGELOG.md` bei jeder inhaltlichen Änderung aktualisieren.
- ADR (`docs/adr/*.md`) bei Architektur-/Leitentscheidungen anlegen oder fortschreiben.
