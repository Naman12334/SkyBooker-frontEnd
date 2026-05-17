import axios from 'axios';
import { User } from '../../features/auth/constants';
import authApi from './authApi';
import { API_AIRLINE, API_BOOKINGS, API_FLIGHTS } from './apiConfig';

const airlineApi = axios.create({ baseURL: API_AIRLINE });
const bookingApi = axios.create({ baseURL: API_BOOKINGS });
const flightApi = axios.create({ baseURL: API_FLIGHTS });

// Add interceptors to other instances
const addInterceptor = (instance: any) => {
  instance.interceptors.request.use((config: any) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
};

[airlineApi, bookingApi, flightApi].forEach(addInterceptor);

// --- User Management (Auth Service) ---
export const getAllUsers = async () => {
  const endpoints = ['/users', '/all', '/users/all'];

  for (const endpoint of endpoints) {
    try {
      console.log(`Attempting to fetch users from: ${endpoint}`);
      const response = await authApi.get<User[]>(endpoint);
      console.log(`Successfully fetched users from: ${endpoint}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 403 || error.response?.status === 404) {
        console.warn(`Endpoint ${endpoint} returned ${error.response.status}.`);
        continue; // Try the next endpoint
      }
      // If it's a different error, we should probably stop
      console.error(`Unexpected error on ${endpoint}:`, error.message);
      break;
    }
  }

  console.warn('All user management endpoints failed. Returning empty list to prevent UI crash.');
  return [];
};

export const registerUser = async (userData: any) => {
  const response = await authApi.post<User>('/register', userData);
  return response.data;
};

export const deactivateUser = async (userId: number) => {
  const response = await authApi.put(`/deactivate/${userId}`);
  return response.data;
};

// --- Airline Management (Airline Service) ---
export const getAllAirlines = async () => {
  const response = await airlineApi.get('/airlines');
  return response.data;
};

export const createAirline = async (airlineData: any) => {
  const response = await airlineApi.post('/airlines', airlineData);
  return response.data;
};

export const updateAirline = async (airlineId: number, airlineData: any) => {
  const response = await airlineApi.put(`/airlines/${airlineId}`, airlineData);
  return response.data;
};

export const deactivateAirline = async (airlineId: number) => {
  const response = await airlineApi.put(`/airlines/${airlineId}/deactivate`);
  return response.data;
};

// --- Airport Management (Airline Service) ---
export const getAllAirports = async () => {
  const response = await airlineApi.get('/airports');
  return response.data;
};

export const createAirport = async (airportData: any) => {
  const response = await airlineApi.post('/airports', airportData);
  return response.data;
};

export const updateAirport = async (airportId: number, airportData: any) => {
  const response = await airlineApi.put(`/airports/${airportId}`, airportData);
  return response.data;
};

// --- Booking Management (Booking Service) ---
export const getAllBookings = async () => {
  const response = await bookingApi.get('/all');
  return response.data;
};

export const updateBookingStatus = async (bookingId: string, status: string) => {
  const response = await bookingApi.put(`/${bookingId}/status`, null, {
    params: { status }
  });
  return response.data;
};

// --- Flight Management (Flight Service) ---
export const getAllFlights = async () => {
  const response = await flightApi.get('');
  // Map backend entity to frontend expected interface
  return response.data.map((f: any) => ({
    ...f,
    price: f.basePrice,
    origin: f.originAirportCode,
    destination: f.destinationAirportCode
  }));
};

export const addFlight = async (flightData: any) => {
  const response = await flightApi.post('', flightData);
  return response.data;
};

export const updateFlight = async (flightId: number, flightData: any) => {
  const response = await flightApi.put(`/${flightId}`, flightData);
  return response.data;
};

export const deleteFlight = async (flightId: number) => {
  const response = await flightApi.delete(`/${flightId}`);
  return response.data;
};

export const updateFlightStatus = async (flightId: number, status: string) => {
  const response = await flightApi.put(`/${flightId}/status`, null, {
    params: { status },
  });
  return response.data;
};
