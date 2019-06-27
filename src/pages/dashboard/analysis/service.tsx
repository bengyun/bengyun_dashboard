import { stringify } from 'qs';
import request from 'umi-request';

export async function getData() {
  return request('/api/fake_chart_data');
}

export async function getStationsData() {
  return request('/api/stationsData');
}

export async function getPumpStatus() {
  return request('/api/pumpStatus');
}

export async function getPumpMaintain() {
  return request('/api/pumpMaintain');
}

export async function getPumpPower() {
  return request('/api/pumpPower');
}

export async function getStationDetailData(data) {
  return request(`/api/StationDetailData?${stringify(data)}`);
}
