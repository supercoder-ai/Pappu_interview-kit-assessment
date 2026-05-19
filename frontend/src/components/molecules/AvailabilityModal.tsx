import { Modal, Calendar, Button, Spin } from "antd";
import type { FC } from "react";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import type { Dayjs } from "dayjs";
import type { BookingSelection, CatalogueRow } from "../../types";
import { fetchAvailabilityAPI } from "../../services";
import { formatTimeslot24ToDisplay } from "../../utils/time";

interface AvailabilityModalProps {
  open: boolean;
  onClose: () => void;
  row: CatalogueRow | null;
  onProceed: (selection: BookingSelection) => void;
}

export const AvailabilityModal: FC<AvailabilityModalProps> = ({
  open,
  onClose,
  row,
  onProceed,
}) => {
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const dateStr = selectedDate.format("YYYY-MM-DD");

  useEffect(() => {
    if (!open || !row) return;
    setSelectedDate(dayjs());
    setSelectedTime("");
  }, [open, row]);

  useEffect(() => {
    if (!open || !row) return;

    const loadAvailability = async () => {
      try {
        setLoading(true);
        const response = await fetchAvailabilityAPI({
          clinic_id: row.clinic.id,
          date: dateStr,
          service_id: row.service.id,
          optician_id: row.clinic.opticians[0]?.id,
        });
        setAvailableSlots(response.available_timeslots);
        setSelectedTime("");
      } catch (error) {
        console.error(error);
        setAvailableSlots([]);
      } finally {
        setLoading(false);
      }
    };

    loadAvailability();
  }, [open, row, dateStr]);

  const handleProceed = () => {
    if (!row || !selectedTime) return;
    onProceed({ row, date: dateStr, time: selectedTime });
  };

  const slotButtonClass = (slot: string) => {
    const isSelected = selectedTime === slot;
    return isSelected
      ? "!bg-[#52c41a] !border-[#52c41a] !text-white hover:!bg-[#49b017] hover:!border-[#49b017]"
      : "!bg-[#1890ff] !border-[#1890ff] !text-white hover:!bg-[#40a9ff] hover:!border-[#40a9ff]";
  };

  return (
    <Modal
      title="Available Slots"
      open={open}
      onCancel={onClose}
      width={720}
      footer={null}
      destroyOnClose
      className="availability-modal"
    >
      {row && (
        <Spin spinning={loading}>
          <div className="space-y-5">
            <div className="space-y-1 text-sm text-gray-800">
              <p>
                <span className="font-semibold">Service:</span> {row.service.name}
              </p>
              <p>
                <span className="font-semibold">Clinic:</span> {row.clinic.name}
              </p>
              <p>
                <span className="font-semibold">Optician:</span>{" "}
                {row.clinic.opticians[0]?.name}
              </p>
            </div>

            <Calendar
              value={selectedDate}
              onChange={(date) => date && setSelectedDate(date)}
              disabledDate={(current) =>
                !current || current.isBefore(dayjs(), "day")
              }
              fullscreen={false}
            />

            <div>
              <p className="mb-3 text-sm font-semibold text-gray-900">
                Available Timeslots for {dateStr}
              </p>
              {availableSlots.length > 0 ? (
                <div className="grid grid-cols-4 gap-2">
                  {availableSlots.map((slot) => (
                    <Button
                      key={slot}
                      type="default"
                      className={slotButtonClass(slot)}
                      onClick={() => setSelectedTime(slot)}
                    >
                      {formatTimeslot24ToDisplay(slot)}
                    </Button>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">
                  No available slots for this date
                </p>
              )}
            </div>

            <div className="flex items-center justify-between border-t border-gray-200 pt-4">
              <div className="space-y-1 text-sm">
                <p>
                  <span className="font-semibold">Selected Date:</span> {dateStr}
                </p>
                <p>
                  <span className="font-semibold">Selected Time:</span>{" "}
                  {selectedTime
                    ? formatTimeslot24ToDisplay(selectedTime)
                    : "—"}
                </p>
              </div>
              <Button onClick={handleProceed} disabled={!selectedTime}>
                Proceed
              </Button>
            </div>
          </div>
        </Spin>
      )}
    </Modal>
  );
};
