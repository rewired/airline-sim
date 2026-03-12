# SEC (Security & Execution Constraints)
> Vollständigkeitsregel: Alle Details aus `docs/IDEAS.md` bleiben verbindlich; dieses Dokument strukturiert die Inhalte ohne Erweiterung.

## Priorität der Dokumente
Docs win order: **SEC > DD > TDD > AGENTS > VISION**.

## Autoritative Simulation / Trust Boundary
- keine kritische Spielentscheidung ausschließlich im Client
- Client darf lokal rechnen, aber Server entscheidet final
- Commands erzeugen validierte Zustandsänderungen
- Browser ist Arbeitsoberfläche, Server ist autoritativ

## Command- und Validierungsdisziplin
- Schedule- und Command-Validierung ist verbindlich
- Explainable Validation Results müssen Ursachen transparent machen
- Konflikte/Warnungen müssen begründet sein
- Diffs vor Veröffentlichung sind verpflichtend

## Realtime-Disziplin
- WebSocket mit snapshot + delta updates
- getrennte Kanäle für state / alert / collaboration
- clientseitige Rate-Begrenzung und Zusammenfassung
- Alerts bündeln statt Spam

## Persistenz- und Datenintegrität
Relationale Kernstruktur mit den Domänenobjekten:
- airline
- airport
- route
- flight_leg
- schedule_version
- rotation
- aircraft_tail
- maintenance_window
- ops_event
- recovery_action
- kpi_snapshot

## Betriebsrisiken und Gegenmaßnahmen
### Zu viel Sim, zu wenig Spiel
Gegenmaßnahme:
- konsequente Spielerentscheidungs-Perspektive
- abstrahieren, wo Details nichts bringen

### Zu viel UI, zu wenig Klarheit
Gegenmaßnahme:
- progressive disclosure
- saved views
- Explain-Why überall

### Zu viele Events, nur Stress
Gegenmaßnahme:
- Event-Drosselung
- Clustering
- Priorisierung
- Recovery-Assist

### Schlechte Skalierung
Gegenmaßnahme:
- serverautoritatives Kernmodell
- inkrementelle Projektionen
- Web Workers
- aggressive UI-Virtualisierung

## MVP-Grenzen (Sicherheits-/Komplexitätskontrolle)
Nicht enthalten in MVP 0.1:
- Multiplayer
- Allianzen
- Cargo
- detaillierte Crew-Legality
- komplexe Slotverhandlungen
- historische Startjahre
- Modding-Schicht

## Dokumentationspflicht
- Bei jeder inhaltlichen Änderung: CHANGELOG aktualisieren.
- Bei jeder Architektur- oder Leitentscheidungsänderung: ADR anlegen/fortschreiben.
