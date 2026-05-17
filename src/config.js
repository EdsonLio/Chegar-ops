export const APP_NAME = 'CHEGAR Ops Intelligence';

export const REQUIRED_SHEETS = ['Items', 'Tour'];

export const COLUMN_ALIASES = {
  shipment: ['Shipment', 'Shipment Number', 'shipment', 'Shipment ID'],
  province: ['Province', 'Província', 'Provincia'],
  district: ['District', 'Distrito'],
  facility: ['Receiver HF', 'Receiver (HF)', 'Health Facility', 'HF', 'Unidade Sanitária'],
  order: ['Order', 'Order Number', 'Sales Order', 'SO'],
  deliveryNote: ['Delivery Note', 'DN', 'Delivery note'],
  quantity: ['Quantity', 'Qty', 'QTY'],
  invoiceAmount: ['Invoice Amount', 'Invoice amount', 'Invoice', 'Amount'],
  travelledKm: ['Travelled KM', 'Travel KM', 'KM', 'Travelled Km'],
  vehicle: ['Vehicle', 'Truck', 'Plate', 'Matrícula', 'Matricula'],
  transporter: ['Transporter', '3PL', 'Carrier'],
  departureDate: ['Departure Date', 'Start Date', 'Data de Partida'],
  deliveryDate: ['Delivery Date', 'Arrival Date', 'Data de Entrega'],
  deliveryTime: ['Delivery Time', 'Arrival Time', 'Hora de Entrega']
};

export const KPI_RULES = {
  maxLeadTimeHours: 24,
  lateDeliveryHour: 15,
  lateDeliveryMinute: 30,
  maxFileSizeMb: 50
};
