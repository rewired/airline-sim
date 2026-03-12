import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { RouteCandidate } from "../types"

interface CandidateTableProps {
    candidates: RouteCandidate[];
    onSimulate: (candidate: RouteCandidate) => void;
}

export function CandidateTable({ candidates, onSimulate }: CandidateTableProps) {
    return (
        <div className="border rounded-md bg-card">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Route Pair</TableHead>
                        <TableHead>Distance</TableHead>
                        <TableHead>Demand</TableHead>
                        <TableHead>Competition</TableHead>
                        <TableHead className="text-right">Est. Contribution</TableHead>
                        <TableHead></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {candidates.map((c) => (
                        <TableRow key={c.id}>
                            <TableCell className="font-medium">{c.origin.iata} - {c.destination.iata}</TableCell>
                            <TableCell>{c.distanceKm} km</TableCell>
                            <TableCell>
                                <div className="w-full bg-secondary h-2 flex rounded-full overflow-hidden max-w-[80px]">
                                    <div className="bg-primary" style={{ width: `${c.demandScore}%` }} />
                                </div>
                            </TableCell>
                            <TableCell>
                                <Badge variant={c.competition === "High" ? "destructive" : "secondary"}>
                                    {c.competition}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-right text-green-500 font-medium">
                                +${c.estimatedContribution.toLocaleString()}
                            </TableCell>
                            <TableCell className="text-right">
                                <Button variant="outline" size="sm" onClick={() => onSimulate(c)}>Simulate</Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
