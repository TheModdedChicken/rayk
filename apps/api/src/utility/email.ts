import { Transporter, createTransport } from "nodemailer"
import { randomInt } from 'crypto';

import env from "./env"
import { EmailRegex } from "./regex"
import UserService from "../routes/users/user.service";
import Mail from "nodemailer/lib/mailer";


export enum EidLevel {
  LOW = 1,
  HIGH = 2
}

interface EidData {
  level: EidLevel
  isUser: boolean
  expires: Date
}

export interface EidHeaderData {
  email?: string
  code?: string
}

export class EmailService {
  private static readonly register = new Map<string, Map<string, EidData>>()

  private static readonly transport: Transporter = createTransport({
    host: env.EMAIL_HOST,
    port: env.EMAIL_PORT,
    auth: {
      user: env.EMAIL_USER,
      pass: env.EMAIL_PASS
    }
  })

  static ParseEidHeader (header: string) {
    const split = header.trim().split(" ");

    const data: EidHeaderData = {
      email: split.find(p => 
        p.startsWith("email=") && 
        EmailRegex.test( p.split("=")[1] )
      )
      ?.split("=")[1] || undefined,

      code: split.find(p => p.startsWith("code="))?.split("=")[1] || undefined
    }

    return data;
  }

  /**
   * 
   * @param email Email address to send email to
   * @param level Authorization level of EID
   */
  static async CreateEid (
    email: string,
    level: EidLevel
  ) {
    const code = randomInt(0, 10**6-1).toString().padStart(6, "0");
    const eid = `${email}:${code}`;

    if (!this.register.has(email)) this.register.set(email, new Map());

    const eidDataMap = this.register.get(email);
    if (!eidDataMap) throw new Error("Failed to create EID");

    const isUser = !!await UserService.GetUser({ where: { email } });

    const eidTTL = 600000; // 10 Minutes
    const data: EidData = {
      level,
      isUser,
      expires: new Date(Date.now() + eidTTL)
    };

    eidDataMap.set(code, data);

    await this.send(
      email, 
      "Rayk Account Verification Code", 
      { text: `Hi! Here's your verification code: ${code} \n\nIf you didn't request this, you can ignore this email.` }
    );

    setTimeout(() => { 
      const edp = this.register.get(email);
      if (edp?.has(eid)) edp.delete(eid);
    }, eidTTL);

    return data;
  }

  static GetEid (email: string, code: string) {
    const map = this.register.get(email);
    if (!map) return undefined;

    const eid = map.get(code);
    if (!eid) return undefined;

    return { eid, map };
  }

  static DeleteEid (email: string, code: string) {
    this.GetEid(email, code)?.map.delete(code);
  }

  static async send(to: string, subject: string, options?: { text?: string, html?: string }) {
    const message: Mail.Options = {
      from: 'rayk.cc <noreply@rayk.cc>',
      to,
      subject,
      text: options?.text,
      html: options?.html
    };

    // TO-DO: Fix NODE_ENV not working
    if (env.NODE_ENV !== "development") return await this.transport.sendMail(message);
    else console.log(
      `
      New Email:\n
      from: ${message.from}
      to: ${message.to}
      subject: ${message.subject}
      text: ${message.text}
      `
    );
  }
}