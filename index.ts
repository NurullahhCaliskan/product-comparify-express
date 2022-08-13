import express, { Express, NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
import Engine from './engine/engine';
import { mailService } from './mail.service';
import nodemailer from 'nodemailer';
import MailService from './mail/mailService';
import QueueProductEngine from './engine/queueProductEngine';
import StoreService from './service/storeService';
import { parseInt } from 'lodash';
import { logError, logger, logRequest } from './utility/logUtility';
import schedule from 'node-schedule';
import { CronJob } from 'cron';
import { GET_MAIN_SCHEDULED_AS_SECOND, GET_QUEUE_SCHEDULED_AS_SECOND } from './utility/cronUtility';

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
            pass: process.env.MAILPW,
        }
    })
}

initializeMailEngine();

const engine = new Engine();
const queueProductEngine = new QueueProductEngine();

// @ts-ignore
const mainJob = new CronJob(GET_MAIN_SCHEDULED_AS_SECOND(), async function() {
    await engine.runEngine();
});

// @ts-ignore
const queueJob = new CronJob(GET_QUEUE_SCHEDULED_AS_SECOND(), async function() {
    await queueProductEngine.runEngine();
});

mainJob.start();
queueJob.start();


const app: Express = express();
const port = 3000;

const initVerify = async (req: Request, res: Response, next: NextFunction) => {
    console.log('initVerify');

    if (!mailService.service) {
        initializeMailEngine();
    }
    next();
};


app.get('/test', initVerify, (req: Request, res: Response) => {
    let data = null;
    console.log(schedule.scheduledJobs);
    console.log('test console');


    logger.info('hehehehe2');
    console.log('test console');
    return res.status(500).send('test6');
});


app.get('/engine/start', async (req: Request, res: Response) => {
    let engine = new Engine();

    if (req.headers.api_key !== process.env.ENGINE_START_API_KEY) {
        return res.send(JSON.stringify({ result: 'fail' }));
    }
    console.log(req.headers);
    console.log('start engine1');

    try {
        await engine.prepareAlarmToSendMail();

    } catch (e) {
        console.log(e);
    }

    console.log('end engine1');
    return res.send(JSON.stringify({ result: 'Mail Send Successfully' }));
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
    await mailService.sendTestMail(parseInt(req.query.id) as number);
    return res.send(JSON.stringify({ result: 'Mail Send Successfully' }));
});

app.get('/query/test', async (req: Request, res: Response) => {
    return res.send(JSON.stringify('dadas'));
});


app.use(logRequest);
app.use(logError);


export default app.listen(port, () => {
    console.log(`[server]: Test2 Server is running at https://localhost:${port}`);
});
