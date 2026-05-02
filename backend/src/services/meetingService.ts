import axios from 'axios';

export async function exchangeZoomCode(code: string) {
  const auth = Buffer.from(
    `${process.env.ZOOM_CLIENT_ID}:${process.env.ZOOM_CLIENT_SECRET}`
  ).toString('base64');
  const { data } = await axios.post(
    'https://zoom.us/oauth/token',
    null,
    {
      params: {
        grant_type: 'authorization_code',
        code,
        redirect_uri: process.env.ZOOM_REDIRECT_URI,
      },
      headers: { Authorization: `Basic ${auth}` },
    }
  );
  return data as { access_token: string; refresh_token: string; expires_in: number };
}

export async function createZoomMeeting(opts: {
  accessToken: string;
  topic: string;
  startTime: Date;
  durationMinutes: number;
}) {
  const { data } = await axios.post(
    'https://api.zoom.us/v2/users/me/meetings',
    {
      topic: opts.topic,
      type: 2,
      start_time: opts.startTime.toISOString(),
      duration: opts.durationMinutes,
      timezone: 'UTC',
      settings: { join_before_host: false, waiting_room: true },
    },
    { headers: { Authorization: `Bearer ${opts.accessToken}` } }
  );
  return { id: data.id, joinUrl: data.join_url, startUrl: data.start_url };
}

export async function exchangeGoogleCode(code: string) {
  const { data } = await axios.post('https://oauth2.googleapis.com/token', null, {
    params: {
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI,
      grant_type: 'authorization_code',
    },
  });
  return data as { access_token: string; refresh_token: string; expires_in: number };
}

export async function createGoogleMeet(opts: {
  accessToken: string;
  summary: string;
  startTime: Date;
  durationMinutes: number;
}) {
  const end = new Date(opts.startTime.getTime() + opts.durationMinutes * 60_000);
  const { data } = await axios.post(
    'https://www.googleapis.com/calendar/v3/calendars/primary/events',
    {
      summary: opts.summary,
      start: { dateTime: opts.startTime.toISOString() },
      end: { dateTime: end.toISOString() },
      conferenceData: {
        createRequest: {
          requestId: `yogify-${Date.now()}`,
          conferenceSolutionKey: { type: 'hangoutsMeet' },
        },
      },
    },
    {
      params: { conferenceDataVersion: 1 },
      headers: { Authorization: `Bearer ${opts.accessToken}` },
    }
  );
  return {
    id: data.id,
    joinUrl: data.hangoutLink || data.conferenceData?.entryPoints?.[0]?.uri,
  };
}
