import { useMemo, useState } from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MOCK_AIRCRAFT_TYPES } from "../mockData";
import { EconomicsPanel } from "./EconomicsPanel";
import { RouteCandidate } from "../types";
import { useSubmitRouteCommand } from "../hooks/useRoutes";

interface RouteSimulationDrawerProps {
  candidate: RouteCandidate | null;
  isOpen: boolean;
  onClose: () => void;
}

export function RouteSimulationDrawer({
  candidate,
  isOpen,
  onClose,
}: RouteSimulationDrawerProps) {
  const [frequency, setFrequency] = useState(7);
  const [aircraftId, setAircraftId] = useState<string>(
    MOCK_AIRCRAFT_TYPES[0].id,
  );

  const submitRouteCommand = useSubmitRouteCommand();

  const ac = useMemo(
    () =>
      MOCK_AIRCRAFT_TYPES.find((a) => a.id === aircraftId) ||
      MOCK_AIRCRAFT_TYPES[0],
    [aircraftId],
  );

  if (!candidate) return null;

  const capacity = ac.seats * frequency * 2;
  const demandMatched = (candidate.demandScore / 100) * capacity;
  const loadFactor = Math.min(demandMatched / capacity, 0.95);

  const revenue = loadFactor * capacity * (candidate.distanceKm * 0.15);
  const blockHours = (candidate.distanceKm / 800) * frequency * 2;
  const cost = blockHours * ac.costPerBlockHour;
  const contribution = revenue - cost;

  const competitionScore =
    candidate.competitionScore ??
    (candidate.competition === "High"
      ? 0.9
      : candidate.competition === "Medium"
        ? 0.5
        : 0.2);

  const handleCreate = async () => {
    try {
      await submitRouteCommand.mutateAsync({
        commandId: `cmd-${crypto.randomUUID()}`,
        airlineId: "123",
        originAirportId: candidate.origin.id,
        destinationAirportId: candidate.destination.id,
        weeklyDemand: candidate.weeklyDemand || Math.round(capacity * 0.8),
        competitionScore,
        strategicRole: candidate.distanceKm > 4500 ? "longhaul" : "trunk",
        plannedAircraftTypeId: ac.id,
        weeklyFrequency: frequency,
        expectedContribution: Math.round(contribution),
      });
      onClose();
    } catch (err) {
      console.error("Failed to persist route command", err);
    }
  };

  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DrawerContent className="max-h-[85vh]">
        <div className="mx-auto w-full max-w-3xl">
          <DrawerHeader>
            <DrawerTitle>
              Simulate Route: {candidate.origin.iata} ⇌{" "}
              {candidate.destination.iata}
            </DrawerTitle>
            <DrawerDescription>
              Configure frequency and equipment to evaluate economics and create
              a persistable route command.
            </DrawerDescription>
          </DrawerHeader>

          <div className="p-4 pb-0 flex flex-col md:flex-row gap-8">
            <div className="flex-1 space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Equipment Assignment</Label>
                  <Select value={aircraftId} onValueChange={setAircraftId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Aircraft Type" />
                    </SelectTrigger>
                    <SelectContent>
                      {MOCK_AIRCRAFT_TYPES.map((a) => (
                        <SelectItem key={a.id} value={a.id}>
                          {a.code} ({a.seats} seats)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Weekly Frequency: {frequency} flights</Label>
                  <input
                    type="range"
                    min={1}
                    max={28}
                    step={1}
                    value={frequency}
                    onChange={(e) => setFrequency(Number(e.target.value))}
                    className="w-full cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>1</span>
                    <span>28</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1">
              <EconomicsPanel
                revenue={revenue}
                cost={cost}
                contribution={contribution}
                loadFactor={loadFactor}
              />
            </div>
          </div>

          <DrawerFooter className="flex-row justify-end space-x-2">
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
            <Button
              onClick={handleCreate}
              disabled={submitRouteCommand.isPending}
            >
              {submitRouteCommand.isPending
                ? "Saving..."
                : "Create Route Command"}
            </Button>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
