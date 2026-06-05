import express from "express";

const router = express.Router();

import authMiddleware from "../middleware/authMiddleware.js";

import { createTask, updateTask, deleteTask , getTasksByUserId } from "../controllers/taskController.js";

router.post("/", authMiddleware, createTask);

router.get("/tasks", authMiddleware, getTasksByUserId);

router.put("/:id", authMiddleware, updateTask);

router.delete("/:id", authMiddleware, deleteTask);

export default router;