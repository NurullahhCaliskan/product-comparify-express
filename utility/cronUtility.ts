import dotenv from "dotenv";

dotenv.config({path: `.env.${process.env.NODE_ENV}`});

export function EVERY_DAY_AT_MIDNIGHT() {


    return '0 0 * * *'
}

export function EVERY_SECOND() {
    return '*/1 * * * * *'
}

export function EVERY_TEN_SECOND() {

    console.log()
    return '*/10 * * * * *'
}

export function EVERY_20_SECOND() {
    return '*/20 * * * * *'
}

export function GET_QUEUE_SCHEDULED_AS_SECOND() {
    return process.env.QUEUE_ENGINE_SCHEDULED_AS_SECOND
}

export function GET_MAIN_SCHEDULED_AS_SECOND() {

    return process.env.MAIN_ENGINE_SCHEDULED_AS_SECOND
}
