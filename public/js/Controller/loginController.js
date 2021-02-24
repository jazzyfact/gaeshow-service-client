import Singleton from '../Core/Singleton/Singleton.js'
import View from '../Core/Mvc/View.js'
import utils from '../Core/Singleton/utils.js'
import checkUserModel from '../Model/checkUserModel.js'
import usersModel from '../Model/usersModel.js'

export default class loginController {
    // 생성자
    constructor() {
        this._singleton = new Singleton()
        this._View = new View()
        this._checkUserModel = new checkUserModel()
        this._usersModel = new usersModel()
        this._kakaoInit = false
        this._firebaseInit = false
        // this.usersView = new usersView()
        // this.usersController = new usersController() // 왜 새로 생성해요?

        this.bindEvent()
        // console.log(window.location.origin)

        // const naverLogin = new naver.LoginWithNaverId({
        //     clientId: `8sQ4takhyqkQnX5zKrVT`,
        //     callbackUrl: `http://gaeshow.co.kr/naverlogin.html`,
        //     isPopup: false,
        //     loginButton: { color: 'green', type: 3, height: 50 }
        // })
        // naverLogin.init()
    }
    bindEvent = () => {
        //로그인 버튼
        const loginBtn = this._View.getElement('#loginBtn')
        loginBtn.onclick = () => this.loginUser()
        // 구글 로그인
        const googleBtn = this._View.getElement(`#googleBtn`)
        googleBtn.onclick = () => this.googleLogin()
        // 깃허브 로그인
        // const githubBtn = this._View.getElement(`#githubBtn`)
        // githubBtn.onclick = () => this.githubLogin()
        // 카카오 로그인
        const kakaoBtn = this._View.getElement(`#kakaoBtn`)
        kakaoBtn.onclick = () => this.kakaoLogin()
        // 네이버 로그인
        // const naverBtn = this._View.getElement(`#naverBtn`)
        // naverBtn.onclick = () => this.naverLogin()
    }
    // 로그인 시도
    loginUser = async () => {
        // 입력값 가져오기
        const inputEmail = this._View.getElement('#email').value
        const inputPassword = this._View.getElement('#password').value
        // 예외 처리
        if (!inputEmail) {
            utils().snackbar('이메일을 입력 해 주세요')
            return
        }
        if (!utils().emailChecker(inputEmail)) {
            utils().snackbar('정확한 이메일을 입력해주세요')
            return
        }
        if (!inputPassword) {
            utils().snackbar('패스워드를 입력 해 주세요')
            return
        }

        const checkData = await this.checkUserEmail(inputEmail)
        if (!checkData) utils().snackbar('잠시 뒤 다시 요청해주세요.')
        if (checkData.message !== 'you_can_login') {
            utils().snackbar('이메일 / 패스워드를 확인해주세요.')
            return
        }
        // 로그인 시작
        // 필수 정보
        // registered_type, device_os, signin_token, password, profile_email
        this._usersModel.emailLoginData.profile_email = inputEmail
        this._usersModel.emailLoginData.password = inputPassword
        this._usersModel.emailLoginData.signin_token = checkData.signin_token

        await this.startLogin(this._usersModel.emailLoginData)
    }
    //구글 로그인 api 연동
    googleLogin = async () => {
        // Initialize Firebase
        if (!firebase.apps.length && !this._firebaseInit) {
            // 소셜 로그인 초기화
            const firebaseConfig = {
                apiKey: 'AIzaSyA5BCCgdqF9Ju7sm0XixX1LCVo_wl2932w',
                authDomain: 'gaeshow-293809.firebaseapp.com',
                databaseURL: 'https://gaeshow-293809.firebaseio.com',
                projectId: 'gaeshow-293809',
                storageBucket: 'gaeshow-293809.appspot.com',
                messagingSenderId: '229317958263',
                appId: '1:229317958263:web:69a07abdc92819b4a28472',
                measurementId: 'G-S7T6YV8LV3'
            }
            firebase.initializeApp(firebaseConfig)
            this._firebaseInit = true
        }
        const provider = new firebase.auth.GoogleAuthProvider()
        try {
            const firebaseResult = await firebase.auth().signInWithPopup(provider)
            const { displayName, email } = firebaseResult.user
            const { id, picture } = firebaseResult.additionalUserInfo.profile
            const checkData = await this.checkUserSocial(id, this._checkUserModel._typeGoogle)
            // console.log(checkData)

            if (!checkData) utils().snackbar('잠시 뒤 다시 요청해주세요.')
            if (checkData.message === 'you_can_login') {
                const reqData = this._usersModel.socialLoginData

                reqData.registered_type = this._checkUserModel._typeGoogle
                reqData.unique_id = id
                reqData.signin_token = checkData.signin_token

                await this.startLogin(reqData)
            }
            if (checkData.message === 'you_can_join') {
                // console.log('회원가입 가능')
                // 회원 가입 진행
                const reqData = this._usersModel.signupData
                reqData.registered_type = this._checkUserModel._typeGoogle
                reqData.profile_nickname = encodeURI(displayName.replace(/ /g, ''))
                reqData.unique_id = `${id}`
                reqData.profile_email = email
                reqData.affiliated = 0
                reqData.profile_image_url = picture
                const str = JSON.stringify(reqData)
                this._singleton.deleteCookie('tempSign')
                this._singleton.setCookie('tempSign', encodeURI(str), 1)
                this._singleton.movePage('/terms.html?t=g')
            }
        } catch (e) {
            console.log(e)
        }
    }

