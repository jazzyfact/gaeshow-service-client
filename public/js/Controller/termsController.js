// 회원 가입 전, 이용 약관에 동의하는 페이지의 컨트롤러
import View from '../Core/Mvc/View.js'
import utils from '../Core/Singleton/utils.js'
import singleton from '../Core/Singleton/Singleton.js'
import usersModel from '../Model/usersModel.js'

const typeGoogle = 'g'
const typeKakao = 'k'
const typeNaver = 'n'
const typeNative = 'd'
export default class termsController {
    constructor() {
        this._signType
        // 회원가입 타입 선택
        switch (utils().getParameterByName('t')) {
            case typeGoogle:
                this._signType = typeGoogle
                break
            case typeKakao:
                this._signType = typeKakao
                break
            case typeNaver:
                this._signType = typeNaver
                break
            default:
                this._signType = typeNative
                break
        }

        // 선택 동의 불리언 값
        this._profile = false //프로필 이용 정보
        this._AD = false // 광고 수신 동의
        this._use = false // 서비스 이용 약관
        this._private = false // 개인 정보 수입 및 처리 방침
        this._all = false
        // 이미지 버튼들
        this._profileBtn
        this._ADBtn
        this._useBtn
        this._privateBtn
        this._allBtn
        // 코어 호출
        this._View = new View()
        this._singleton = new singleton()
        this._usersModel = new usersModel()
        // 회원 가입 타입에 따라서 저장해둔 정보를 string -> object화 시켜줌
        if (this._signType != typeNative) {
            // 쿠키에 저장해둔 정보 가지고 옴
            const getSignData = this._singleton.getCookie('tempSign')
            this._tempSignData = JSON.parse(decodeURI(getSignData))

            console.log(this._tempSignData)
        }

        // 클릭 이벤트 바인딩
        this.clickEvent()
    }

    // 모든 클릭 이벤트 관리
    clickEvent = () => {
        // 프로필 정보 추가 수집 동의 버튼
        this._profileBtn = this._View.getElement(`#profileBtn`)
        // 광고성 정보 수신 동의
        this._ADBtn = this._View.getElement(`#ADBtn`)
        // 서비스 이용약관 동의
        this._useBtn = this._View.getElement(`#useBtn`)
        //개인 정보 수집 및 처리 방침
        this._privateBtn = this._View.getElement(`#privateBtn`)
        // 모두 동의하기
        this._allBtn = this._View.getElement(`#allBtn`)
        // 회원 가입 하기 버튼
        this._signupBtn = this._View.getElement(`#signupBtn`)

        const wrap1 = this._View.getElement('#profileWrap')
        const wrap2 = this._View.getElement('#addWrap')
        const wrap3 = this._View.getElement('#serviceWrap')
        const wrap4 = this._View.getElement('#privateWrap')
        const wrap5 = this._View.getElement('#allWrap')

        wrap1.onclick = () => this.btnImageChange(this._profileBtn, 'profile')
        wrap2.onclick = () => this.btnImageChange(this._ADBtn, 'ad')
        wrap3.onclick = () => this.btnImageChange(this._useBtn, 'use')
        wrap4.onclick = () => this.btnImageChange(this._privateBtn, 'private')
        wrap5.onclick = () => this.btnImageChange(null, 'all')

        this._signupBtn.onclick = () => this.signupBtnEnvet()
    }
    // 버튼을 클릭 했을때 이미지 아이콘을 바꿔주는 함수
    // element : 이미지 element
    // type : 동의 타입 분기
    btnImageChange = (element, type) => {
        const checkImg = './res/img/icon_check.svg'
        const unCheckImg = './res/img/icon_check_df.svg'

        switch (type) {
            case `profile`:
                this._profile = !this._profile
                const title = this._View.getElementsByTagName('h4', this._profileBtn.parentNode)[0]
                if (this._profile) {
                    element.src = checkImg
                    title.style.color = 'black'
                } else {
                    element.src = unCheckImg
                    title.style.color = '#a9a9a9'
                }
                // 전체 동의 감지
                if (this._private && this._AD && this._use && this._private) this.btnImageChange(null, 'all')
                break
            case `ad`:
                this._AD = !this._AD
                const title1 = this._View.getElementsByTagName('h4', this._ADBtn.parentNode)[0]
                if (this._AD) {
                    element.src = checkImg
                    title1.style.color = 'black'
                } else {
                    element.src = unCheckImg
                    title1.style.color = '#a9a9a9'
                }
                if (this._private && this._AD && this._use && this._private) this.btnImageChange(null, 'all')
                break
            case `use`:
                this._use = !this._use
                const title2 = this._View.getElementsByTagName('h4', this._useBtn.parentNode)[0]
                if (this._use) {
                    element.src = checkImg
                    title2.style.color = 'black'
                } else {
                    element.src = unCheckImg
                    title2.style.color = '#a9a9a9'
                }
                if (this._private && this._AD && this._use && this._private) this.btnImageChange(null, 'all')
                break
            case `private`:
                this._private = !this._private
                const title3 = this._View.getElementsByTagName('h4', this._privateBtn.parentNode)[0]
                if (this._private) {
                    element.src = checkImg
                    title3.style.color = 'black'
                } else {
                    element.src = unCheckImg
                    title3.style.color = '#a9a9a9'
                }
                if (this._private && this._AD && this._use && this._private) this.btnImageChange(null, 'all')
                break
            case `all`:
                this._all = !this._all
                if (!this._all) {
                    this._profile = false
                    this._AD = false
                    this._use = false
                    this._private = false
                } else {
                    this._profile = true
                    this._AD = true
                    this._use = true
                    this._private = true
                }

                let allTitle
                allTitle = this._View.getElementsByTagName('h4', this._profileBtn.parentNode)[0]
                if (this._profile) {
                    this._profileBtn.src = checkImg
                    allTitle.style.color = 'black'
                } else {
                    this._profileBtn.src = unCheckImg
                    allTitle.style.color = '#a9a9a9'
                }
                allTitle = this._View.getElementsByTagName('h4', this._ADBtn.parentNode)[0]
                if (this._AD) {
                    this._ADBtn.src = checkImg
                    allTitle.style.color = 'black'
                } else {
                    this._ADBtn.src = unCheckImg
                    allTitle.style.color = '#a9a9a9'
                }
                allTitle = this._View.getElementsByTagName('h4', this._useBtn.parentNode)[0]
                if (this._use) {
                    this._useBtn.src = checkImg
                    allTitle.style.color = 'black'
                } else {
                    this._useBtn.src = unCheckImg
                    allTitle.style.color = '#a9a9a9'
                }
                allTitle = this._View.getElementsByTagName('h4', this._privateBtn.parentNode)[0]
                if (this._private) {
                    this._privateBtn.src = checkImg
                    allTitle.style.color = 'black'
                } else {
                    this._privateBtn.src = unCheckImg
                    allTitle.style.color = '#a9a9a9'
                }
                allTitle = this._View.getElementsByTagName('h4', this._allBtn.parentNode)[0]
                if (this._all) {
                    this._allBtn.src = checkImg
                    allTitle.style.color = 'black'
                } else {
                    this._allBtn.src = unCheckImg
                    allTitle.style.color = '#a9a9a9'
                }
                break
            default:
                console.error('btnImageChange', '잘못된 type 요청')
                break
        }
    }

