import request from './request'

export const homeConfigApi = {
  get: () => request.get('/home-config'),
  update: (data: any) => request.put('/home-config', data),
}

export const settingsApi = {
  get: () => request.get('/settings'),
  update: (data: any) => request.put('/settings', data),
}
