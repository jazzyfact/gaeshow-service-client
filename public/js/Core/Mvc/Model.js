import Singleton from '../Singleton/Singleton.js'
import utils from '../Singleton/utils.js'
export default class Model {
    constructor() {
        this.resStatus = null
        this.singleton = new Singleton()
    }

    // 서버와 통신하는 메소드 : GET, POST, PUT, DELETE의 메소드에 따라 request 가능
    // 만약 data가 비어있다면 header에는 빈 객체를 전송 -> GET 메소드에 사용
    sendHttpRequest = async (method, url, data) => {
        const authorization = await this.singleton.getCookie('accessToken')
        let response
        try {
            response = await fetch(url, {
                method: method,
                headers: data
                    ? {
                          'Content-Type': 'application/json',
                          'Access-Control-Allow-Origin': `${this.singleton.serverUrl}`,
                          authorization: authorization
                      }
                    : { authorization: authorization },
                body: JSON.stringify(data),
                redirect: 'follow',
                referrer: 'client',
                mode: 'cors', // no-cors, cors, *same-origin
                credentials: 'include',
                cache: 'no-cache'
            })
            // 서버에서 반환한 resStatus 저장
            this.resStatus = response.status
            if (!this.resStatus) throw `Core Model resStatus is null`
            // 서버에서 반화하는 데이터가 없으면 바로 return
            // if (response.statusText == 'No Content') return console.log('Model : 서버에서 반환하는 데이터가 없음')
            // 서버에서 fetch한 데이터가 있다면 데이터를 json으로 변환하여 반환
            // if (this.resStatus !== 204) return response.json()
            // 예외처리 진행
            // 성공 예외처리
            if (this.resStatus === 200) return response.json()
            if (this.resStatus === 201) return response.json()
            if (this.resStatus === 204) return { stats: 'ok' }
            if (this.resStatus === 206) return response.json()
            // 실패 - 클라이언트 오류
            if (this.resStatus === 400)
                response.json().then((obj) => {
                    throw `클라오류 : 유효성 검사 통과 실패 : ${obj.code} 이 없습니다`
                })
            if (this.resStatus === 401) {
                response.json().then((obj) => {
                    if (obj.code.includes('Authorization')) throw '클라오류 : Authorization 헤더키가 없음.'
                    if (obj.code.includes('no_verified')) throw '클라오류 : 확인되지 않은 사용자입니다.'
                    if (obj.code.includes('cannot')) throw `클라오류 : ${obj.code} 대한 권한이 없습니다`
                    if (obj.code.includes('signin_token_expired')) throw `클라오류 : ${obj.code} 인증 토큰이 만료 되었습니다.`
                    if (obj.code.includes('access_token_expired')) throw `클라오류 : ${obj.code} 인증 토큰이 만료 되었습니다.`
                    throw `클라오류 : 401 ${obj.code}`
                })
            }

            if (this.resStatus === 403) throw '클라오류 : 금지된 페이지 - 관리자'
            if (this.resStatus === 404) {
                console.log('404 not Found')
                return { stats: '404 Not Found' }
            }
            if (this.resStatus === 405) throw '클라오류 : http method 찾을 수 없음'
            if (this.resStatus === 408) throw '클라오류 : 요청 시간 초과'
            if (this.resStatus === 409) {
                response.json().then((obj) => {
                    if (obj.code.includes('already_exist')) {
                        console.error('클라오류 : 이미 존재(가입)')
                        return { stats: 'no' }
                    }
                    throw `클라오류 : 서버가 요청을 처리하는데 충돌이 발생함 // ${obj.code}`
                })
            }

            if (this.resStatus === 410) throw '클라오류 : 영구 사용불가능 페이지'
            if (this.resStatus === 429) throw '클라오류 : 너무 잦은 요청'
            if (this.resStatus === 451) throw '클라오류 : 법적으로 막힌 페이지'
            // 실패 서버
            if (this.resStatus === 500) throw '서버오류 : 내부 서버 오류'
            if (this.resStatus === 501) throw '서버오류 : 아직 기능 없음'
            if (this.resStatus === 502) throw '서버오류 : 클라이언트의 요청이 유실됨'
            if (this.resStatus === 503) throw '서버오류 : 서버 터짐, 디도스 or 유지 보수 중'
            if (this.resStatus === 504) throw '서버오류 : 서버 게이트웨이 문제 생겨서 시간 초과'
            if (this.resStatus === 505) throw '서버오류 : http 버전이 달라서 요청을 처리할 수 없음'
        } catch (e) {
            // 에러 생겼을 때 에러 로그 출력
            console.error(e)
            // if (e.includes('signin_token_expired')) {
            //     return 401
            // }
            return null
        }
    }
    // sendHttpRequest와 기본적으로 동일하지만, 이미지 데이터는 formData 형식으로 보내기 때문에 ,
    // sendHttpRequest에 타입을 하나 추가하는 것보다는 메서드를 구분해서 사용한다.
    sendHttpRequestForm = async (method, url, formData) => {
        const authorization = await this.singleton.getCookie('access')
        let response
        try {
            response = await fetch(url, {
                method: method,
                headers: formData
                    ? {
                          'Access-Control-Allow-Origin': `${this.singleton.serverUrl}`,
                          authorization: authorization
                      }
                    : { authorization: authorization },
                body: formData,
                redirect: 'follow',
                referrer: 'client',
                mode: 'cors', // no-cors, cors, *same-origin
                credentials: 'include',
                cache: 'no-cache'
            })
            this.resStatus = response.status
            if (!this.resStatus) throw `Core Model formData resStatus is null`
            if (this.resStatus === 200) return response.json()
            if (this.resStatus === 409) throw '이미지는 2개이상 보내지 마세요'

            response.json().then((obj) => {
                throw `예외처리 빠져나감 : ${JSON.stringify(obj)}`
            })
        } catch (e) {
            utils().snackbar('오류가 발생했습니다! 잠시 뒤 다시 시도 해주세요.')
            console.error(e)
        }
    }

    // GET request : 요청하는 페이지와 요청 정보를 파라미터로 받는다 -> 명확하게 분리하여 혼동되지 않도록
    getRequest = async (path, params = '') => {
        let query = Object.keys(params)
            .map((k) => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
            .join('&')

        return await this.sendHttpRequest('GET', this.singleton.serverUrl + path + '?' + query)
    }

    postRequest = async (path, data) => {
        return await this.sendHttpRequest('POST', this.singleton.serverUrl + path, data)
    }

    putRequest = async (path, data) => {
        // console.log(data)
        return await this.sendHttpRequest('PUT', this.singleton.serverUrl + path, data)
    }

    deleteRequest = async (path, params = '') => {
        if (params) return await this.sendHttpRequest('DELETE', this.singleton.serverUrl + path + '/' + params)
        else return await this.sendHttpRequest('DELETE', this.singleton.serverUrl + path)
    }

    postRequestFormData = async (path, formData = new FormData()) => {
        return await this.sendHttpRequestForm('POST', this.singleton.serverUrl + path, formData)
    }
}
