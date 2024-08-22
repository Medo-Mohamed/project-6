const express = require("express")
const User = require("../models/users.js")
const jwt = require("jsonwebtoken");

async function auth(req, res, next) {
    try {
        const token = req.header("Authorization").replace("Bearar ", "");
        const { _id } = jwt.verify(token, "MEDO");
        const user = await User.findOne({ _id, tokens : token });

        if (!user) {
            throw new Error("Please authenticate");
        }

        req.user = user;
        req.token = token;

        next(); // لتشغيل الفنكشن التي تليها في ترتيب الفنكشنز

    } catch (error) {
        res.status(400).send(error.message);
    }
}


module.exports = auth;