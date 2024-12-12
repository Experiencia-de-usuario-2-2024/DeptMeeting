import { Injectable, Logger } from '@nestjs/common';
import { google, Auth } from 'googleapis';
import * as fs from 'fs/promises';
import * as path from 'path';

@Injectable()
export class GoogleAuthService {
  private oauth2Client: Auth.OAuth2Client;
  private readonly CREDENTIALS_PATH = path.join(
    process.cwd(),
    'credentials.json',
  );

  constructor() {
    this.init();
  }

  private async init() {
    const auth = new google.auth.GoogleAuth({
      keyFile: this.CREDENTIALS_PATH,
      scopes: ['https://www.googleapis.com/auth/calendar.events’,’https://www.googleapis.com/auth/calendar'],
    });
  }


  public async listEvents(): Promise<any> {
    const calendar = google.calendar({
      version: 'v3',
      auth: this.oauth2Client,
    });
    const res = await calendar.events.list({
      calendarId: 'primary',
      timeMin: new Date().toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: 'startTime',
    });
    return res.data.items;
  }
}
