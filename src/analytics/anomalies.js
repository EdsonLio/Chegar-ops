import { KPI_RULES } from '../config.js';

export function detectAnomalies(items = [], tours = []) {
  const anomalies = [];

  items.forEach(item => {
    if (!item.order) {
      anomalies.push({
        type: 'missing-order',
        severity: 'high',
        message: `Shipment ${item.shipment} sem order`
      });
    }

    if (item.invoiceAmount <= 0) {
      anomalies.push({
        type: 'invalid-invoice',
        severity: 'medium',
        message: `Invoice inválida para shipment ${item.shipment}`
      });
    }
  });

  tours.forEach(tour => {
    if (tour.travelledKm <= 0) {
      anomalies.push({
        type: 'invalid-km',
        severity: 'medium',
        message: `KM inválido para ${tour.shipment}`
      });
    }

    if (tour.deliveryTime) {
      const [hour = 0, minute = 0] = tour.deliveryTime.split(':').map(Number);

      const isLate =
        hour > KPI_RULES.lateDeliveryHour ||
        (hour === KPI_RULES.lateDeliveryHour && minute > KPI_RULES.lateDeliveryMinute);

      if (isLate) {
        anomalies.push({
          type: 'late-delivery',
          severity: 'high',
          message: `Entrega tardia detectada para ${tour.shipment}`
        });
      }
    }
  });

  return anomalies;
}
