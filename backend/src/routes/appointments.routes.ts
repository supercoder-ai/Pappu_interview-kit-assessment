/**
 * This file is provided you as part of the interview kit.
 * Feel free to modify it as needed.
 * Do not remove this comment.
 */

import { Router } from "express";
import { Appointment, Clinic, Optician } from "../types/shared";
import { addNewDataToFile, getEntityById, getFileData } from "../utils";

const appointmentsRouter = Router();

const TIMESLOTS = [
  "09:00",
  "10:00",
  "11:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
];

/************************ Provided Basic CRUD Endpoints ****************************/

const getClinicIdsForOptician = (opticianId: string): string[] => {
  const clinics = getFileData("clinics") as Clinic[];
  return clinics
    .filter((clinic) => clinic.opticians.includes(opticianId))
    .map((clinic) => clinic.id);
};

const appointmentMatchesOptician = (
  appointment: Appointment,
  opticianId: string,
  clinicIdsForOptician: string[]
) =>
  appointment.optician_id === opticianId ||
  (!appointment.optician_id &&
    clinicIdsForOptician.includes(appointment.clinic_id));

// Get all appointments with optional filters
appointmentsRouter.get("/appointments", (req, res) => {
  try {
    let data = getFileData("appointments") as Appointment[];
    const { patient_id, clinic_id, optician_id, date, upcoming } = req.query as {
      patient_id?: string;
      clinic_id?: string;
      optician_id?: string;
      date?: string;
      upcoming?: string;
    };

    if (patient_id) {
      data = data.filter((appointment) => appointment.patient_id === patient_id);
    }

    if (clinic_id) {
      data = data.filter((appointment) => appointment.clinic_id === clinic_id);
    }

    if (optician_id) {
      const clinicIdsForOptician = getClinicIdsForOptician(optician_id);
      data = data.filter((appointment) =>
        appointmentMatchesOptician(appointment, optician_id, clinicIdsForOptician)
      );
    }

    if (date) {
      data = data.filter((appointment) =>
        appointment.appointment_datetime.startsWith(date)
      );
    }

    if (upcoming === "true") {
      const now = new Date();
      data = data.filter(
        (appointment) => new Date(appointment.appointment_datetime) >= now
      );
    }

    data.sort(
      (a, b) =>
        new Date(a.appointment_datetime).getTime() -
        new Date(b.appointment_datetime).getTime()
    );

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get an appointment by ID
appointmentsRouter.get("/appointment/:id", (req, res) => {
  try {
    const appointment = getEntityById<Appointment>(
      "appointments",
      req.params.id
    );
    if (appointment) {
      res.json(appointment);
    } else {
      res.status(404).json({ error: "Appointment not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Create an appointment
appointmentsRouter.post("/appointment", (req, res) => {
  const newAppointment = req.body as Appointment;
  if (
    !newAppointment.id ||
    !newAppointment.patient_id ||
    !newAppointment.clinic_id ||
    !newAppointment.service_id ||
    !newAppointment.appointment_datetime
  ) {
    return res.status(400).json({ error: "Missing required appointment fields" });
  }

  try {
    const existingAppointments = getFileData("appointments") as Appointment[];
    const slotTime = newAppointment.appointment_datetime.slice(11, 16);
    const slotDate = newAppointment.appointment_datetime.slice(0, 10);

    if (!TIMESLOTS.includes(slotTime)) {
      return res.status(400).json({
        error: "Appointment time must be one of the standard clinic timeslots",
      });
    }

    const clinicConflict = existingAppointments.some(
      (appointment) =>
        appointment.clinic_id === newAppointment.clinic_id &&
        appointment.appointment_datetime === newAppointment.appointment_datetime
    );

    if (clinicConflict) {
      return res.status(409).json({
        error: "Selected time slot is already booked for this clinic",
      });
    }

    if (newAppointment.optician_id) {
      const opticianConflict = existingAppointments.some((appointment) => {
        if (appointment.optician_id !== newAppointment.optician_id) {
          return false;
        }
        return (
          appointment.appointment_datetime.slice(0, 10) === slotDate &&
          appointment.appointment_datetime.slice(11, 16) === slotTime
        );
      });

      if (opticianConflict) {
        return res.status(409).json({
          error: "Selected optician is already booked at this time",
        });
      }
    }

    const appointmentToSave: Appointment = {
      ...newAppointment,
      notes: newAppointment.notes ?? "",
    };

    addNewDataToFile<Appointment>("appointments", appointmentToSave);
    res.status(201).json({
      message: "Appointment added successfully",
      data: appointmentToSave,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

appointmentsRouter.get("/availability", (req, res) => {
  const { clinic_id, date, service_id, optician_id } = req.query as {
    clinic_id?: string;
    date?: string;
    service_id?: string;
    optician_id?: string;
  };

  if (!clinic_id || !date) {
    return res
      .status(400)
      .json({ error: "clinic_id and date are required for availability" });
  }

  try {
    const clinics = getFileData("clinics") as Clinic[];
    const opticians = getFileData("opticians") as Optician[];
    const appointments = getFileData("appointments") as Appointment[];

    const clinic = clinics.find((item) => item.id === clinic_id);
    if (!clinic) {
      return res.status(404).json({ error: "Clinic not found" });
    }

    let availableOpticians = clinic.opticians
      .map((opticianId) => opticians.find((item) => item.id === opticianId))
      .filter(Boolean) as Optician[];

    if (service_id) {
      availableOpticians = availableOpticians.filter((optician) =>
        optician.services_id.includes(service_id)
      );
    }

    if (optician_id) {
      availableOpticians = availableOpticians.filter(
        (optician) => optician.id === optician_id
      );
    }

    const bookedAtClinic = appointments
      .filter(
        (appointment) =>
          appointment.clinic_id === clinic_id &&
          appointment.appointment_datetime.startsWith(date)
      )
      .map((appointment) => appointment.appointment_datetime.slice(11, 16));

    const bookedByOptician =
      optician_id &&
      appointments
        .filter(
          (appointment) =>
            appointment.optician_id === optician_id &&
            appointment.appointment_datetime.startsWith(date)
        )
        .map((appointment) => appointment.appointment_datetime.slice(11, 16));

    const unavailableSlots = new Set([
      ...bookedAtClinic,
      ...(bookedByOptician ?? []),
    ]);

    const availableTimeslots = TIMESLOTS.filter(
      (slot) => !unavailableSlots.has(slot)
    );

    res.json({
      clinic_id,
      date,
      available_timeslots: availableTimeslots,
      opticians: availableOpticians.map((optician) => ({
        id: optician.id,
        name: optician.name,
      })),
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

/******************* You may add additional endpoints ****************************/

export default appointmentsRouter;
