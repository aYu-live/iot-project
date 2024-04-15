import axios from '@/plugins/tool-axios'
const $http = axios.$http

export const getFloorList = async (data) => $http.get('/api/floor/list', data)
export const createFloorList = async (data) => $http.post('/api/floor/create', data)
export const deleteFloor = async (data) => $http.post('/api/floor/delete', data)