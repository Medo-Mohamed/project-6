const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const User = require("../models/users");
const bcryptjs = require("bcryptjs")
//////////////////////////////////////////////////////
// console.log("here")

// ADD NEW USERS
router.post("/users", async (req, res) => {
    const user = new User(req.body);
    console.log("here")
    user.save().then(user => res.status(200).send(user))
        .catch(e => res.status(400).send(e))
})

// GET ALL USERS
router.get("/users", auth, async (req, res) => {
    User.find({}).then(users => res.status(200).send(users))
        .catch(error => res.status(400).send(error))
})

// GET USER BY ID
router.get("/user/:_id", auth, async (req, res) => {
    try {
        const _id = req.params._id;
        const user = await User.findById(_id);
        console.log("here")
        if (!user) {
            return res.status(400).send("USER NOT FOUD !");
        }

        res.status(200).send(user);
    } catch (error) {
        res.status(500).send(error);
    }
})

// UPDATE USER
router.patch("/user/:_id", auth, async (req, res) => {
    try {
        const _id = req.params._id;
        const user = await User.findById(_id);
        if (!user) {
            return res.status(400).send("USER ID INVALID !");
        }
        const changeKeys = Object.keys(req.body);
        changeKeys.forEach(item => {
            if (item != "password") {
                user[item] = req.body[item];
            }
        })
        if (req.body.password) {
            const checkPassword = bcryptjs.compare(req.body.password, user.password);
            if (!checkPassword) {
                user.password = req.body.password;
            }
        }
        await user.save();
        res.status(200).send(user);
    } catch (error) {
        res.status(500).send(error.message);
    }
})

// DELETE USER
router.delete("/user/:_id", auth, async (req, res) => {
    try {
        const _id = req.params._id;
        const user = await User.findByIdAndDelete(_id);
        if (!user) {
            return res.status(400).send("USER ID INVALID !");
        }
        res.status(200).send(user);
    } catch (error) {
        res.status(500).send(error);
    }
})

// LOGIN USER
router.post("/login", async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        console.log("here")
        const token = await user.generateToken();
        res.status(200).send({ user, token });
    } catch (error) {
        res.status(500).send(error.message)
    }
})

// CHECK WHOS USER NOW 
router.get("/profile", auth, async (req, res) => {
    res.status(200).send(req.user);
})

// LOGING OUT 
router.delete("/logout", auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter(token => {
            return token != req.token;
        })
        await req.user.save();
        res.status(200).send("DONE LONGOUT");
    } catch (error) {
        res.status(400).send(error);
    }
})

// LOGING ALL OUT 
router.delete("/logoutall", auth, async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.status(200).send("DONE LONGOUT FROM ALL DEVICES");
    } catch (error) {
        res.status(400).send(error);
    }
})








//////////////////////////////////////////////////////
module.exports = router;