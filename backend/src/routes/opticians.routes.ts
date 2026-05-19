/**
 * This file is provided you as part of the interview kit.
 * Feel free to modify it as needed.
 * Do not remove this comment.
 */

import { Router } from "express";
import { addNewDataToFile, getEntityById, getFileData } from "../utils";
import { Optician } from "../types/shared";

const opticiansRouter = Router();

/************************ Provided Basic CRUD Endpoints ****************************/

// Get all opticians
opticiansRouter.get('/opticians', (req, res) => {
  try {
    const data = getFileData("opticians") as Optician[];
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// Get a optician by ID
opticiansRouter.get('/optician/:id', (req, res) => {
  try {
    const optician = getEntityById<Optician>("opticians", req.params.id);
    if (optician) {
      res.json(optician);
    } else {
      res.status(404).json({ error: "Optician not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// Create an optician
opticiansRouter.post('/optician', (req, res) => {
  const newOptician = req.body;
  try {
    addNewDataToFile<Optician>("opticians", newOptician);
    res.status(201).json({ message: "Optician added successfully", data: newOptician });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});


/******************* You may add additional endpoints ****************************/


export default opticiansRouter;
