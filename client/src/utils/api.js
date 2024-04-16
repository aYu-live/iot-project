import axios from '@/plugins/tool-axios'
const $http = axios.$http

export const getFloorList = async (data) => $http.get('/api/floor/list', data)
export const createFloorList = async (data) => $http.post('/api/floor/create', data)
export const deleteFloor = async (data) => $http.post('/api/floor/delete', data)

export const getDeviceList = async (data) => $http.get('/api/device/list', data)
export const createDeviceList = async (data) => $http.post('/api/device/create', data)
export const deleteDevice = async (data) => $http.post('/api/device/delete', data)