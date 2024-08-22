const express = require("express");
const router = express.Router();
const Artical = require("../models/articals");
const auth = require("../middleware/auth");
/////////////////////////////////////////////////////////
// ADD NEW ARTICALS
router.post("/addart", auth, async (req, res) => {
    try {
        const artical = new Artical({ ...req.body, owner: req.user._id });

        await artical.save();
        res.status(200).send(artical);
    } catch (error) {
        res.status(400).send(error);
    }
})

// GET ALL YOUR ARTICASL
router.get("/allarticals", auth, async (req, res) => {
    try {
        const articals = await Artical.find({ owner: req.user._id });
        if (!articals) {
            return res.status(400).send("EMPATY ARTICALS !!");
        }
        res.status(200).send(articals);
    } catch (error) {
        res.status(400).send(error);
    }
})

// GET SPECIFIC ARTICAL
router.get("/artical/:_id", auth, async (req, res) => {
    try {
        const _id = req.params._id;
        const artical = await Artical.findOne({ _id });
        if (!artical) {
            return res.status(400).send("NOT FOUND !!");
        }

        if (artical.owner.toString() != req.user._id.toString()) {
            return res.status(400).send("YOU CAN NOT ACCESS THIS ARTICAL.");
        }
        res.status(200).send(artical);
    } catch (error) {
        res.status(400).send(error.message);
    }
})

// UPDATE ARTICAL
router.patch("/updateartical/:_id", auth, async (req, res) => {
    try {
        const _id = req.params._id;
        const artical = await Artical.findById(_id);
        if (!artical) {
            return res.status(400).send("NOT FOUND !!");
        } else if (artical.owner.toString() != req.user._id.toString()) {
            return res.status(400).send("YOU CAN NOT UPDATE THIS ARTICAL.");
        }
        Artical.findByIdAndUpdate(_id, req.body, {
            new: true,
            runValidators: true,
        }).then(art => res.status(200).send(art))
    } catch (error) {
        res.status(400).send(error.message);
    }
})

// DELETE ARTICAL 
router.delete("/deleteart/:_id", auth, async (req, res) => {
    try {
        const _id = req.params._id;
        const artical = await Artical.findById(_id);
        if (!artical) {
            return res.status(400).send("NOT FOUND !!");
        } else if (artical.owner.toString() != req.user._id.toString()) {
            return res.status(400).send("YOU CAN NOT DELETE THIS ARTICAL.");
        }
        Artical.findByIdAndDelete(_id).then(art => res.status(200).send(art))
    } catch (error) {
        res.status(400).send(error.message);
    }
})
/////////////////////////////////////////////////////////
module.exports = router;