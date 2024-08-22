const mongoose = require("mongoose");
const validator = require("validator");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        default: "unKnown"
    },
    username: {
        type: String,
        trim: true,
        unique: true,
        required: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true,
        validate(val) {
            if (!validator.isEmail(val)) {
                throw new Error("This is not valid emali , Plz try agan .")
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        validate(pas) {
            let regexPas = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])/;
            if (!(regexPas.test(pas))) {
                throw new Error("PASSWORD have to contan uppcase , lowercase , number , spicel characters (. ! @ # $ % ^ & *)")
            }
        }
    },
    age: {
        type: Number,
        default: 18,
        validate(num) {
            if (num <= 0) {
                throw new Error("Age must be positive number");
            }
        }
    },
    city: {
        type: String
    },
    tokens: [
        {
            type: String,
            required: true
        }
    ]
})
//////////////////////////////////////////////////////////////////
userSchema.pre("save", async function () {

    if (this.isModified("password")) {
        this.password = await bcryptjs.hash(this.password, 8);
    }
})
// قم بعمل تشفير للباسورد قبل الحفظ في حالة اذا تغير الباسورد
//////////////////////////////////////////////////////////////////
userSchema.statics.findByCredentials = async function (email, password) {
    // this = User(البناء)
    const user = await this.findOne({ email });
    if (!user) {
        throw new Error("wrong email");
    }
    const pasCheck = bcryptjs.compare(password, user.password);

    if (!pasCheck) {
        throw new Error("wrong password");
    }


    return user;
}
// من اجل التأكد عند عمل تسجيل دخول
//////////////////////////////////////////////////////////////////
userSchema.methods.generateToken = async function () {
    // this = user(الذي سوف يتم انشائة من البناء)
    const token = jwt.sign({ _id: this._id.toString() }, "MEDO");
    this.tokens = this.tokens.concat(token);

    await this.save();
    return token;
}
// تقوم بقعمل توكن وإضافة اوتوماتكين في اليوزر توكنز وترجع فقط قيمة التوكن الذي تم انشائة للعرض
//////////////////////////////////////////////////////////////////
userSchema.methods.toJSON = function () {
    // this = user(الذي سوف يتم انشائة من البناء)
    const NewObject = this.toObject();
    delete NewObject.password;
    delete NewObject.tokens;
    console.log(NewObject)
    return NewObject;
}
// عند استدعاء الداتا في كل مرة تعمل هذة الفنكشن اوتومتك وترجع اليوزر ولكن بدون المعلومات المهمة
//////////////////////////////////////////////////////////////////
const User = mongoose.model("User", userSchema);
module.exports = User;