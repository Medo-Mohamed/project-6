const mongoose = require("mongoose");

const artSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    discription: {
        type: String,
        required: true,
        trim: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
})

const Artical = mongoose.model("artical", artSchema);

module.exports = Artical;