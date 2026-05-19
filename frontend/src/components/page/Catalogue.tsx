/**
 * This file is provided you as part of the interview kit.
 * Feel free to modify it as needed.
 * Do not remove this comment.
 */

import { useCallback, useEffect, useState } from "react";
import type { FC } from "react";
import { Card, Col, Row } from "antd";
import { useNavigate } from "react-router-dom";
import { ServiceTable } from "../organisms/ServiceTable";
import { AvailabilityModal } from "../molecules/AvailabilityModal";
import { Search } from "../molecules/Search";
import { Dropdown } from "../molecules/Dropdown";
import {
  fetchCatalogueTableAPI,
  fetchClinicsAPI,
  fetchOpticiansAPI,
  fetchServicesAPI,
} from "../../services";
import type { BookingSelection, CatalogueRow } from "../../types";
import { useAuth } from "../../context/AuthContext.tsx";

const Catalogue: FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [catalogueContent, setCatalogueContent] = useState<CatalogueRow[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [serviceFilter, setServiceFilter] = useState<string>();
  const [clinicFilter, setClinicFilter] = useState<string>();
  const [opticianFilter, setOpticianFilter] = useState<string>();

  const [serviceOptions, setServiceOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [clinicOptions, setClinicOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [opticianOptions, setOpticianOptions] = useState<
    { label: string; value: string }[]
  >([]);

  const [availabilityRow, setAvailabilityRow] = useState<CatalogueRow | null>(
    null
  );
  const [availabilityOpen, setAvailabilityOpen] = useState(false);

  const loadCatalogue = useCallback(async () => {
    try {
      const data = await fetchCatalogueTableAPI({
        q: searchQuery || undefined,
        service_id: serviceFilter,
        clinic_id: clinicFilter,
        optician_id: opticianFilter,
      });
      setCatalogueContent(data);
    } catch (error) {
      console.error(`Error fetching catalogue: ${error}`);
    }
  }, [searchQuery, serviceFilter, clinicFilter, opticianFilter]);

  useEffect(() => {
    const loadFilters = async () => {
      try {
        const [services, clinics, opticians] = await Promise.all([
          fetchServicesAPI(),
          fetchClinicsAPI(),
          fetchOpticiansAPI(),
        ]);
        setServiceOptions(
          services.map((s) => ({ label: s.name, value: s.id }))
        );
        setClinicOptions(clinics.map((c) => ({ label: c.name, value: c.id })));
        setOpticianOptions(
          opticians.map((o) => ({ label: o.name, value: o.id }))
        );
      } catch (error) {
        console.error(error);
      }
    };
    loadFilters();
  }, []);

  useEffect(() => {
    if (user?.role === "patient") {
      loadCatalogue();
    }
  }, [user, loadCatalogue]);

  if (user?.role === "optician") {
    return (
      <div className="p-5">
        <Card>
          <p>Catalogue is only available for patients.</p>
        </Card>
      </div>
    );
  }

  const handleCheckAvailability = (row: CatalogueRow) => {
    setAvailabilityRow(row);
    setAvailabilityOpen(true);
  };

  const handleProceed = (selection: BookingSelection) => {
    setAvailabilityOpen(false);
    navigate("/confirm-appointment", { state: selection });
  };

  return (
    <div className="p-4">
      <Card className="mb-4">
        <div className="space-y-4">
          <Search onSearch={setSearchQuery} />
          <Row gutter={16}>
            <Col xs={24} md={8}>
              <Dropdown
                placeholder="Select Services"
                options={serviceOptions}
                onChange={(value) => setServiceFilter(value || undefined)}
              />
            </Col>
            <Col xs={24} md={8}>
              <Dropdown
                placeholder="Select Clinics"
                options={clinicOptions}
                onChange={(value) => setClinicFilter(value || undefined)}
              />
            </Col>
            <Col xs={24} md={8}>
              <Dropdown
                placeholder="Select Opticians"
                options={opticianOptions}
                onChange={(value) => setOpticianFilter(value || undefined)}
              />
            </Col>
          </Row>
        </div>
      </Card>

      <Card>
        <ServiceTable
          dataSource={catalogueContent}
          onCheckAvailability={handleCheckAvailability}
          pagination={{ defaultPageSize: 10, showSizeChanger: true }}
        />
      </Card>

      <AvailabilityModal
        open={availabilityOpen}
        onClose={() => setAvailabilityOpen(false)}
        row={availabilityRow}
        onProceed={handleProceed}
      />
    </div>
  );
};

export default Catalogue;
