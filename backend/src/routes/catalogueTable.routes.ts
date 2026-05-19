/**
 * This file is provided you as part of the interview kit.
 * Feel free to modify it as needed.
 * Do not remove this comment.
 */

import { Router } from "express";
import { CatalogueRow, Clinic, Optician, Service } from "../types/shared";
import { getFileData } from "../utils";

const catalogueTableRouter = Router();

catalogueTableRouter.get("/catalogue-table", (req, res) => {
  try {
    const q = (req.query.q as string | undefined)?.toLowerCase() || "";
    const serviceFilter = req.query.service_id as string | undefined;
    const clinicFilter = req.query.clinic_id as string | undefined;
    const opticianFilter = req.query.optician_id as string | undefined;

    const services = getFileData("services") as Service[];
    const clinics = getFileData("clinics") as Clinic[];
    const opticians = getFileData("opticians") as Optician[];

    let data: CatalogueRow[] = [];

    services.forEach((service) => {
      clinics.forEach((clinic) => {
        const clinicOpticians = clinic.opticians
          .map((opticianId) =>
            opticians.find((optician) => optician.id === opticianId)
          )
          .filter(Boolean) as Optician[];

        clinicOpticians
          .filter((optician) => optician.services_id.includes(service.id))
          .forEach((optician) => {
            const row: CatalogueRow = {
              service: {
                id: service.id,
                name: service.name,
              },
              clinic: {
                id: clinic.id,
                name: clinic.name,
                opticians: [
                  {
                    id: optician.id,
                    name: optician.name,
                  },
                ],
              },
            };

            data.push(row);
          });
      });
    });

    if (serviceFilter) {
      data = data.filter((row) => row.service.id === serviceFilter);
    }

    if (clinicFilter) {
      data = data.filter((row) => row.clinic.id === clinicFilter);
    }

    if (opticianFilter) {
      data = data.filter((row) =>
        row.clinic.opticians.some((optician) => optician.id === opticianFilter)
      );
    }

    if (q) {
      data = data.filter(
        (row) =>
          row.service.name.toLowerCase().includes(q) ||
          row.clinic.name.toLowerCase().includes(q) ||
          row.clinic.opticians.some((optician) =>
            optician.name.toLowerCase().includes(q)
          )
      );
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default catalogueTableRouter;
