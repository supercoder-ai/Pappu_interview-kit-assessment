import { Button, Card, Form, Input, message, Table } from "antd";
import type { FC } from "react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { createAppointmentAPI } from "../../services";
import { useAuth } from "../../context/AuthContext";
import type { BookingDetails, BookingSelection } from "../../types";
import { AppointmentConfirmedModal } from "../organisms/AppointmentConfirmed";
import {
  buildAppointmentDatetime,
  formatDateLong,
  formatTimeslot24ToDisplay,
} from "../../utils/time";

const ConfirmAppointment: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const selection = location.state as BookingSelection | null;

  const [remarks, setRemarks] = useState("");
  const [isBooking, setIsBooking] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(
    null
  );

  if (!selection || user?.role !== "patient") {
    return (
      <div className="p-6">
        <Card>
          <p className="mb-4">No appointment details to confirm.</p>
          <Button type="primary" onClick={() => navigate("/catalogue")}>
            Back to Catalogue
          </Button>
        </Card>
      </div>
    );
  }

  const { row, date, time } = selection;
  const optician = row.clinic.opticians[0];

  const bookingRows = [
    { key: "date", label: "Selected Date", value: formatDateLong(date) },
    {
      key: "time",
      label: "Selected Time",
      value: formatTimeslot24ToDisplay(time),
    },
  ];

  const handleBook = async () => {
    if (!user || !optician) return;

    const payload = {
      id: crypto.randomUUID(),
      patient_id: user.id,
      clinic_id: row.clinic.id,
      service_id: row.service.id,
      optician_id: optician.id,
      appointment_datetime: buildAppointmentDatetime(date, time),
      notes: remarks,
    };

    try {
      setIsBooking(true);
      await createAppointmentAPI(payload);
      setBookingDetails({
        service: row.service.name,
        clinic: row.clinic.name,
        optician: optician.name,
        date: formatDateLong(date),
        time: formatTimeslot24ToDisplay(time),
        notes: remarks,
        emailConfirmation: user.email,
      });
      setConfirmed(true);
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string } } };
      message.error(err?.response?.data?.error || "Failed to book appointment");
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <div className="flex justify-center p-6">
      <Card className="w-full max-w-xl shadow-md">
        <h2 className="mb-6 text-center text-2xl font-bold">
          Confirm Your Appointment
        </h2>

        <Form layout="vertical">
          <Form.Item label="Service">
            <Input value={row.service.name} disabled />
          </Form.Item>
          <Form.Item label="Clinic">
            <Input value={row.clinic.name} disabled />
          </Form.Item>
          <Form.Item label="Optician">
            <span className="text-gray-600">{optician?.name ?? ""}</span>
          </Form.Item>

          <Form.Item label="Booking Information">
            <Table
              dataSource={bookingRows}
              columns={[
                { dataIndex: "label", key: "label", width: "40%" },
                { dataIndex: "value", key: "value" },
              ]}
              pagination={false}
              showHeader={false}
              bordered
              size="small"
              rowKey="key"
            />
          </Form.Item>

          <Form.Item label="Remarks">
            <Input.TextArea
              rows={3}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Optional remarks"
            />
          </Form.Item>

          <Button
            type="primary"
            block
            size="large"
            loading={isBooking}
            onClick={handleBook}
          >
            Book Appointment
          </Button>
        </Form>
      </Card>

      <AppointmentConfirmedModal
        open={confirmed}
        bookingDetails={bookingDetails}
        onClose={() => navigate("/home")}
      />
    </div>
  );
};

export default ConfirmAppointment;
