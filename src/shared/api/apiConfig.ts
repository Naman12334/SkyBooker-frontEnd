// Central API configuration for the frontend
// All requests are routed through the Vite proxy (which rewrites and forwards to Gateway on port 8080)
export const GATEWAY_URL = '';

// API prefixes as defined in vite.config.ts proxy
export const API_AUTH = '/api/auth';
export const API_AIRLINE = '/api/airline';
export const API_BOOKINGS = '/api/bookings';
export const API_FLIGHTS = '/api/flights';
export const API_SEATS = '/api/seats';
export const API_PASSENGERS = '/api/passengers';
