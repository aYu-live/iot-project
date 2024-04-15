import axios from 'axios'
import { Modal } from 'ant-design-vue'
import { computed, h, ref } from 'vue'
import Qs from 'qs'

const loadingNum = ref(0)
const loading = computed(() => {
    return loadingNum.value > 0
})
const $http = {}

const CONFIG = {
    TIMEOUT: 20000,
    METHODS: ['get', 'put', 'post', 'delete'],
    WITH_PARAMS_METHODS: ['get', 'delete']
}

function getCsrfToken () {
    const reg = /.*csrfToken=([^;.]*).*$/
    const cookies = document.cookie.match(reg)
    return cookies ? cookies[1] : null
}

const defaultFn = {
    generator (config) {
        return axios(config)
    },

    transformRequest ({ url, method, headers, data, timeout, withCredentials }) {
        const config = {
            url,
            method,
            timeout,
            withCredentials,
            headers: {
                'X-Csrf-Token': getCsrfToken(),
                'X-Requested-With': 'XMLHttpRequest',
                'Content-Type': 'application/json; charset=utf-8',
                ...headers
            }
        }
        if (CONFIG.WITH_PARAMS_METHODS.includes(method)) {
            config.params = data
        } else {
            config.data = data
        }
        return config
    },

    transformResponse (response) {
        return response.data
            ? response.data
            : {
                code: response.status || 500,
                data: response.statusText || {},
                message: response.statusText || '[tool-axios] Network Error'
            }
    },

    checkFail ({ code }) {
        return code !== 200
    },

    // 请求报错弹出提示框
    failFn (url, res) {
        const content = typeof res.message === 'string' ? res.message : JSON.stringify(res.message || {}) || '网络错误，请稍后再试'
        Modal.error({
            title: content,
            content: h('span', { style: 'color: #8c8c8c;' }, url)
        })
    }
}

const install = (app, options = {}) => {
    const {
        timeout: _timeout = CONFIG.TIMEOUT,
        methods = CONFIG.METHODS,
        target = $http,
        headers = {},
        generator = defaultFn.generator,
        transformRequest = defaultFn.transformRequest,
        transformResponse = defaultFn.transformResponse,
        checkFail = defaultFn.checkFail,
        failFn = defaultFn.failFn,
        successFn
    } = options

    methods.forEach((method) => {
        target[method] = (url, data, options = {}) => {
            const {
                timeout = _timeout,
                headers: _headers = {}, // Headers unique to each method
                withCredentials = false
            } = options

            const config = transformRequest({
                url, method, data, timeout, withCredentials, headers: { ...headers, ..._headers }
            })

            return Promise.resolve(generator(config)).then((response = {}) => {
                const res = transformResponse(response)
                if (checkFail(res)) {
                    failFn && failFn(url, res)
                    return Promise.reject(res)
                } else {
                    successFn && successFn(url, res.data)
                    return res.data
                }
            })
        }
    })
    app.provide('$http', target)
}

axios.interceptors.request.use(config => {
    // get请求序列化
    if (config.method.toLowerCase() === 'get' && config.params) {
        config.paramsSerializer = function (params) {
            return Qs.stringify(params)
        }
    }
    // 请求数量计数
    loadingNum.value++
    return config
}, error => Promise.reject(error))
axios.interceptors.response.use(response => {
    loadingNum.value--
    return response
}, error => {
    loadingNum.value--
    return Promise.resolve(error.response || error)
})

export default {
    $http,
    install,
    loading
}
