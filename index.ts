import express, { Express, NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
import Engine from './engine/engine';
import { mailService } from './mail.service';
import nodemailer from 'nodemailer';
import MailService from './mail/mailService';
import logger from './logger.middleware';
import morgan from 'morgan';
import QueueProductEngine from './engine/queueProductEngine';
import StoreService from './service/storeService';
import { parseInt } from 'lodash';
import WebsiteService from './service/websiteService';
import EngineHistoryModel from './model/engineHistoryModel';
import EngineHistoryService from './service/engineHistoryService';

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });


//initialize mail engine

function initializeMailEngine() {
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    // create reusable transporter object using the default SMTP transport
    mailService.service = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.MAILNAME,
            pass: process.env.MAILPW
        }
    })
}

initializeMailEngine();

const engine = new Engine();
engine.startEngine();

const queueProductEngine = new QueueProductEngine();
queueProductEngine.startEngine();

const app: Express = express();
const port = 3000;

const initVerify = async (req: Request, res: Response, next: NextFunction) => {
    console.log("initVerify")

    if (!mailService.service) {
        initializeMailEngine()
    }
    next();
}

app.use(morgan('combined'), logger)

app.get('/test', initVerify, (req: Request, res: Response) => {
    //logger(req,res)

    console.log('test console')
    return res.send('test5');
});

app.get('/engine/start', async (req: Request, res: Response) => {
    let engine = new Engine();

    console.log('start engine1')

    try {
        await engine.collectAllProducts()

    } catch (e) {
        console.log(e)
    }

    console.log('end engine1')
    return res.send(JSON.stringify({result: "Mail Send Successfully"}));
});


app.get('/mail/test', async (req: Request, res: Response) => {
    console.log("mail/test")

    let storeService = new StoreService()
    let mailService = new MailService()

    // @ts-ignore
    let user = await storeService.getStoreByStoreId(parseInt(req.query.id) as number)

    if (!user.selectedMail) {
        return res.status(422).send(JSON.stringify({result: "Please add valid mail"}))
    }

    // @ts-ignore
    await mailService.sendTestMail(parseInt(req.query.id) as number)
    return res.send(JSON.stringify({result: "Mail Send Successfully"}));
});

app.get('/query/test', async (req: Request, res: Response) => {
    let engineHistoryService = new EngineHistoryService();
    await engineHistoryService.saveEngineHistory(new EngineHistoryModel(new Date(), new Date(),0));
    return res.send(JSON.stringify("dadas"));
});

export default app.listen(port, () => {
    console.log(`[server]: Test2 Server is running at https://localhost:${port}`);
});
