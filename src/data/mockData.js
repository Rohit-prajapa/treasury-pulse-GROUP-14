export const entities = [
  { id: "all", label: "All entities" },
  { id: "NYC01", label: "New York Treasury" },
  { id: "LON01", label: "London Treasury" },
  { id: "PAR01", label: "Paris Treasury" },
  { id: "MUM01", label: "Mumbai Treasury" },
];

export const cashPositions = [
  { entity: "NYC01", currency: "USD", balance: 4200000, inflows: 620000, outflows: 810000, threshold: 60000 },
  { entity: "LON01", currency: "GBP", balance: 760000, inflows: 90000, outflows: 115000, threshold: 40000 },
  { entity: "PAR01", currency: "EUR", balance: 310000, inflows: 45000, outflows: 80000, threshold: 50000 },
  { entity: "MUM01", currency: "INR", balance: 8500000, inflows: 740000, outflows: 520000, threshold: 100000 },
  { entity: "NYC01", currency: "USD", balance: 150000, inflows: 18000, outflows: 25000, threshold: 60000 },
];

export const forecastData = Array.from({ length: 30 }, (_, i) => {
  const day = i + 1;
  const baseline = 4.2 - day * 0.035 + Math.sin(day / 2.5) * 0.12;
  return {
    day: `Day ${day}`,
    baseline: Number(baseline.toFixed(2)),
    lower: Number((baseline - 0.2 - day * 0.004).toFixed(2)),
    upper: Number((baseline + 0.2 + day * 0.004).toFixed(2)),
  };
});

export const alerts = [
  { entity: "PAR01", currency: "EUR", severity: "Critical", message: "Projected cash is approaching the minimum threshold.", time: "09:15" },
  { entity: "LON01", currency: "GBP", severity: "Warning", message: "Upcoming supplier payments may reduce the cash buffer.", time: "09:10" },
  { entity: "NYC01", currency: "USD", severity: "Emergency", message: "A sample position is below the configured threshold.", time: "09:05" },
];