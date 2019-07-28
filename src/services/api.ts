/* import { stringify } from 'qs'; */ /* Payload 2 Form */
import request from '@/utils/request';
import { getToken } from '@/utils/authority';

export async function fakeRegister(params: any) {
  return request('/api/register', {
    method: 'POST',
    data: params,
  });
}

export async function accountLogin(data: any) {
  return request('/tokens', {
    method: 'POST',
    data,
  });
}

export async function getThings() {
  const token = getToken();
  if (token !== null) {
    return request('/things?offset=0&limit=99', {
      headers: {
        Authorization: token,
      },
    });
  }
}

export async function getNewestData(data: { things: string[] }) {
  return request('/api/newestData', {
    method: 'POST',
    data,
  });
}

export async function getChannels(payload: {
  publisher: string;
  startTime: string | undefined;
  endTime: string | undefined;
}) {
  const { publisher, startTime, endTime } = payload;
  let url: string = '/api/waterLevel/' + publisher;
  if (startTime !== undefined) url = url + '/' + startTime;
  if (endTime !== undefined) url = url + '/' + endTime;
  return request(url);
}
