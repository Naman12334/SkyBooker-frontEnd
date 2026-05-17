import axios from 'axios';
import { GATEWAY_URL, API_BOOKINGS } from './apiConfig';

export interface BookingRequest {
  userId: number;
  flightId: number;
  contactEmail: string;
  contactPhone: string;
  baseFare: number;
  taxes: number;
  totalFare: number;
  tripType: string;
  passengerIds: number[];
  seats?: string[]; // Frontend specific for now if backend doesn't take it yet
}

export const bookingApi = {
  createBooking: async (data: BookingRequest) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${GATEWAY_URL}${API_BOOKINGS}`, data, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to create booking', error);
      throw error;
    }
  },
  updateBookingStatus: async (bookingId: string, status: string, seatNumber?: string) => {
    try {
      const token = localStorage.getItem('token');
      let url = `${GATEWAY_URL}${API_BOOKINGS}/${bookingId}/status?status=${status}`;
      if (seatNumber) {
        url += `&seatNumber=${seatNumber}`;
      }
      const response = await axios.put(url, {}, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to update booking status', error);
      throw error;
    }
  },
  getBookingsByFlight: async (flightId: number) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${GATEWAY_URL}${API_BOOKINGS}/flight/${flightId}`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch bookings for flight', error);
      throw error;
    }
  },
  sendNotification: async (bookingId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${GATEWAY_URL}${API_BOOKINGS}/${bookingId}/send-notification`, {}, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to send notification', error);
      throw error;
    }
  }
};
