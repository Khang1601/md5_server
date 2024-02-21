export interface MailOption {
    from: string;
    to: string;
    subject: string;
    html?: string;
    text?: string;
}

export type SendMailFn = {
    (to: string, subject: string, html: string, from?: string): Promise<boolean>
}