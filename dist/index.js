"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const engine_1 = __importDefault(require("./engine/engine"));
const mail_service_1 = require("./mail.service");
const nodemailer_1 = __importDefault(require("nodemailer"));
const mailService_1 = __importDefault(require("./mail/mailService"));
const queueProductEngine_1 = __importDefault(require("./engine/queueProductEngine"));
const storeService_1 = __importDefault(require("./service/storeService"));
const lodash_1 = require("lodash");
const logUtility_1 = require("./utility/logUtility");
const node_schedule_1 = __importDefault(require("node-schedule"));
const cron_1 = require("cron");
const cronUtility_1 = require("./utility/cronUtility");
dotenv_1.default.config({ path: `.env.${process.env.NODE_ENV}` });
//initialize mail engine
function initializeMailEngine() {
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    // create reusable transporter object using the default SMTP transport
    mail_service_1.mailService.service = nodemailer_1.default.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.MAILNAME,
            pass: process.env.MAILPW,
        }
    });
}
initializeMailEngine();
const engine = new engine_1.default();
const queueProductEngine = new queueProductEngine_1.default();
// @ts-ignore
const mainJob = new cron_1.CronJob((0, cronUtility_1.GET_MAIN_SCHEDULED_AS_SECOND)(), async function () {
    await engine.runEngine();
});
// @ts-ignore
const queueJob = new cron_1.CronJob((0, cronUtility_1.GET_MAIN_SCHEDULED_AS_SECOND)(), async function () {
    await queueProductEngine.runEngine();
});
mainJob.start();
queueJob.start();
const app = (0, express_1.default)();
const port = 3000;
const initVerify = async (req, res, next) => {
    console.log('initVerify');
    if (!mail_service_1.mailService.service) {
        initializeMailEngine();
    }
    next();
};
app.get('/test', initVerify, (req, res) => {
    let data = null;
    console.log(node_schedule_1.default.scheduledJobs);
    console.log('test console');
    logUtility_1.logger.info('hehehehe2');
    console.log('test console');
    return res.status(500).send('test6');
});
app.get('/engine/start', async (req, res) => {
    let engine = new engine_1.default();
    if (req.headers.api_key !== process.env.ENGINE_START_API_KEY) {
        return res.send(JSON.stringify({ result: 'fail' }));
    }
    console.log(req.headers);
    console.log('start engine1');
    try {
        await engine.collectAllProducts();
    }
    catch (e) {
        console.log(e);
    }
    console.log('end engine1');
    return res.send(JSON.stringify({ result: 'Mail Send Successfully' }));
});
app.get('/mail/test', async (req, res) => {
    console.log("mail/test");
    let storeService = new storeService_1.default();
    let mailService = new mailService_1.default();
    // @ts-ignore
    let user = await storeService.getStoreByStoreId((0, lodash_1.parseInt)(req.query.id));
    if (!user.selectedMail) {
        return res.status(422).send(JSON.stringify({ result: "Please add valid mail" }));
    }
    // @ts-ignore
    await mailService.sendTestMail((0, lodash_1.parseInt)(req.query.id));
    return res.send(JSON.stringify({ result: 'Mail Send Successfully' }));
});
app.get('/query/test', async (req, res) => {
    return res.send(JSON.stringify('dadas'));
});
app.use(logUtility_1.logRequest);
app.use(logUtility_1.logError);
exports.default = app.listen(port, () => {
    console.log(`[server]: Test2 Server is running at https://localhost:${port}`);
});
