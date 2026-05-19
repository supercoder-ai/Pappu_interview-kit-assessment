import { Modal, Table, Button } from "antd";
import type { FC } from "react";
import { useMemo, useState } from "react";
import type { ColumnsType } from "antd/es/table";
import type { Appointment, User } from "../../types/shared";
import { ProfilePicDescription } from "../organisms/ProfilePicDescription";
import { formatAppointmentDateTime, parseAppointmentDatetime } from "../../utils/time";

interface PatientInfoModalProps {
  open: boolean;
  onClose: () => void;
  patient: User | null;
  appointments: Appointment[];
}

export const PatientInfoModal: FC<PatientInfoModalProps> = ({
  open,
  onClose,
  patient,
  appointments,
}) => {
  const [historyPage, setHistoryPage] = useState({ current: 1, pageSize: 3 });

  const sortedAppointments = useMemo(
    () =>
      [...appointments].sort(
        (a, b) =>
          parseAppointmentDatetime(b.appointment_datetime).getTime() -
          parseAppointmentDatetime(a.appointment_datetime).getTime()
      ),
    [appointments]
  );

  if (!patient) return null;

  const columns: ColumnsType<Appointment> = [
    {
      title: "Appointment Time",
      dataIndex: "appointment_datetime",
      key: "appointment_datetime",
      render: (datetime: string) => formatAppointmentDateTime(datetime),
    },
    {
      title: "Clinic",
      dataIndex: "clinic_name",
      key: "clinic_name",
    },
    {
      title: "Service",
      dataIndex: "service_name",
      key: "service_name",
    },
    {
      title: "Notes",
      dataIndex: "notes",
      key: "notes",
      render: (notes: string) => notes || "",
    },
  ];

  return (
    <Modal
      title={<span className="text-base font-semibold">Patient Information</span>}
      open={open}
      onCancel={onClose}
      width={720}
      afterOpenChange={(visible) => {
        if (visible) setHistoryPage({ current: 1, pageSize: 3 });
      }}
      footer={
        <div className="flex justify-end gap-2">
          <Button onClick={onClose}>Cancel</Button>
          <Button type="primary" onClick={onClose}>
            OK
          </Button>
        </div>
      }
    >
      <ProfilePicDescription user={patient} />

      <h4 className="mb-3 text-base font-bold text-gray-900">Appointment History</h4>
      <Table
        dataSource={sortedAppointments}
        columns={columns}
        pagination={{
          current: historyPage.current,
          pageSize: historyPage.pageSize,
          showSizeChanger: false,
          onChange: (page) => setHistoryPage((prev) => ({ ...prev, current: page })),
        }}
        rowKey={(record) =>
          `${record.id ?? record.appointment_datetime}-${record.patient_id}`
        }
        size="middle"
        className="patient-history-table"
      />
    </Modal>
  );
};
