import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RoutePerformanceRow } from "../hooks/useDashboardInsights";

export function TopBottomRoutes({
  topRoutes,
  bottomRoutes,
}: {
  topRoutes: RoutePerformanceRow[];
  bottomRoutes: RoutePerformanceRow[];
}) {
  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Route Performance Insights</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h4 className="text-sm font-semibold text-green-500 mb-2">
            Top Performers
          </h4>
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Route</TableHead>
                  <TableHead className="text-right">Profit/Wk</TableHead>
                  <TableHead className="text-right">Margin</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topRoutes.map((r) => (
                  <TableRow key={r.routeId}>
                    <TableCell className="font-medium">{r.pair}</TableCell>
                    <TableCell className="text-right text-green-500">
                      +${r.profit}
                    </TableCell>
                    <TableCell className="text-right">
                      {r.marginPct.toFixed(1)}%
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-red-500 mb-2">
            Requires Attention
          </h4>
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Route</TableHead>
                  <TableHead className="text-right">Loss/Wk</TableHead>
                  <TableHead className="text-right">Margin</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bottomRoutes.map((r) => (
                  <TableRow key={r.routeId}>
                    <TableCell
                      className="font-medium cursor-pointer hover:underline text-blue-400"
                      title="Click to view network planner"
                    >
                      {r.pair}
                    </TableCell>
                    <TableCell className="text-right text-red-500">
                      -${Math.abs(r.profit)}
                    </TableCell>
                    <TableCell className="text-right">
                      {r.marginPct.toFixed(1)}%
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
