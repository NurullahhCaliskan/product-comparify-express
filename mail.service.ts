import SMTPTransport from "nodemailer/lib/smtp-transport";
import nodemailer from "nodemailer";

export let mailService: { service?: nodemailer.Transporter<SMTPTransport.SentMessageInfo> } = {}
