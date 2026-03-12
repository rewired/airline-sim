# ADR-0001: Dokumentations-Baseline aus IDEAS ableiten

## Status
Accepted

## Kontext
`docs/IDEAS.md` enthält die vollständige Produkt-, Domain-, UX-, Architektur- und Roadmap-Sammlung. Es fehlten daraus abgeleitete Leitdokumente für Vision/Scope, Domain Design, Technical Design, Security/Execution sowie Agentenregeln.

## Entscheidung
Wir führen die Dokumentations-Baseline ein:
- `VISION_SCOPE.md`
- `DD.md`
- `TDD.md`
- `SEC.md`
- `AGENTS.md`

Zusätzlich gilt:
- Priorität: `SEC > DD > TDD > AGENTS > VISION_SCOPE`
- Dokumentationspflicht: Änderungen erfordern `CHANGELOG.md`; Architektur-/Leitentscheidungen erfordern ADR-Updates.

## Konsequenzen
- Die zuvor verstreuten Inhalte aus `docs/IDEAS.md` sind in operative Dokumente überführt.
- Teams/Agenten haben klare Prioritäten und Dokumentationsregeln.