    // 회원 가입 하기 버튼 클릭 이벤트
    signupBtnEnvet = async () => {
        // 필수 동의 체크
        if (!this._profile) {
            utils().snackbar(`프로필정보 추가 수집 동의 하셔야 회원 가입이 가능합니다.`)
            return
        }
        if (!this._AD) {
            utils().snackbar(`광고성 정보 수신 동의 하셔야 회원 가입이 가능합니다.`)
            return
        }
        if (!this._use) {
            utils().snackbar(`서비스 이용약관에 동의 하셔야 회원 가입이 가능합니다.`)
            return
        }
        if (!this._private) {
            utils().snackbar(`개인정보 수집 및 처리방침에 동의 하셔야 회원 가입이 가능합니다.`)
            return
        }

        // 네이티브 회원 가입만 이렇게
        if (this._signType == typeNative) {
            this.goSignupPage()
            return
        }
        // 소셜 회원가입 시 약관 동의 넣기
        // agree 라는 항목은 아직 마정으로 나중에 바꿔주면 됨.
        this._tempSignData['agree_1'] = this._profile ? 1 : 0
        this._tempSignData.push_status = this._AD ? 1 : 0
        this._tempSignData.agree_2 = this._use ? 1 : 0
        this._tempSignData.agree_3 = this._private ? 1 : 0
        this._tempSignData.is_information_open = 0

        // 구글
        if (this._signType == typeGoogle) {
            this._tempSignData.registered_type = 'gmail'
            this._tempSignData.profile_nickname = decodeURI(this._tempSignData.profile_nickname)

            // console.log(this._tempSignData)
            // 회원가입 진행
            const resData = await this._usersModel.signup(this._tempSignData)
            if (!resData.user_id) {
                utils().snackbar('Google 회원가입 실패')
                return
            }

            this._singleton.deleteCookie('tempSign')

            this.autoLogin(this._tempSignData.registered_type, this._tempSignData.unique_id, resData.signin_token)
        }
        // 카카오
        if (this._signType == typeKakao) {
            this._tempSignData.registered_type = 'kakao'
            this._tempSignData.profile_nickname = decodeURI(this._tempSignData.profile_nickname)
            // 회원가입 진행
            const resData = await this._usersModel.signup(this._tempSignData)
            if (!resData.user_id) {
                utils().snackbar('Kakao 회원가입 실패')
                return
            }
            this._singleton.deleteCookie('tempSign')
            this.autoLogin(this._tempSignData.registered_type, this._tempSignData.unique_id, resData.signin_token)
        }
        // 네이버
        if (this._signType == typeNaver) {
            this._tempSignData.registered_type = 'naver'
            this._tempSignData.profile_nickname = decodeURI(this._tempSignData.profile_nickname)
            // 회원가입 진행
            const resData = await this._usersModel.signup(this._tempSignData)
            if (!resData.user_id) {
                utils().snackbar('Naver 회원가입 실패')
                return
            }

            this._singleton.deleteCookie('tempSign')
            this.autoLogin(this._tempSignData.registered_type, this._tempSignData.unique_id, resData.signin_token)
        }
    }

    // 자동 로그인
    autoLogin = async (type, unique_id, signin_token) => {
        const reqData = this._usersModel.socialLoginData

        reqData.registered_type = type
        reqData.unique_id = unique_id
        reqData.signin_token = signin_token

        const resData = await this._usersModel.loginUser(reqData)
        // signToken, eamil , access_token 쿠키 저장.
        this._singleton.setCookie('accessToken', resData.access_token, 1)
        // this._singleton.setCookie('email',inputEmail, 1)
        this._singleton.movePage('/mypage__edit.html?t=s')
    }
    // 회원 가입 페이지로 이동하는 펑션
    goSignupPage = () => {
        window.location.href = '/signup.html'
    }
}
