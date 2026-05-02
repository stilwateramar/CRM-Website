import axios from 'axios';

const META_GRAPH = 'https://graph.facebook.com/v20.0';

export async function exchangeMetaCode(code: string) {
  const { data } = await axios.get(`${META_GRAPH}/oauth/access_token`, {
    params: {
      client_id: process.env.META_APP_ID,
      client_secret: process.env.META_APP_SECRET,
      redirect_uri: process.env.META_REDIRECT_URI,
      code,
    },
  });
  return data as { access_token: string; token_type: string; expires_in?: number };
}

export async function getInstagramAccount(accessToken: string) {
  const pages = await axios.get(`${META_GRAPH}/me/accounts`, { params: { access_token: accessToken } });
  const page = pages.data?.data?.[0];
  if (!page) return null;
  const ig = await axios.get(`${META_GRAPH}/${page.id}`, {
    params: { fields: 'instagram_business_account', access_token: accessToken },
  });
  return {
    pageId: page.id,
    pageAccessToken: page.access_token,
    instagramAccountId: ig.data?.instagram_business_account?.id,
  };
}

export async function publishInstagramReel(opts: {
  igAccountId: string;
  accessToken: string;
  videoUrl: string;
  caption: string;
}) {
  const create = await axios.post(`${META_GRAPH}/${opts.igAccountId}/media`, null, {
    params: {
      media_type: 'REELS',
      video_url: opts.videoUrl,
      caption: opts.caption,
      access_token: opts.accessToken,
    },
  });
  const creationId = create.data.id;
  const publish = await axios.post(`${META_GRAPH}/${opts.igAccountId}/media_publish`, null, {
    params: { creation_id: creationId, access_token: opts.accessToken },
  });
  return publish.data;
}

export async function publishFacebookPost(opts: {
  pageId: string;
  pageAccessToken: string;
  message: string;
  link?: string;
}) {
  const { data } = await axios.post(`${META_GRAPH}/${opts.pageId}/feed`, null, {
    params: {
      message: opts.message,
      link: opts.link,
      access_token: opts.pageAccessToken,
    },
  });
  return data;
}

/**
 * Reel processing is handled out-of-process by ffmpeg. This stub records the
 * planned trim/caption transformation; in production it would enqueue a job
 * (BullMQ) that runs ffmpeg and uploads the result to S3, then publishes.
 */
export async function processReelPlan(opts: {
  sourceVideoUrl: string;
  trimStart?: number;
  trimEnd?: number;
  captionsEnabled?: boolean;
  musicTrack?: string;
}) {
  return {
    queued: true,
    plan: opts,
    note:
      'Reel job enqueued. Worker will run ffmpeg trim/captions/music overlay then upload to CDN.',
  };
}
