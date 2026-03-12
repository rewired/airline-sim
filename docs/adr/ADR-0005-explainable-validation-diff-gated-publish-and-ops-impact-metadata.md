# ADR-0005: Erklärbare Validation, verpflichtender Diff-Gate vor Publish und Impact-Metadaten für Recovery

## Status

Accepted

## Kontext

Im bisherigen Stand gab es drei Lücken im Kernloop Plan → Validate → Publish → Observe → Repair:

- Der Publish-Endpunkt lieferte bei Erfolg/Misserfolg keine einheitliche, strukturierte Antwort mit Explainability + Änderungszusammenfassung.
- Validation-Regeln lieferten zwar Meldungen, aber keine durchgehend maschinenlesbaren Ursachen- und Gegenmaßnahmen-Codes pro Regel.
- Vor Publish war kein verpflichtender Diff-Review-Schritt in der UI erzwungen.
- Recovery-Aktionen (`/api/ops/recover`, `/api/ops/swap`) lieferten kein nachvollziehbares Impact-Light (OTP/Kosten) für den Ops-Operator.

Das kollidiert mit den Leitplanken aus `SEC.md` (explainable validation results, mandatory diffs before publication).

## Entscheidung

- `/api/schedule/publish` liefert nun konsistent `{ success, errors, warnings, diffSummary, count? }`.
- Validation-Issues/Warnungen enthalten je Regel maschinenlesbare Felder:
  - `cause.code`, `cause.description`
  - `affectedLegIds`
  - `recommendedAction.code`, `recommendedAction.action`
- Die Schedule-UI rendert diese Daten als klaren Ursache→Gegenmaßnahme-Chain im Validation Panel.
- Vor Publish ist ein verpflichtender Diff-Schritt eingeführt: Publish-Button bleibt gesperrt, bis der Diff explizit als geprüft markiert wurde.
- Ops-Recovery-Endpunkte liefern einheitlich `impact`-Metadaten mit `otpDeltaPct`, `estimatedCostDelta`, `summary`.

## Konsequenzen

- Höhere Nachvollziehbarkeit und bessere Automatisierbarkeit der Validation-Ausgaben.
- UX-seitig weniger Blind-Publish-Risiko durch verpflichteten Diff-Review.
- Recovery-Entscheidungen werden erklärbarer (schneller Impact-Light vor/nach Aktion).
- API-Consumer (Web) können strukturierte Fehlerfälle ohne String-Parsing behandeln.
