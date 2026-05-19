/**
 * This file is provided you as part of the interview kit.
 * Feel free to modify it as needed.
 * Do not remove this comment.
 */

import { useEffect, useMemo, useState } from "react";
import type { FC } from "react";
import { Card } from "antd";
import { AppointmentTable } from "../organisms/AppointmentTable";
import { PatientInfoModal } from "../molecules/PatientInfoModal";
import {
  fetchAppointmentsAPI,
  fetchClinicsAPI,
  fetchServicesAPI,
  fetchUsersAPI,
} from "../../services";
import { useAuth } from "../../context/AuthContext.tsx";
import type { Appointment, Clinic, Service, User } from "../../types/shared";

const Home: FC = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  const [selectedPatient, setSelectedPatient] = useState<User | null>(null);
  const [patientAppointments, setPatientAppointments] = useState<Appointment[]>(
    []
  );
  const [patientModalOpen, setPatientModalOpen] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      if (!user) return;

      try {
        const filters =
          user.role === "patient"
            ? { patient_id: user.id, upcoming: true }
            : user.optician_id
            ? { optician_id: user.optician_id, upcoming: true }
            : { upcoming: true };

        const [appointmentsData, clinicsData, servicesData, usersData] =
          await Promise.all([
            fetchAppointmentsAPI(filters),
            fetchClinicsAPI(),
            fetchServicesAPI(),
            fetchUsersAPI(),
          ]);

        setAppointments(appointmentsData);
        setClinics(clinicsData);
        setServices(servicesData);
        setUsers(usersData);
      } catch (error) {
        console.error(error);
      }
    };

    loadData();
  }, [user]);

  const enrichAppointments = (list: Appointment[]) =>
    list.map((appointment) => {
      const clinic = clinics.find((item) => item.id === appointment.clinic_id);
      const service = services.find((item) => item.id === appointment.service_id);
      const patient = users.find((item) => item.id === appointment.patient_id);

      return {
        ...appointment,
        clinic_name: clinic?.name ?? "Unknown clinic",
        service_name: service?.name ?? "Unknown service",
        patient_name: patient
          ? `${patient.first_name} ${patient.last_name}`
          : "Unknown patient",
      };
    });

  const appointmentsWithDetails = useMemo(
    () => enrichAppointments(appointments),
    [appointments, clinics, services, users]
  );

  const handleViewPatient = async (appointment: Appointment) => {
    const patient = users.find((u) => u.id === appointment.patient_id);
    if (!patient) return;

    try {
      const history = await fetchAppointmentsAPI({ patient_id: patient.id });
      setSelectedPatient(patient);
      setPatientAppointments(enrichAppointments(history));
      setPatientModalOpen(true);
    } catch (error) {
      console.error(error);
    }
  };

  const pageTitle =
    user?.role === "optician"
      ? `${user.first_name}'s Upcoming Appointment`
      : "Upcoming Appointments";

  return (
    <div className="p-4">
      <h2 className="mb-4 text-2xl font-bold">{pageTitle}</h2>

      <Card>
        <AppointmentTable
          dataSource={appointmentsWithDetails}
          showRowNumber={user?.role === "optician"}
          onViewPatient={
            user?.role === "optician" ? handleViewPatient : undefined
          }
        />
      </Card>

      <PatientInfoModal
        open={patientModalOpen}
        onClose={() => setPatientModalOpen(false)}
        patient={selectedPatient}
        appointments={patientAppointments}
      />
    </div>
  );
};

export default Home;
