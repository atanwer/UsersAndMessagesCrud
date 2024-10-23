import express from "express";
import { createUser, getUsers, updateUser, deleteUser } from "../controllers/userController.js";

const router = express.Router();

router.post("/", createUser).get('/', getUsers).put('/:id', updateUser).delete('/:id', deleteUser)

export default router;