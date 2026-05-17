import axios from 'axios';
import { GATEWAY_URL, API_SEATS } from './apiConfig';

export enum SeatStatus {
  AVAILABLE = 'AVAILABLE',
  HELD = 'HELD',
  CONFIRMED = 'CONFIRMED',
  BLOCKED = 'BLOCKED'
}

export enum SeatClass {
  ECONOMY = 'ECONOMY',
  PREMIUM_ECONOMY = 'PREMIUM_ECONOMY',
  BUSINESS = 'BUSINESS',
  FIRST_CLASS = 'FIRST_CLASS'
}

export interface Seat {
  seatId: number;
  flightId: number;
  seatNumber: string;
  seatClass: SeatClass;
  row: number;
  column: string;
  status: SeatStatus;
  priceMultiplier: number;
  version: number;
  holdExpiresAt?: string;
  heldByUserId?: number;
}

export const seatApi = {
  getSeatMap: async (flightId: number): Promise<Seat[]> => {
    const response = await axios.get(`${GATEWAY_URL}${API_SEATS}/map/${flightId}`);
    return response.data;
  },

  getAvailableSeats: async (flightId: number): Promise<Seat[]> => {
    const response = await axios.get(`${GATEWAY_URL}${API_SEATS}/available/${flightId}`);
    return response.data;
  },

  holdSeat: async (seatId: number, userId: number): Promise<string> => {
    const token = localStorage.getItem('token');
    const response = await axios.put(
      `${GATEWAY_URL}${API_SEATS}/hold/${seatId}?userId=${userId}`,
      {},
      {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      }
    );
    return response.data;
  },

  releaseSeat: async (seatId: number): Promise<string> => {
    const token = localStorage.getItem('token');
    const response = await axios.put(
      `${GATEWAY_URL}${API_SEATS}/release/${seatId}`,
      {},
      {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      }
    );
    return response.data;
  },

  confirmSeat: async (seatId: number): Promise<string> => {
    const token = localStorage.getItem('token');
    const response = await axios.put(
      `${GATEWAY_URL}${API_SEATS}/confirm/${seatId}`,
      {},
      {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      }
    );
    return response.data;
  }
};