    //깃허브 로그인api 연동
    // githubLogin = async () => {
    //     var provider = new firebase.auth.GithubAuthProvider()

    //     try {
    //         const firebaseResult = await firebase.auth().signInWithPopup(provider)
    //         const { email, photoURL } = firebaseResult.user
    //         const { id, html_url } = firebaseResult.additionalUserInfo.profile
    //         const { username } = firebaseResult.additionalUserInfo
    //         const checkData = await this.checkUserSocial(id, this._checkUserModel._typeGithub)
    //         if (!checkData) utils().snackbar('잠시 뒤 다시 요청해주세요.')
    //         if (checkData.message === 'you_can_login') {
    //             const reqData = this._usersModel.socialLoginData

    //             reqData.registered_type = this._checkUserModel._typeGithub
    //             reqData.unique_id = id
    //             reqData.signin_token = checkData.signin_token
    //             reqData.profile_image_url = photoURL
    //             reqData.github_url = html_url

    //             await this.startLogin(reqData)
    //         }
    //         if (checkData.message === 'you_can_join') {
    //             console.log('회원가입 가능')
    //             // 회원 가입 진행
    //             const reqData = this._usersModel.signupData
    //             reqData.registered_type = this._checkUserModel._typeGithub
    //             reqData.profile_nickname = encodeURI(username.replace(/ /g, ''))
    //             reqData.push_status = 0
    //             reqData.unique_id = `${id}`
    //             reqData.profile_email = email
    //             reqData.affiliated = 0
    //             reqData.is_information_open = 0
    //             // 회원가입 요청
    //             const resData = await this._usersModel.signup(reqData)
    //             console.log(resData)
    //             if (!resData.user_id) {
    //                 utils().snackbar('Github 로그인 실패')
    //                 return
    //             }

    //             this._singleton.setCookie('accessToken', resData.access_token, 1)
    //             // this._singleton.setCookie('email',inputEmail, 1)
    //             this._singleton.movePage('/')
    //         }
    //     } catch (e) {
    //         console.log(e)
    //         if (e.code === 'auth/account-exists-with-different-credential') {
    //             utils().snackbar('해당 이메일은 다른 소셜 계정으로 회원가입이 되어 있습니다.')
    //             return
    //         }
    //         utils().snackbar('Github 로그인 실패')
    //     }
    // }

