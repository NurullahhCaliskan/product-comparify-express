// @ts-ignore
// @ts-ignore
// @ts-ignore

import express, {Express, NextFunction, Request, Response} from 'express';
import dotenv from 'dotenv';
import Engine from './engine/engine';
import {collections} from "./database.service";
import {mailService} from "./mail.service";
import * as mongoDB from "mongodb";
// @ts-ignore
import nodemailer from "nodemailer";
// @ts-ignore
import smtpTransport from "nodemailer-smtp-transport";
import ProductUploader from "./mail/productUploader";
import MailService from "./mail/mailService";
import {callbackify} from "util";
import {callbackPromise} from "nodemailer/lib/shared";
import logger from "./logger.middleware";
import morgan from "morgan";
import EngineHistoryService from "./service/engineHistoryService";
import EngineHistoryModel from "./model/engineHistoryModel";

dotenv.config({path: `.env.${process.env.NODE_ENV}`});

async function loadDb() {
    try {

        console.log('start log')
        console.log(process.env.DBHOST)

        // @ts-ignore
        const client: mongoDB.MongoClient = new mongoDB.MongoClient(process.env.DBHOST);

        await client.connect();

        console.log(process.env.DBNAME)
        const db: mongoDB.Db = client.db(process.env.DBNAME);
        collections.userWebsitesRelationModel = db.collection("user-websites-relation");
        collections.websitesModel = db.collection("websites");
        collections.productHistoryModel = db.collection("product-history");
        collections.userModel = db.collection("user");
        collections.userSessionModel = db.collection("user-session");
        collections.mailHistoryModel = db.collection("mail-history");
        collections.engineHistoryModel = db.collection("engine-history");

        console.log('success load db2')
    } catch (e) {
        console.log('hata')
        console.log(e)
    }

}

//initialize mail engine

function initializeMailEngine() {
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.MAILNAME,
            pass: process.env.MAILPW
        }
    })

    mailService.service = transporter
}

initializeMailEngine();
loadDb().then(r => r)

const engine = new Engine();
engine.startEngine();

const app: Express = express();
const port = 3000;

const initVerify = async (req: Request, res: Response, next: NextFunction) => {
    console.log("initVerify")
    if (!collections.userWebsitesRelationModel) {

        await loadDb()
    }

    if (!mailService.service) {
        initializeMailEngine()
    }
    next();
}

app.use(morgan('combined'), logger)

app.get('/test', initVerify, (req: Request, res: Response) => {
    //logger(req,res)

    console.log('test console')
    res.send('test4');
});

app.get('/engine/start', async (req: Request, res: Response) => {
    let engine = new Engine();

    console.log('start engine1')

    try {
        let engineHistoryService = new EngineHistoryService()

        let engineHistoryModelStart = new EngineHistoryModel(new Date(), "Start Run Engine")
        await engineHistoryService.saveEngineHistory(engineHistoryModelStart)

        await engine.collectAllProducts()

        await engine.prepareAlarmToSendMail()

        let engineHistoryModelEnd = new EngineHistoryModel(new Date(), "End Run Engine")
        await engineHistoryService.saveEngineHistory(engineHistoryModelEnd)

    } catch (e) {
        console.log(e)
    }

    console.log('end engine1')
    res.send(JSON.stringify({result: "success"}));
});

app.get('/mail/test', async (req: Request, res: Response) => {
    console.log("mail/test")
    let mailService = new MailService()
    await mailService.sendTestMail(req.query.id as string)
    res.send(JSON.stringify({result: "success"}));
});


export default  app.listen(port, () => {
    console.log(`[server]: Test9 Server is running at https://localhost:${port}`);
});
