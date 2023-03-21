"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUserByID = exports.updateUserByID = exports.getUserById = exports.getUserByCookie = exports.getAllUsers = exports.getUser = exports.logout = exports.login = exports.register = void 0;
const userModel_1 = __importStar(require("./userModel"));
const bcrypt_1 = __importDefault(require("bcrypt")); // tsc 
const jwt_simple_1 = __importDefault(require("jwt-simple")); // npm i jwt-simple
const saltRounds = 10;
function register(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { email, username, password, repeatPassword } = req.body;
            if (!email || !username || !password || !repeatPassword)
                throw new Error("Couldn't get all fields from req.body");
            const { error } = userModel_1.UserValidation.validate({ email, username, password, repeatPassword });
            if (error)
                throw error;
            const salt = bcrypt_1.default.genSaltSync(saltRounds);
            const hash = bcrypt_1.default.hashSync(password, salt);
            const userDB = new userModel_1.default({ email, username, password: hash });
            yield userDB.save();
            //sending cookie
            const cookie = { userId: userDB._id };
            const secret = process.env.JWT_SECRET;
            if (!secret)
                throw new Error("Couldn't load secret from .env");
            const JWTCookie = jwt_simple_1.default.encode(cookie, secret);
            if (userDB) {
                res.cookie("userID", JWTCookie);
                res.send({ register: true, userDB });
            }
            else {
                res.send({ register: false });
            }
            // } catch (error) {
            //   res.send({ error: error.message });
            // }
        }
        catch (error) {
            if (error instanceof Error) {
                // ✅ TypeScript knows err is Error
                // console.log(error.message);
                res.status(500).send({ error: error.message });
            }
            else {
                console.log('Unexpected error', error);
            }
        }
    });
}
exports.register = register;
function login(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { email, password } = req.body;
            if (!email || !password)
                throw new Error("Couldn't get all fields from req.body");
            const userDB = yield userModel_1.default.findOne({ email });
            if (!userDB)
                throw new Error("User with that email can't be found");
            if (!userDB.password)
                throw new Error("No password in DB");
            const isMatch = yield bcrypt_1.default.compare(password, userDB.password);
            if (!isMatch)
                throw new Error("Email or password do not match");
            //sending cookie
            const cookie = { userId: userDB._id };
            const secret = process.env.JWT_SECRET;
            if (!secret)
                throw new Error("Couldn't load secret from .env");
            const JWTCookie = jwt_simple_1.default.encode(cookie, secret);
            res.cookie("userID", JWTCookie);
            res.send({ login: true, userDB });
            // } catch (error) {
            //   res.send({ error: error.message });
            // }
        }
        catch (error) {
            if (error instanceof Error) {
                // ✅ TypeScript knows err is Error
                // console.log(error.message);
                res.status(500).send({ error: error.message });
            }
            else {
                console.log('Unexpected error', error);
            }
        }
    });
}
exports.login = login;
function logout(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            res.clearCookie("userID");
            res.send({ logout: true });
        }
        catch (error) {
            res.status(500).send({ error: error.message });
        }
    });
}
exports.logout = logout;
function getUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const secret = process.env.JWT_SECRET;
            if (!secret)
                throw new Error("Couldn't load secret from .env");
            const { userID } = req.cookies;
            if (!userID)
                throw new Error("Couldn't find user from cookies");
            const decodedUserId = jwt_simple_1.default.decode(userID, secret);
            const { userId } = decodedUserId;
            const userDB = yield userModel_1.default.findById(userId);
            if (!userDB)
                throw new Error(`Couldn't find user id with the id: ${userId}`);
            res.send({ userDB });
            // } catch (error) {
            //   res.send({ error: error.message })
            // }
        }
        catch (error) {
            if (error instanceof Error) {
                // ✅ TypeScript knows err is Error
                // console.log(error.message);
                res.status(500).send({ error: error.message });
            }
            else {
                console.log('Unexpected error', error);
            }
        }
    });
}
exports.getUser = getUser;
//get All documents
function getAllUsers(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const usersDB = yield userModel_1.default.find();
            res.send({ usersDB });
            // } catch (error) {
            //   res.status(500).send({ error: error.message });
            // }
        }
        catch (error) {
            if (error instanceof Error) {
                // ✅ TypeScript knows err is Error
                // console.log(error.message);
                res.status(500).send({ error: error.message });
            }
            else {
                console.log('Unexpected error', error);
            }
        }
    });
}
exports.getAllUsers = getAllUsers;
function getUserByCookie(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            res.send({ test: "test" });
            // } catch (error) {
            //   res.status(500).send({ error: error.message });
            // }
        }
        catch (error) {
            if (error instanceof Error) {
                // ✅ TypeScript knows err is Error
                // console.log(error.message);
                res.status(500).send({ error: error.message });
            }
            else {
                console.log('Unexpected error', error);
            }
        }
    });
}
exports.getUserByCookie = getUserByCookie;
//get user by id
function getUserById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userDB = yield userModel_1.default.findById(req.params.id);
            res.send({ userDB });
            // } catch (error) {
            //   res.status(500).send({ error: error.message });
            // }
        }
        catch (error) {
            if (error instanceof Error) {
                // ✅ TypeScript knows err is Error
                // console.log(error.message);
                res.status(500).send({ error: error.message });
            }
            else {
                console.log('Unexpected error', error);
            }
        }
    });
}
exports.getUserById = getUserById;
function updateUserByID(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            //who to change? // to what information // option - send new doc / run the validations again
            const userDB = yield userModel_1.default.findByIdAndUpdate(req.params.id, req.body, {
                new: true,
                runValidators: true,
            });
            res.send({ userDB });
            // } catch (error) {
            //   res.status(500).send({ error: error.message });
        }
        catch (error) {
            if (error instanceof Error) {
                // ✅ TypeScript knows err is Error
                // console.log(error.message);
                res.status(500).send({ error: error.message });
            }
            else {
                console.log('Unexpected error', error);
            }
        }
        // }
    });
}
exports.updateUserByID = updateUserByID;
function deleteUserByID(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            //who to change? // to what information // option - send new doc
            const userDB = yield userModel_1.default.findByIdAndDelete(req.params.id);
            res.send({ userDB });
            // } catch (error) {
            //   res.status(500).send({ error: error.message });
            // }
        }
        catch (error) {
            if (error instanceof Error) {
                // ✅ TypeScript knows err is Error
                // console.log(error.message);
                res.status(500).send({ error: error.message });
            }
            else {
                console.log('Unexpected error', error);
            }
        }
    });
}
exports.deleteUserByID = deleteUserByID;
