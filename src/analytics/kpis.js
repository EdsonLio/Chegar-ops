export function calculateKPIs(items = [], tours = []) {
  const totalShipments = new Set(items.map(i => i.shipment).filter(Boolean)).size;
  const totalFacilities = new Set(items.map(i => i.facility).filter(Boolean)).size;
  const totalTransporters = new Set(tours.map(t => t.transporter).filter(Boolean)).size;

  const totalInvoice = items.reduce((sum, item) => {
    return sum + Number(item.invoiceAmount || 0);
  }, 0);

  const totalKm = tours.reduce((sum, item) => {
    return sum + Number(item.travelledKm || 0);
  }, 0);

  return {
    totalShipments,
    totalFacilities,
    totalTransporters,
    totalInvoice,
    totalKm
  };
}
