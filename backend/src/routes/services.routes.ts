/**
 * This file is provided you as part of the interview kit.
 * Feel free to modify it as needed.
 * Do not remove this comment.
 */

import { Router } from "express";
import { Service } from "../types/shared";
import { addNewDataToFile, getEntityById, getFileData } from "../utils";

const servicesRouter = Router();

/************************ Provided Basic CRUD Endpoints ****************************/

// Get all services
servicesRouter.get('/services', (req, res) => {
  try {
    const data = getFileData("services") as Service[];
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get a service by ID
servicesRouter.get('/service/:id', (req, res) => {
  try {
    const service = getEntityById<Service>("services", req.params.id);
    if (service) {
      res.json(service);
    } else {
      res.status(404).json({ error: "Service not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Create a service
servicesRouter.post('/service', (req, res) => {
  const newService = req.body;
  try {
    addNewDataToFile<Service>("services", newService);
    res.status(201).json({ message: "Service added successfully", data: newService });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});


/******************* You may add additional endpoints ****************************/


export default servicesRouter;
