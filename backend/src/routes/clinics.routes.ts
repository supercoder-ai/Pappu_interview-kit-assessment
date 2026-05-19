/**
 * This file is provided you as part of the interview kit.
 * Feel free to modify it as needed.
 * Do not remove this comment.
 */

import { Router } from "express";
import { Clinic } from "../types/shared";
import { addNewDataToFile, getEntityById, getFileData } from "../utils";

const clinicsRouter = Router();

/************************ Provided Basic CRUD Endpoints ****************************/

// Get all clinics
clinicsRouter.get('/clinics', (req, res) => {
  try {
    const data = getFileData("clinics") as Clinic[];
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get a clinics by ID
clinicsRouter.get('/clinic/:id', (req, res) => {
  try {
    const clinic = getEntityById<Clinic>("clinics", req.params.id);
    if (clinic) {
      res.json(clinic);
    } else {
      res.status(404).json({ error: "Clinic not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Create a clinic
clinicsRouter.post('/clinic', (req, res) => {
  const newClinic = req.body;
  try {
    addNewDataToFile<Clinic>("clinics", newClinic);
    res.status(201).json({ message: "Clinic added successfully", data: newClinic });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

/******************* You may add additional endpoints ****************************/


export default clinicsRouter;
