import User from "../models/User.js";

import bcrypt from "bcryptjs";

import jwt from "jsonwebtoken";

export const register = async (req, res) => {

    try {

        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) {

            return res.status(400).json({
                message: "User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            name,
            email,
            password: hashedPassword
        });

        res.status(201).json({
            message: "User Registered"
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });
    }
};

export const login = async (req, res) => {

    try {

        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {

            return res.status(400).json({
                message: "Invalid Email"
            });
        }

        const isMatch =
            await bcrypt.compare( password, user.password );

        if (!isMatch) {

            return res.status(400).json({
                message: "Invalid Password"
            });
        }

        const token = jwt.sign(
            {id: user._id},
            process.env.JWT_SECRET,
            {expiresIn: "1d"}
        );

        res.json({token, user });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });
    }
};

