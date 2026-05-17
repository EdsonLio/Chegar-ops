import { COLUMN_ALIASES } from '../config.js';
import { sanitizeText } from '../utils/security.js';

function pick(row, aliases) {
  const key = aliases.find(alias => Object.prototype.hasOwnProperty.call(row, alias));
  return key ? row[key] : null;
}

function asNumber(value) {
  if (value === null || value === undefined || value === '') return 0;
  const cleaned = String(value).replace(/[^0-9,.-]/g, '').replace(',', '.');
  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function normalizeItems(rows = []) {
  return rows.map(row => ({
    shipment: sanitizeText(pick(row, COLUMN_ALIASES.shipment)),
    province: sanitizeText(pick(row, COLUMN_ALIASES.province)),
    district: sanitizeText(pick(row, COLUMN_ALIASES.district)),
    facility: sanitizeText(pick(row, COLUMN_ALIASES.facility)),
    order: sanitizeText(pick(row, COLUMN_ALIASES.order)),
    deliveryNote: sanitizeText(pick(row, COLUMN_ALIASES.deliveryNote)),
    quantity: asNumber(pick(row, COLUMN_ALIASES.quantity)),
    invoiceAmount: asNumber(pick(row, COLUMN_ALIASES.invoiceAmount))
  }));
}

export function normalizeTours(rows = []) {
  return rows.map(row => ({
    shipment: sanitizeText(pick(row, COLUMN_ALIASES.shipment)),
    province: sanitizeText(pick(row, COLUMN_ALIASES.province)),
    district: sanitizeText(pick(row, COLUMN_ALIASES.district)),
    vehicle: sanitizeText(pick(row, COLUMN_ALIASES.vehicle)),
    transporter: sanitizeText(pick(row, COLUMN_ALIASES.transporter)),
    travelledKm: asNumber(pick(row, COLUMN_ALIASES.travelledKm)),
    departureDate: sanitizeText(pick(row, COLUMN_ALIASES.departureDate)),
    deliveryDate: sanitizeText(pick(row, COLUMN_ALIASES.deliveryDate)),
    deliveryTime: sanitizeText(pick(row, COLUMN_ALIASES.deliveryTime))
  }));
}
