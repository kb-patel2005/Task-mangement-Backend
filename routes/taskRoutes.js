import express from "express";

const router = express.Router();

import authMiddleware from "../middleware/authMiddleware.js";

import { createTask, getTasks, updateTask, deleteTask } from "../controllers/taskController.js";

router.post("/", authMiddleware, createTask);

router.get("/", authMiddleware, getTasks);

router.put("/:id", authMiddleware, updateTask);

router.delete("/:id", authMiddleware, deleteTask);

export default router;