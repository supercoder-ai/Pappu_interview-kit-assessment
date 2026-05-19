/**
 * This file is provided you as part of the interview kit.
 * Feel free to modify it as needed.
 * Do not remove this comment.
 */

import axios from "axios";
import { CatalogueRow } from "../types/index.ts";
import type {
  Appointment,
  Clinic,
  Optician,
  Service,
  User,
} from "../types/shared.ts";
import { getConfig } from "./configService.ts";

/**
 * Below are some of the service functions to call backend APIs.
 * You can add more service functions as needed.
 * Each function handles API calls for different entities like Appointments, Clinics, Services, Opticians, and Users.
 * Make sure to handle errors appropriately in a real-world application.
 * You can also modify the provided functions based on your application's requirements.
 */

/************************ Fetch Appointment APIs ************************/

export const fetchAppointmentsAPI = async (params?: {
  patient_id?: string;
  clinic_id?: string;
  optician_id?: string;
  date?: string;
  upcoming?: boolean;
}) => {
  const { backendURL } = getConfig();
  try {
    const response = await axios.get<Appointment[]>(`${backendURL}/appointments`, {
      params: {
        ...params,
        upcoming: params?.upcoming ? "true" : undefined,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/************************ Fetch Clinic APIs *************************/

export const fetchClinicsAPI = async () => {
  const { backendURL } = getConfig();
  try {
    const response = await axios.get<Clinic[]>(`${backendURL}/clinics`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/************************ Fetch Services APIs ************************/

export const fetchServicesAPI = async () => {
  const { backendURL } = getConfig();
  try {
    const response = await axios.get<Service[]>(`${backendURL}/services`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/************************ Auth APIs ************************/

export const loginAPI = async (email: string, password: string) => {
  const { backendURL } = getConfig();
  try {
    const response = await axios.post<User>(`${backendURL}/login`, {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/************************ Fetch Catalogue Table APIs ************************/

export const fetchCatalogueTableAPI = async (query?: {
  q?: string;
  service_id?: string;
  clinic_id?: string;
  optician_id?: string;
}) => {
  const { backendURL } = getConfig();
  try {
    const response = await axios.get<CatalogueRow[]>(`${backendURL}/catalogue-table`, {
      params: query,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchAvailabilityAPI = async (params: {
  clinic_id: string;
  date: string;
  service_id?: string;
  optician_id?: string;
}) => {
  const { backendURL } = getConfig();
  try {
    const response = await axios.get(`${backendURL}/availability`, {
      params,
    });
    return response.data as {
      clinic_id: string;
      date: string;
      available_timeslots: string[];
      opticians: { id: string; name: string }[];
    };
  } catch (error) {
    throw error;
  }
};

export const createAppointmentAPI = async (payload: {
  id: string;
  patient_id: string;
  clinic_id: string;
  service_id: string;
  optician_id?: string;
  appointment_datetime: string;
  notes: string;
}) => {
  const { backendURL } = getConfig();
  try {
    const response = await axios.post(`${backendURL}/appointment`, payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/************************ Fetch Optician APIs ************************/

export const fetchOpticiansAPI = async () => {
  const { backendURL } = getConfig();
  try {
    const response = await axios.get<Optician[]>(`${backendURL}/opticians`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/************************ Fetch User APIs ***************************/

export const fetchUsersAPI = async () => {
  const { backendURL } = getConfig();
  try {
    const response = await axios.get<User[]>(`${backendURL}/users`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
