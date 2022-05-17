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
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const engine_1 = __importDefault(require("./engine/engine"));
const database_service_1 = require("./database.service");
const mail_service_1 = require("./mail.service");
const mongoDB = __importStar(require("mongodb"));
// @ts-ignore
const nodemailer_1 = __importDefault(require("nodemailer"));
const mailService_1 = __importDefault(require("./mail/mailService"));
dotenv_1.default.config({ path: `.env.${process.env.NODE_ENV}` });
function loadDb() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log('start log');
            console.log(process.env.DBHOST);
            // @ts-ignore
            const client = new mongoDB.MongoClient(process.env.DBHOST);
            yield client.connect();
            console.log(process.env.DBNAME);
            const db = client.db(process.env.DBNAME);
            database_service_1.collections.userWebsitesRelationModel = db.collection("user-websites-relation");
            database_service_1.collections.websitesModel = db.collection("websites");
            database_service_1.collections.productHistoryModel = db.collection("product-history");
            database_service_1.collections.userModel = db.collection("user");
            database_service_1.collections.userSessionModel = db.collection("user-session");
            database_service_1.collections.mailHistoryModel = db.collection("mail-history");
            database_service_1.collections.engineHistoryModel = db.collection("engine-history");
            console.log('success load db2');
        }
        catch (e) {
            console.log('hata');
            console.log(e);
        }
    });
}
//initialize mail engine
function initializeMailEngine() {
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    console.log(process.env.MAILNAME);
    console.log(process.env.MAILPW);
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer_1.default.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.MAILNAME,
            pass: process.env.MAILPW
        }
    });
    mail_service_1.mailService.service = transporter;
}
initializeMailEngine();
loadDb().then(r => r);
const engine = new engine_1.default();
engine.startEngine();
const app = (0, express_1.default)();
const port = 3000;
app.get('/test', (req, res) => {
    console.log('test console');
    res.send('test4');
});
app.get('/set-website', (req, res) => {
    console.log('set-website');
    res.send('set-website');
});
app.get('/mail/test', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("mail/test");
    let mailService = new mailService_1.default();
    yield mailService.sendTestMail(req.query.id);
    res.send(JSON.stringify({ result: "success" }));
}));
app.listen(port, () => {
    console.log(`[server]: Test9 Server is running at https://localhost:${port}`);
});
