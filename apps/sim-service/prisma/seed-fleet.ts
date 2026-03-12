import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const airlineId = "123";

  await prisma.recoveryAction.deleteMany();
  await prisma.opsEvent.deleteMany();
  await prisma.kpiSnapshot.deleteMany();
  await prisma.flightLeg.deleteMany();
  await prisma.rotation.deleteMany();
  await prisma.scheduleVersion.deleteMany();
  await prisma.maintenanceWindow.deleteMany();
  await prisma.route.deleteMany({ where: { airlineId } });
  await prisma.aircraftTail.deleteMany({ where: { airlineId } });

  await prisma.airline.upsert({
    where: { id: airlineId },
    update: {
      name: "AeroOps Air",
      cash: 12_500_000,
    },
    create: {
      id: airlineId,
      name: "AeroOps Air",
      cash: 12_500_000,
    },
  });

  const registrations = ["D-AIBA", "D-AIBB", "D-AIBC", "D-AIBD", "D-AIBE", "D-AIBF"];
  const types = ["A320", "B738", "A321", "A320", "A321", "B738"];

  for (let i = 0; i < registrations.length; i++) {
    await prisma.aircraftTail.create({
      data: {
        id: `tail-${i}`,
        airlineId,
        typeId: types[i],
        registration: registrations[i],
        status: i === 5 ? "reserve" : "active",
        health: i === 4 ? 92.5 : 98.0,
        utilizationTarget: 11.5 + (i % 3),
      },
    });
  }

  const routes = await Promise.all([
    prisma.route.create({
      data: {
        airlineId,
        originAirportId: "FRA",
        destinationAirportId: "LHR",
        weeklyDemand: 2350,
        competitionScore: 0.62,
        strategicRole: "trunk",
      },
    }),
    prisma.route.create({
      data: {
        airlineId,
        originAirportId: "FRA",
        destinationAirportId: "MAD",
        weeklyDemand: 1850,
        competitionScore: 0.44,
        strategicRole: "trunk",
      },
    }),
    prisma.route.create({
      data: {
        airlineId,
        originAirportId: "MUC",
        destinationAirportId: "BCN",
        weeklyDemand: 1220,
        competitionScore: 0.31,
        strategicRole: "feeder",
      },
    }),
  ]);

  const scheduleVersion = await prisma.scheduleVersion.create({
    data: {
      airlineId,
      versionNumber: 1,
      status: "Published",
      publishedAt: new Date(),
    },
  });

  const tails = await prisma.aircraftTail.findMany({ where: { airlineId } });
  const activeTails = tails.filter((tail) => tail.status !== "reserve");

  const rotations = await Promise.all(
    activeTails.map((tail, idx) =>
      prisma.rotation.create({
        data: {
          scheduleVersionId: scheduleVersion.id,
          tailId: tail.id,
          sequenceIndex: idx + 1,
        },
      }),
    ),
  );

  const monday = new Date();
  monday.setUTCHours(0, 0, 0, 0);
  const day = monday.getUTCDay();
  const diff = day === 0 ? 1 : 8 - day;
  monday.setUTCDate(monday.getUTCDate() + diff);

  const legTemplates = [
    { route: routes[0], depHour: 6, blockHours: 2, tailIdx: 0 },
    { route: routes[0], depHour: 14, blockHours: 2, tailIdx: 1 },
    { route: routes[1], depHour: 8, blockHours: 2.5, tailIdx: 2 },
    { route: routes[1], depHour: 17, blockHours: 2.5, tailIdx: 3 },
    { route: routes[2], depHour: 7, blockHours: 2.2, tailIdx: 4 },
  ];

  for (let dayOfWeek = 1; dayOfWeek <= 7; dayOfWeek++) {
    for (let i = 0; i < legTemplates.length; i++) {
      const tpl = legTemplates[i];
      const departure = new Date(monday);
      departure.setUTCDate(departure.getUTCDate() + (dayOfWeek - 1));
      departure.setUTCHours(tpl.depHour, 0, 0, 0);

      const arrival = new Date(departure.getTime() + tpl.blockHours * 3600000);
      const tail = activeTails[tpl.tailIdx];
      const rotation = rotations[tpl.tailIdx];

      await prisma.flightLeg.create({
        data: {
          scheduleVersionId: scheduleVersion.id,
          rotationId: rotation.id,
          flightNumber: `AS${200 + i + dayOfWeek * 10}`,
          tailId: tail.id,
          originAirportId: tpl.route.originAirportId,
          destinationAirportId: tpl.route.destinationAirportId,
          scheduledDepartureUtc: departure,
          scheduledArrivalUtc: arrival,
          state: "scheduled",
        },
      });
    }
  }

  const maintStart = new Date(monday);
  maintStart.setUTCDate(maintStart.getUTCDate() + 2);
  maintStart.setUTCHours(22, 0, 0, 0);
  const maintEnd = new Date(maintStart.getTime() + 6 * 3600000);

  await prisma.maintenanceWindow.create({
    data: {
      tailId: activeTails[4].id,
      startsAtUtc: maintStart,
      endsAtUtc: maintEnd,
      reason: "A-check overnight",
      severity: "planned",
    },
  });

  await prisma.kpiSnapshot.create({
    data: {
      airlineId,
      scheduleVersionId: scheduleVersion.id,
      capturedAtUtc: new Date(),
      profitToday: 84_500,
      networkOtp: 89.4,
      delayedFlights: 2,
      cancelledFlights: 0,
      activeFlights: 35,
      utilization: 72.3,
      notes: "Seed baseline snapshot",
    },
  });

  console.log(
    "Seeding completed: realistic airline state with published schedule version, rotations, maintenance, and KPI baseline.",
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
