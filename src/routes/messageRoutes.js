import express from 'express';
import { createMessages, getMessages, editMessages, deleteMessages } from '../controllers/messageController.js';

const router = express.Router();

router.post('/', createMessages).get('/', getMessages).put('/:id', editMessages).delete('/:id', deleteMessages)

export default router;