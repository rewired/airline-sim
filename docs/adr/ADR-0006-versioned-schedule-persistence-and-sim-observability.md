# ADR-0006: Versionierte Schedule-Persistenz und Sim-Observability als First-Class Domain Records

## Status

Accepted

## Kontext

Der bisherige Sim-Service arbeitete beim Publish implizit auf einer unversionierten Liste von `flight_leg`-Datensätzen. Das führte zu mehreren Problemen:

- Es gab keinen expliziten Draft/Published/Archived-Lebenszyklus für Schedules.
- Rotationen existierten konzeptionell, wurden aber nicht als persistente Entität pro Version geführt.
- Operational-Events und Recovery-Aktionen waren nur teilweise im Laufzeitverhalten sichtbar, aber nicht konsistent als Verlauf speicherbar.
- KPI-Verläufe aus dem Game-Loop wurden nicht als Snapshot-Historie persistiert.

Die Leitplanken in `SEC.md` fordern jedoch explizit relationale Kernstrukturen inkl. `schedule_version`, `rotation`, `maintenance_window`, `ops_event`, `recovery_action`, `kpi_snapshot` sowie server-authoritative, nachvollziehbare Zustandsänderungen.

## Entscheidung

1. Das Prisma-Schema im Sim-Service wird um folgende Modelle ergänzt und verdrahtet:
   - `ScheduleVersion`
   - `Rotation`
   - `MaintenanceWindow`
   - `OpsEvent`
   - `RecoveryAction`
   - `KpiSnapshot`

2. Für jede neue Entität wird ein Repository im DB-Layer eingeführt, damit die Schreib-/Lesewege explizit und testbar sind.

3. Der Publish-Flow wird auf versionierte Schedule-Persistenz umgestellt:
   - Erzeugen einer neuen Draft-Version mit fortlaufender `versionNumber`
   - Persistenz der Legs auf der neuen Version
   - Archivierung vorheriger Published-Versionen
   - Promotion der neuen Version zu Published

4. Der Game-Loop persistiert:
   - Disruptions als `OpsEvent`
   - Periodische KPI-Messpunkte als `KpiSnapshot`

5. Ops-Recovery persistiert:
   - Ein `OpsEvent` pro Recovery-Eingriff
   - Eine verknüpfte `RecoveryAction` mit Cost-/Kommentar-Metadaten

## Konsequenzen

- Publish ist nachvollziehbar versioniert und entspricht dem Plan→Validate→Publish-Loop aus den Leitdokumenten.
- Betriebsvorfälle und Gegenmaßnahmen sind historisierbar statt nur transient.
- KPI-Entwicklung ist langfristig auswertbar.
- Das Seed-Setup kann nun realistische Initialzustände inkl. Version, Rotationen, Wartung und Baseline-KPIs erzeugen.
- Folgearbeit: Migrationen/Backfill-Strategie für bestehende lokale Datenbestände und potenzielle Reporting-Endpunkte auf Basis der Snapshot-/Event-Historie.
