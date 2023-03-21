"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidation = void 0;
const mongoose_1 = __importDefault(require("mongoose")); // npm i mongoose
const joi_1 = __importDefault(require("joi")); // npm i joi
const joi_password_1 = require("joi-password"); // npm i joi-password
const joiPassword = joi_1.default.extend(joi_password_1.joiPasswordExtendCore);
const UserSchema = new mongoose_1.default.Schema({
    email: {
        type: String,
        unique: true,
        requierd: [true, "user must have email"]
    },
    username: {
        type: String,
        required: true
    },
    password: String,
});
const UserModel = mongoose_1.default.model("users", UserSchema);
exports.default = UserModel;
exports.UserValidation = joi_1.default.object({
    email: joi_1.default.string().email().required(),
    username: joi_1.default.string().alphanum().min(3).max(16).required(),
    password: joiPassword
        .string()
        .min(6)
        .max(16)
        // .minOfSpecialCharacters(1)
        // .minOfLowercase(1)
        // .minOfUppercase(1)
        // .minOfNumeric(1)
        // .noWhiteSpaces()
        .required(),
    repeatPassword: joi_1.default.ref('password')
});
