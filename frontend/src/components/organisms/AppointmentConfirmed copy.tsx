/**
 * This file is provided you as part of the interview kit.
 * Feel free to modify it as needed.
 * Do not remove this comment.
 */

import { CheckCircleFilled } from "@ant-design/icons";
import { Button, Modal, Card, Descriptions, Result } from "antd";
import type { FC } from "react";
import { BookingDetails } from "../../types";

const SUMMARY_ROWS: { key: keyof BookingDetails | "emailConfirmation"; label: string }[] = [
  { key: "service", label: "Service" },
  { key: "clinic", label: "Clinic" },
  { key: "optician", label: "Optician" },
  { key: "date", label: "Date" },
  { key: "time", label: "Time" },
  { key: "notes", label: "Remarks" },
  { key: "emailConfirmation", label: "Email Confirmation" },
];

const getSummaryValue = (details: BookingDetails, key: string): string => {
  if (key === "notes") {
    return details.notes?.trim() ? details.notes : "—";
  }
  return String(details[key as keyof BookingDetails] ?? "");
};

const BookingSummaryContent: FC<{
  bookingDetails: BookingDetails;
  onBackHome: () => void;
}> = ({ bookingDetails, onBackHome }) => (
  <div className="rounded-lg border border-gray-200 bg-white p-8">
    <div className="mb-8 text-center">
      <CheckCircleFilled className="!text-[72px] !text-[#52c41a]" />
      <h2 className="mt-4 text-xl font-bold text-gray-900">
        Appointment Booked Successfully!
      </h2>
      <p className="mx-auto mt-2 max-w-sm text-sm text-gray-500">
        Your appointment has been confirmed. You will receive an email
        confirmation shortly.
      </p>
    </div>

    <h3 className="mb-4 text-center text-base font-bold text-gray-900">
      Booking Summary
    </h3>

    <table className="w-full border-collapse overflow-hidden rounded border border-gray-200 text-sm">
      <tbody>
        {SUMMARY_ROWS.map((row, index) => (
          <tr
            key={row.key}
            className={
              index < SUMMARY_ROWS.length - 1 ? "border-b border-gray-200" : ""
            }
          >
            <td className="w-1/2 border border-gray-200 bg-white px-4 py-3 text-left text-gray-500">
              {row.label}
            </td>
            <td className="w-1/2 bg-white px-4 py-3 text-center font-medium text-gray-900">
              {getSummaryValue(bookingDetails, row.key)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>

    <div className="mt-8 flex justify-center">
      <Button type="primary" size="large" onClick={onBackHome} className="min-w-[280px]">
        Back to Home
      </Button>
    </div>
  </div>
);

type AppointmentConfirmedProps = {
  bookingDetails: BookingDetails;
  onClickCallback?: () => void;
};

export const AppointmentConfirmed: FC<AppointmentConfirmedProps> = ({
  bookingDetails,
  onClickCallback,
}) => {
  return (
    <BookingSummaryContent
      bookingDetails={bookingDetails}
      onBackHome={onClickCallback ?? (() => undefined)}
    />
  );
};

type AppointmentConfirmedModalProps = {
  open: boolean;
  bookingDetails: BookingDetails | null;
  onClose: () => void;
};

export const AppointmentConfirmedModal: FC<AppointmentConfirmedModalProps> = ({
  open,
  bookingDetails,
  onClose,
}) => {
  if (!bookingDetails) return null;

  return (
    <Modal
      title={<span className="font-semibold">Appointment Confirmed</span>}
      open={open}
      onCancel={onClose}
      footer={null}
      width={560}
      centered
      destroyOnClose
      maskClosable={false}
    >
      <BookingSummaryContent bookingDetails={bookingDetails} onBackHome={onClose} />
    </Modal>
  );
};
