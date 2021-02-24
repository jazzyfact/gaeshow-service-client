import checkUserModel from '../Model/checkUserModel.js'
import usersModel from '../Model/usersModel.js'
import Singleton from '../Core/Singleton/Singleton.js'

export default class naverLoginCallback {
    constructor() {
        this._checkUserModel = new checkUserModel()
        this._usersModel = new usersModel()
        this._singleton = new Singleton()

        const naverLogin = new naver.LoginWithNaverId({
            clientId: `8sQ4takhyqkQnX5zKrVT`,
            callbackUrl: `http://localhost:50001/naverlogin.html`,
            isPopup: false,
            callbackHandle: true
        })
        naverLogin.init()
        naverLogin.getLoginStatus(async (status) => {
            if (status) {
                /* (5) 필수적으로 받아야하는 프로필 정보가 있다면 callback처리 시점에 체크 */
                const { age, birthday, email, gender, id, name, nickname, profile_image } = naverLogin.user
                if (!email) {
                    alert('이메일은 필수정보입니다. 정보제공을 동의해주세요.')
                    /* (5-1) 사용자 정보 재동의를 위하여 다시 네아로 동의페이지로 이동함 */
                    naverLogin.reprompt()
                    return
                }
                if (!nickname) {
                    alert('닉네임은 필수정보입니다. 정보제공을 동의해주세요.')
                    naverLogin.reprompt()
                }

                console.log(email, nickname, profile_image, id)

                this._checkUserModel.reqData.registered_type = this._checkUserModel._typeNaver
                this._checkUserModel.reqData.unique_id = `${id}`
                this._checkUserModel.checkUser().then((e) => {
                    if (e.message == 'you_can_login') {
                        const reqData = this._usersModel.socialLoginData

                        reqData.registered_type = this._checkUserModel._typeNaver
                        reqData.unique_id = id
                        reqData.signin_token = e.signin_token
                        this._usersModel.loginUser(reqData).then((e) => {
                            this._singleton.setCookie('accessToken', e.access_token, 1)
                            this._singleton.movePage('/')
                        })
                    }
                    if (e.message == 'you_can_join') {
                        console.log('회원가입 가능')
                        const reqData = this._usersModel.signupData
                        reqData.registered_type = this._checkUserModel._typeNaver
                        reqData.profile_nickname = nickname
                        reqData.unique_id = `${id}`
                        reqData.profile_email = email
                        reqData.affiliated = 0
                        if (profile_image) reqData.profile_image_url = profile_image
                        if (gender) reqData.profile_gender = gender

                        this._singleton.setCookie('tempSign', JSON.stringify(reqData), 1)
                        this._singleton.movePage('/terms.html?t=g')
                    }
                })

                // window.location.replace("http://" + window.location.hostname + ((location.port == "" || location.port == undefined) ? "" : ":" + location.port) + "/sample/main.html");
            } else {
                console.log('callback 처리에 실패하였습니다.')
            }
        })
    }
}
