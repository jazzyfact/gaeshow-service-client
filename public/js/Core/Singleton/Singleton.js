export default class Singleton {
    constructor() {
     
        this.serverUrl = ''
    }
    //네트워크 에러
    networkErrorLog = (fileName, methodName, resStatus, res) => {
        return console.error(`${fileName}.js ${methodName}() : http status => ${resStatus}, resCode => ${res.code}`)
    }
    //쿠키저장(이름, 쿠키 값, 쿠키 만료일)
    setCookie = async (name, value, day) => {
        const date = new Date()
        date.setTime(date.getTime() + day * 60 * 60 * 24 * 1000)
        document.cookie = name + '=' + value + ';expires=' + date.toUTCString() + ';path=/'
    }
    //쿠키 가져오기
    getCookie = function (name) {
        const value = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)')
        return value ? value[2] : null
    }
    //쿠키 삭제
    deleteCookie = function (name) {
        const date = new Date()
        document.cookie = name + '= ' + '; expires=' + date.toUTCString() + '; path=/'
    }
    // 화면 이동
    movePage = (url) => {
        window.location.href = url
    }
}
