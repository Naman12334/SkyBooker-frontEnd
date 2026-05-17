import axios from 'axios';
import { GATEWAY_URL, API_FLIGHTS } from './apiConfig';

export interface Flight {
  id: number;
  flightNumber: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  price: number;
  availableSeats: number;
  airline: {
    id: number;
    name: string;
    logoUrl?: string;
  };
}

export interface BackendFlight {
  flightId: number;
  flightNumber: string;
  airlineId: number;
  originAirportCode: string;
  destinationAirportCode: string;
  departureTime: string;
  arrivalTime: string;
  durationMinutes: number;
  status: string;
  aircraftType: string;
  totalSeats: number;
  availableSeats: number;
  basePrice: number;
}

export const flightApi = {
  searchFlights: async (origin: string, destination: string, date: string, passengers: number = 1) => {
    // 1. Fetch airlines to map airlineId -> Airline
    let airlinesMap: Record<number, any> = {};
    try {
      const airResp = await axios.get(`${GATEWAY_URL}/api/airline/airlines`);
      airResp.data.forEach((a: any) => {
        airlinesMap[a.airlineId] = a;
      });
    } catch (err) {
      console.warn('Failed to fetch airlines, using fallbacks');
    }

    const response = await axios.get<BackendFlight[]>(`${GATEWAY_URL}${API_FLIGHTS}/search`, {
      params: {
        origin,
        destination,
        date,
        passengers
      }
    });
    
    return response.data.map((bf): Flight => {
      const airline = airlinesMap[bf.airlineId] || { name: 'Unknown Airline', logoUrl: '' };
      return {
        id: bf.flightId,
        flightNumber: bf.flightNumber,
        origin: bf.originAirportCode,
        destination: bf.destinationAirportCode,
        departureTime: bf.departureTime,
        arrivalTime: bf.arrivalTime,
        price: bf.basePrice,
        availableSeats: bf.availableSeats,
        airline: {
          id: bf.airlineId,
          name: airline.name,
          logoUrl: airline.logoUrl
        }
      };
    });
  },

  getAvailableFlights: async () => {
    let airlinesMap: Record<number, any> = {};
    try {
      const airResp = await axios.get(`${GATEWAY_URL}/api/airline/airlines`);
      airResp.data.forEach((a: any) => { airlinesMap[a.airlineId] = a; });
    } catch (err) {}

    const response = await axios.get<BackendFlight[]>(`${GATEWAY_URL}${API_FLIGHTS}/available`);
    return response.data.map((bf): Flight => {
      const airline = airlinesMap[bf.airlineId] || { name: 'Unknown Airline', logoUrl: '' };
      return {
        id: bf.flightId,
        flightNumber: bf.flightNumber,
        origin: bf.originAirportCode,
        destination: bf.destinationAirportCode,
        departureTime: bf.departureTime,
        arrivalTime: bf.arrivalTime,
        price: bf.basePrice,
        availableSeats: bf.availableSeats,
        airline: {
          id: bf.airlineId,
          name: airline.name,
          logoUrl: airline.logoUrl
        }
      };
    });
  },

  getFlightById: async (id: number) => {
    const response = await axios.get<BackendFlight>(`${GATEWAY_URL}${API_FLIGHTS}/${id}`);
    const bf = response.data;
    return {
      id: bf.flightId,
      flightNumber: bf.flightNumber,
      origin: bf.originAirportCode,
      destination: bf.destinationAirportCode,
      departureTime: bf.departureTime,
      arrivalTime: bf.arrivalTime,
      price: bf.basePrice,
      availableSeats: bf.availableSeats,
      airline: {
        id: bf.airlineId,
        name: 'Airline',
      }
    } as Flight;
  }
};
