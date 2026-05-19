/**
 * This component is provided you as part of the interview kit.
 * Feel free to modify it as needed.
 * Do not remove this comment.
 */

import { Table, Button } from "antd";
import type { TablePaginationConfig } from "antd";
import type { FC } from "react";
import type { ColumnsType } from "antd/es/table";
import { Appointment } from "../../types/shared.ts";
import { formatAppointmentDateTime } from "../../utils/time";

interface AppointmentTableProps {
  dataSource: Appointment[];
  pagination?: false | TablePaginationConfig;
  showRowNumber?: boolean;
  onViewPatient?: (appointment: Appointment) => void;
}

export const AppointmentTable: FC<AppointmentTableProps> = ({
  dataSource,
  pagination = { pageSize: 10 },
  showRowNumber = false,
  onViewPatient,
}) => {
  const columns: ColumnsType<Appointment> = [
    ...(showRowNumber
      ? [
          {
            title: "No.",
            key: "index",
            width: 60,
            render: (_: unknown, __: Appointment, index: number) => index + 1,
          },
        ]
      : []),
    {
      title: "Appointment Time",
      dataIndex: "appointment_datetime",
      key: "appointment_datetime",
      width: 180,
      render: (datetime: string) =>
        datetime ? formatAppointmentDateTime(datetime) : "-",
    },
    {
      title: "Clinic",
      dataIndex: "clinic_name",
      key: "clinic_name",
      width: 200,
    },
    {
      title: "Service",
      dataIndex: "service_name",
      key: "service_name",
      width: 160,
    },
    {
      title: "Notes",
      dataIndex: "notes",
      key: "notes",
      width: 150,
    },
    ...(onViewPatient
      ? [
          {
            title: "Patient",
            dataIndex: "patient_name",
            key: "patient_name",
            width: 150,
            render: (name: string, record: Appointment) => (
              <Button type="link" className="!p-0" onClick={() => onViewPatient(record)}>
                {name}
              </Button>
            ),
          },
        ]
      : []),
  ];

  return (
    <Table
      dataSource={dataSource}
      columns={columns}
      pagination={pagination === false ? false : pagination}
      rowKey={(record: Appointment) =>
        `${record.id ?? record.appointment_datetime}-${record.patient_id}`
      }
      scroll={{ x: 900 }}
    />
  );
};
