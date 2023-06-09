"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
console.log("hello");
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const app = (0, express_1.default)();
dotenv_1.default.config();
const mongodb_uri = process.env.MONGO_URI;
const PORT = process.env.PORT;
// future implementation
mongoose_1.default.set("strictQuery", true);
mongoose_1.default
    .connect(mongodb_uri)
    .then((res) => {
    console.log("Connected to DB");
})
    .catch((err) => {
    console.log("At mongoose.connect:");
    console.error(err.message);
});
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
const usersRoutes_1 = __importDefault(require("./API/users/usersRoutes"));
app.use("/api/users", usersRoutes_1.default);
app.listen(PORT, () => {
    console.log(`server is active on port : ${PORT}`);
});
