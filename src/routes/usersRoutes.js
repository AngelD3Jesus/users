import express from 'express';
import { getUsers, createUser, updateUser, deleteUser, login, resetPassword } from '../controllers/userController.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Users management
 */

/**
 * @swagger
 * /app/users/all:
 *   get:
 *     summary: Get all Users
 *     tags: [Users]
 *     responses:
 *       '200':
 *         description: A successful response
 */
router.get('/all', getUsers);

/**
 * @swagger
 * /app/users/create:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phone:
 *                 type: string
 *                 example: "6181113333"
 *               username:
 *                 type: string
 *                 example: "email@gmail.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "securePassword123"
 *     responses:
 *       200:
 *         description: User created successfully
 *       400:
 *         description: Bad request
 */
router.post('/create', createUser);

/**
 * @swagger
 * /app/users/update/{id}:
 *   patch:
 *     summary: Update a user's password and phone
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the user to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *                 example: "new_secure_password"
 *               phone:
 *                 type: string
 *                 example: "+521234567891"
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: User not found
 */
router.patch('/update/:id', updateUser);

/**
 * @swagger
 * /app/users/delete/{id}:
 *   patch:
 *     summary: Delete a user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user to delete
 *     responses:
 *       '200':
 *         description: User deleted successfully
 */
router.patch('/delete/:id', deleteUser);

/**
 * @swagger
 * /app/users/login:
 *   post:
 *     summary: User login
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: "email@gmail.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "securePassword123"
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', login);

/**
 * @swagger
 * /app/users/reset-password:
 *   post:
 *     summary: Reset user password
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: "email@gmail.com"
 *     responses:
 *       200:
 *         description: Password reset email sent
 *       404:
 *         description: User not found
 */
router.post('/reset-password', resetPassword);

export default router;