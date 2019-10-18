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

export async function getChannelsTemp(payload: {
  publisher: string;
  startTime: string | undefined;
  endTime: string | undefined;
}) {
  const { publisher, startTime, endTime } = payload;
  let url: string = '/api/thingIdWaterLevel/' + publisher;
  if (startTime !== undefined) url = url + '/' + startTime;
  if (endTime !== undefined) url = url + '/' + endTime;
  return request(url);
}

export async function getChannelsTempOfTiangu(payload: {
  publisher: string;
  startTime: string | undefined;
  endTime: string | undefined;
}) {
  const { startTime, endTime } = payload;
  let url: string = '/api/waterLevel_for_tiangu_20191016/' + '4e2b4730-c5bc-4b1d-8fa1-b810d3aca96d';
  if (startTime !== undefined) url = url + '/' + startTime;
  if (endTime !== undefined) url = url + '/' + endTime;
  return request(url);
}

export async function getPumpStatus(payload: {
  publisher: string;
  startTime: string | undefined;
  endTime: string | undefined;
}) {
  const { publisher, startTime, endTime } = payload;
  let url: string = '/api/pumpstatus_20191016/' + publisher;
  if (startTime !== undefined) url = url + '/' + startTime;
  if (endTime !== undefined) url = url + '/' + endTime;
  return request(url);
}

export async function getPumpCurrentTrend(payload: {
  publisher: string;
  startTime: string | undefined;
  endTime: string | undefined;
}) {
  const { publisher, startTime, endTime } = payload;
  let url: string = '/api/pumpCurrent/' + publisher;
  if (startTime !== undefined) url = url + '/' + startTime;
  if (endTime !== undefined) url = url + '/' + endTime;
  return request(url);
}

export async function getHistogram(payload: {
  publisher: string;
  startTime: string | undefined;
  endTime: string | undefined;
}) {
  const { publisher, startTime, endTime } = payload;
  let url: string = '/api/histogram/' + publisher;
  if (startTime !== undefined) url = url + '/' + startTime;
  if (endTime !== undefined) url = url + '/' + endTime;
  url = url + '/20';
  return request(url);
}

export async function pumpControl(data: {target: string; pumpData: { p1: number; p2: number; p3: number; }}) {
  return request('/api/pumpControl_20191014/' + data.target, {
    method: 'POST',
    data: data.pumpData,
  });
}

export async function microServiceControl(data: string) {
  return request('/api/microServiceControl_20191015/', {
    method: 'POST',
    data: data,
  });
}
