// import Qs from 'qs'
// import CryptoJS from 'crypto-js'
import { getToken, delToken } from '@/hooks/useToken'
// import { getUuid } from '@/hooks/useUuid'

type CommonObject = Record<string, unknown>

// 封装请求
// 指定后端返回的基本数据类型
export interface ResponseConfig {
  code: number
  data: CommonObject
  message: string
}

const CodeConfig = {
  /**
   * 接口错误信息
   */
  // code fail
  CodeFail: 0,
  // code success
  CodeSuc: 1,
  // request param error
  CodeParamError: 1001,
  // account is exist
  CodePhoneExist: 1002,
  // server internal error
  CodeServerError: 1003,
  // token expired
  CodeTokenExpired: 1004,
  // user not exist
  CodeUserNotExist: 1005,
  // password error
  CodePasswordError: 1006,
  // article not exist
  CodeArticleNotExist: 2000
}

// 参数排序
function sortKey(s1, s2) {
  if (s1 < s2) {
    return -1
  }
  if (s1 > s2) {
    return 1
  }
  return 0
}
// 参数排序
function getSortObj(originData) {
  const originKeys = Object.keys(originData)
  const sortKeys = originKeys.sort(sortKey)
  const sortObj = sortKeys.reduce((p, n) => {
    return { ...p, [n]: originData[n] }
  }, {})
  return sortObj
}

const defaultOption = {
  // key: () => Math.random(),
  // lazy: true,
  // baseURL: process.env.BASE_URL,
  headers: {
    Authorization: '',
    token: '',
    // ts: (+new Date() / 1000) | 0,
    // sign: '',
    // 'Content-Type': 'application/x-www-form-urlencoded',
    // deviceType: 'pc'
  }
}

const fetch = (url: string, options?: CommonObject): Promise<ResponseConfig> => {
  const { $router, $config } = useNuxtApp()
  $config
  let reqUrl = '';

  if (process.server) {
    reqUrl = $config.public.API_HOSTNAME + $config.public.API_PREFIX + url
  } else {
    // process.client
    reqUrl = $config.public.API_PREFIX + url
  }
  const p: CommonObject = {
    ...defaultOption,
    ...options
  }

  // 加密参数
  const originData = options?.body || options?.params || {}
  const sortData = getSortObj(originData)

  let paramsData = JSON.stringify(sortData)
  if (p.method === 'get') {
    Object.assign(p, { params: sortData })
  } else {
    const qsData = JSON.stringify(sortData)
    Object.assign(p, { body: qsData })
    paramsData = qsData
  }
//   const encryStr = CryptoJS.MD5(decodeURIComponent(paramsData)).toString()

  const Token = getToken()
  Object.assign(p.headers as object, {
    Authorization: Token ? `Bearer ${Token}` : '',
    token: Token || '',
    // ts: (+new Date() / 1000) | 0,
    // sign: encryStr,
    // uuid: getUuid()
  })

  return new Promise((resolve, reject) => {
    $fetch(reqUrl, p)
      .then((res) => {
        const code = (res as ResponseConfig).code || 0
        if (code === CodeConfig.CodeSuc) {
          // 成功
          resolve(res as ResponseConfig)
          return
        }

        if (code === CodeConfig.CodeTokenExpired) {
          // token过期
          delToken()
          $router.replace({ path: '/' })
          reject(res)
          return
        }

        if (code !== CodeConfig.CodeSuc) {
          reject(res)
          return
        }
      })
      .catch((err) => {
        reject(err)
      })
  })
}

export default {
  get<T = ResponseConfig>(url: string, params?: CommonObject): Promise<T> {
    return fetch(url, { method: 'get', params }) as Promise<T>
  },

  post<T = ResponseConfig>(url: string, body?: CommonObject): Promise<T> {
    return fetch(url, { method: 'post', body }) as Promise<T>
  },

  put<T = ResponseConfig>(url: string, body?: CommonObject): Promise<T> {
    return fetch(url, { method: 'put', body }) as Promise<T>
  },

  delete<T = ResponseConfig>(url: string, body?: CommonObject): Promise<T> {
    return fetch(url, { method: 'delete', body }) as Promise<T>
  }
}
