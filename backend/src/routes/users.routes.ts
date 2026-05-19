/**
 * This file is provided you as part of the interview kit.
 * Feel free to modify it as needed.
 * Do not remove this comment.
 */

import { Router } from "express";
import { createHash } from "crypto";
import { addNewDataToFile, getFileData } from "../utils";
import { User } from "../types/shared";

const usersRouter = Router();

const hashValue = (value: string) =>
  createHash("sha256").update(value).digest("hex");

/************************ Provided Basic CRUD Endpoints ****************************/

// Get all users
usersRouter.get('/users', (req, res) => {
  try {
    const data = getFileData("users") as User[];
    const safeData = data.map(({ password, ...rest }) => rest);
    res.json(safeData);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get a user by ID
usersRouter.get('/user/:id', (req, res) => {
  try {
    const data = getFileData("users") as User[];
    const user = data.find((u: User) => u.id === req.params.id);
    if (user) {
      const { password, ...safeUser } = user;
      res.json(safeUser);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Authenticate user login
usersRouter.post('/login', (req, res) => {
  const { email, password } = req.body as {
    email?: string;
    password?: string;
  };

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const data = getFileData("users") as User[];
    const hashedPassword = hashValue(password);
    const user = data.find(
      (u: User) => u.email === email && u.password === hashedPassword
    );

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const { password: _, ...safeUser } = user;
    res.json(safeUser);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Create a user
usersRouter.post('/user', (req, res) => {
  const newUser = req.body;
  try {
    addNewDataToFile<User>("users", newUser);
    res.status(201).json({ message: "User added successfully", data: newUser });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

/******************* You may add additional endpoints ****************************/


export default usersRouter;