    // 카카오 로그인
    kakaoLogin = async () => {
        if (!this._kakaoInit) {
            Kakao.init('765b041e5029dffa9e27aeb1d012c426')
            this._kakaoInit = true
        }

        const checkUser = this.checkUserSocial
        const checkUserModel = this._checkUserModel
        const startLogin = this.startLogin
        const userModel = this._usersModel
        const single = this._singleton

        Kakao.Auth.login({
            success: function (authObj) {
                console.log(authObj)
                Kakao.API.request({
                    url: '/v2/user/me',
                    success: (res) => {
                        // console.log(res)
                        const { id, kakao_account, properties } = res
                        const { nickname, profile_image } = properties
                        const { email, gender } = kakao_account

                        checkUser(id, 'kakao').then((e) => {
                            if (e.message == 'you_can_login') {
                                const reqData = userModel.socialLoginData

                                reqData.registered_type = checkUserModel._typeKakao
                                reqData.unique_id = `${id}`
                                reqData.signin_token = e.signin_token
                                startLogin(reqData)
                            }
                            if (e.message == 'you_can_join') {
                                console.log('회원가입 가능')
                                const reqData = userModel.signupData
                                reqData.registered_type = 'kakao'
                                reqData.profile_nickname = encodeURI(nickname.replace(/ /g, ''))
                                reqData.unique_id = `${id}`
                                reqData.profile_email = email
                                reqData.affiliated = 0
                                reqData.profile_image_url = profile_image
                                if (gender) reqData.profile_gender = gender == 'male' ? 'M' : 'W'

                                single.setCookie('tempSign', JSON.stringify(reqData), 1)
                                single.movePage('/terms.html?t=k')
                            }
                        })
                    },
                    fail: function (error) {
                        console.error(error)
                    }
                })
            },
            fail: function (err) {
                // alert(JSON.stringify(err))
            }
        })

        // Kakao.Auth.login({
        //     success: function (authObj) {
        //         alert(JSON.stringify(authObj))
        //     },
        //     fail: function (err) {
        //         alert(JSON.stringify(err))
        //     }
        // })
    }
    naverLogin = async () => {}

    checkUserEmail = async (email) => {
        this._checkUserModel.reqData.registered_type = this._checkUserModel._typeEmail
        this._checkUserModel.reqData.profile_email = email

        const checkData = await this._checkUserModel.checkUser()
        console.log(checkData)
        return checkData
    }
    checkUserSocial = async (id, type) => {
        this._checkUserModel.reqData.registered_type = type
        this._checkUserModel.reqData.unique_id = `${id}`
        const checkData = await this._checkUserModel.checkUser()
        console.log(checkData)
        return checkData
    }

    startLogin = async (reqData) => {
        // console.log('startLogin', reqData)
        try {
            const resData = await this._usersModel.loginUser(reqData)
            if (!resData.access_token) {
                utils().snackbar('이메일 / 패스워드를 확인해주세요.')
                return
            }
            if (!resData.user) {
                utils().snackbar('이메일 / 패스워드를 확인해주세요.')
                return
            }
            if (!resData) {
                utils().snackbar('이메일 / 패스워드를 확인해주세요.')
                return
            }
            // signToken, eamil , access_token 쿠키 저장.
            this._singleton.setCookie('accessToken', resData.access_token, 1)
            // this._singleton.setCookie('email',inputEmail, 1)
            const pathData = this._singleton.getCookie('paths')
            let pathList
            if (pathData) {
                pathList = JSON.parse(pathData)
                const path = this.getMovePath(pathList, pathList.length - 1)
                this._singleton.movePage(decodeURI(path))
            } else {
                this._singleton.movePage('/')
            }
        } catch (e) {
            utils().snackbar('이메일 / 패스워드를 확인해주세요.')
        }
    }

    getMovePath = (data, i = 0) => {
        const path = data[i]
        if (!path) return '/'
        else if (path == '/login.html') return this.getMovePath(data, i - 1)
        else return path
    }
}
