import axios from 'axios';
import { GATEWAY_URL, API_PASSENGERS } from './apiConfig';

export enum PassengerType {
  ADULT = 'ADULT',
  CHILD = 'CHILD',
  INFANT = 'INFANT'
}

export interface PassengerInfo {
  passengerId?: number;
  bookingId: string;
  title: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string; // ISO date string
  gender: string;
  passportNumber: string;
  nationality: string;
  passportExpiry?: string; // ISO date string
  seatId?: number;
  seatNumber?: string;
  ticketNumber?: string;
  passengerType: PassengerType;
}

export const passengerApi = {
  addPassenger: async (passengerInfo: PassengerInfo) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${GATEWAY_URL}${API_PASSENGERS}`, passengerInfo, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to add passenger', error);
      throw error;
    }
  },

  getPassengersByBooking: async (bookingId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${GATEWAY_URL}${API_PASSENGERS}/booking/${bookingId}`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch passengers for booking', error);
      throw error;
    }
  },

  updatePassenger: async (passengerId: number, passengerInfo: PassengerInfo) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`${GATEWAY_URL}${API_PASSENGERS}/${passengerId}`, passengerInfo, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to update passenger', error);
      throw error;
    }
  },

  assignSeat: async (passengerId: number, seatId: number, seatNumber: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`${GATEWAY_URL}${API_PASSENGERS}/${passengerId}/assign-seat`, {
        seatId: seatId.toString(),
        seatNumber
      }, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to assign seat to passenger', error);
      throw error;
    }
  }
};
