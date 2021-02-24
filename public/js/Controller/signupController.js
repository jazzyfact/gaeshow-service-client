import View from '../Core/Mvc/View.js'
import utils from '../Core/Singleton/utils.js'
import dialog from '../View/dialog.js'
import usersModel from '../Model/usersModel.js'
import categoryModel from '../Model/categoryModel.js'
import checkUserModel from '../Model/checkUserModel.js'
import Singleton from '../Core/Singleton/Singleton.js'

export default class signupController {
    constructor() {
        this._View = new View()
        this._dialogView = new dialog()
        this._usersModel = new usersModel()
        this._categoryModel = new categoryModel()
        this._checkUserModel = new checkUserModel()
        this._singleTon = new Singleton()

        // 스텝 1 파라미터
        this._email
        this._pw
        this._pw2
        this._nick
        this._profileImgIdx
        this._profileUrl
        this._checkNickname = false
        // 스텝 2 파라미터
        this._birthday
        this._job
        this._jobCategory
        this._gender
        this._period
        this._workingPlace
        this._workingDetailPlace
        this._pay
        this._continuePeriod
        this._developLang = []
        this._developIde = []
        // 기타
        this._pushState = 1
        this._deviceOs = 'W'
        this._affiliated = 0
        this._isInfoOpen

        this.eventBind()
        this.getJobData()
    }

    eventBind = () => {
        // 스텝 1
        const profileInput = this._View.getElement(`#profileInput`)
        const profileImg = this._View.getElement(`#profileImg`)
        const nextBtn = this._View.getElement(`#nextBtn`)
        const nickInput = this._View.getElement(`#nick`)

        //닉네임 중복 체크
        nickInput.addEventListener('blur', () => this.nicknameChecker())
        nextBtn.onclick = () => this.goStepTwo()
        profileInput.onchange = () => this.imageFileUpload(profileInput)
        profileImg.onclick = () => this.imageFileDelete()
        // 스텝 2
        this._birthdayInput = this._View.getElement(`#birthday`)
        this._jobSelector = this._View.getElement('#jobSelector')
        this._jobDetailSelector = this._View.getElement('#jobDetailSelector')
        this._man = this._View.getElement('#man')
        this._woman = this._View.getElement('#woman')
        this._workingPlaceSelect = this._View.getElement('#workingPlaceSelector')
        this._workingDetialPlaceWrapper = this._View.getElement('#workingDetailPlace')
        this._workingDetialPlaceSelect = this._View.getElement('#workingDetailPlaceSelector')
        this._periodSelector = this._View.getElement('#periodSelector')
        this._continuePeriodSelector = this._View.getElement('#continuePeriodSelector')
        this._payInput = this._View.getElement('#payInput')
        this._portfolioInput = this._View.getElement('#portfolioUrlInput')
        this._githubUrlInput = this._View.getElement('#githubUrlInput')
        this._addLang = this._View.getElement('#addLang')
        this._addIde = this._View.getElement('#addIde')
        this._signupBtn = this._View.getElement('#signupBtn')
        this._infoOpenCheck = this._View.getElement('#infoOpen')
        // 플랫 피커 라이브러리 적용
        flatpickr(this._birthdayInput, {})
        this._man.onclick = () => this.genderSelector('man')
        this._woman.onclick = () => this.genderSelector('woman')
        this._workingPlaceSelect.onchange = () => this.changeWorkingPlace()
        this._workingDetialPlaceSelect.onchange = () => this.changeDetailWrokingPlace()
        this._addLang.onclick = () => this.clickAddLang()
        this._addIde.onclick = () => this.clickAddIde()
        this._signupBtn.onclick = () => this.modInfoStart()
    }
    // 스텝 2에 사용할 직종 데이터를 서버에 요청함.
    getJobData = async () => {
        const resData = await this._categoryModel.getJob()
        // 받은 데이터로 셀렉트 값 넣어주기
        resData.map((item) => {
            const tempItem = document.createElement('option')
            tempItem.innerHTML = item.ko_name
            tempItem.value = item.id
            this._jobSelector.appendChild(tempItem)
        })
        this._jobSelector.onchange = () => {
            const jobDataIndex = resData.findIndex((e) => {
                if (e.id == this._jobSelector.value) return true
            })

            if (resData[jobDataIndex].job_field) {
                while (this._jobDetailSelector.hasChildNodes()) {
                    this._jobDetailSelector.removeChild(this._jobDetailSelector.firstChild)
                }
                resData[jobDataIndex].job_field.map((e) => {
                    const tempItem = document.createElement('option')
                    tempItem.innerHTML = e.ko_name
                    tempItem.value = e.id
                    this._jobDetailSelector.appendChild(tempItem)
                })
            }
        }
        // console.log(resData)
    }
    nicknameChecker = async () => {
        const err = this._View.getElement('#nickChecker')
        if (!this._View.getElement(`#nick`).value) {
            err.innerHTML = ''
            this._checkNickname = false
            return
        }
        const reqData = { profile_nickname: this._View.getElement(`#nick`).value }

        const resData = await this._usersModel.checkNickname(reqData)

        if (!resData) {
            err.innerHTML = '이미 존재하는 닉네임입니다.'
            this._checkNickname = false
        } else {
            err.innerHTML = ''
            this._checkNickname = true
        }
    }
    // 프로필 이미지 추가하기
    imageFileUpload = async (element) => {
        const imgFiles = element.files
        // 예외처리
        if (!imgFiles || imgFiles.lenth === 0) {
            utils().snackbar(`이미지 파일을 선택해주세요.`)
            return
        }

        // 파일 정보 파싱
        const { name, lastModified, size, type } = imgFiles[0]
        const imgUrl = URL.createObjectURL(imgFiles[0])
        // 이미지 업로드 진행
        // console.log(imgFiles[0])
        const resData = await this._usersModel.profileImgUpload(imgFiles[0], name)
        // 리스폰 데이터 성공
        const { attach_id, file_path } = resData[0]
        this._profileImgIdx = attach_id
        this._profileUrl = file_path

        // 클라 화면에 이미지 배치
        const profileImg = this._View.getElement(`#profileImg`)
        profileImg.src = imgUrl
        profileImg.classList.remove('hidden')

        const profileLabel = this._View.getElement(`#profileLabel`)
        profileLabel.classList.add('hidden')
    }
    // 프로필 이미지 삭제
    imageFileDelete = async () => {
        this._profileImgIdx = null
        this._profileUrl = null

        const profileImg = this._View.getElement(`#profileImg`)
        profileImg.classList.add('hidden')

        const profileLabel = this._View.getElement(`#profileLabel`)
        profileLabel.classList.remove('hidden')
    }
    // 남성 여성 선택
    genderSelector = (type) => {
        if (type === 'man') {
            this._man.classList.add('focus')
            this._woman.classList.remove('focus')
            this._gender = 'M'
        } else {
            this._man.classList.remove('focus')
            this._woman.classList.add('focus')
            this._gender = 'W'
        }
    }
    // 근무 지역 선택
    changeWorkingPlace = () => {
        // 서울 특별시 선택시 세부 사항 선택까지 확장
        if (this._workingPlaceSelect.value === '서울특별시') {
            this._workingDetialPlaceWrapper.classList.remove('hidden')
        } else {
            this._workingDetialPlaceWrapper.classList.add('hidden')
            this._workingDetialPlace = null
        }
        this._workingPlace = this._workingPlaceSelect.value
        this._workingDetialPlace = this._workingDetialPlaceSelect.value
    }
    // 언어 선택 추가
    clickAddLang = () => {
        const dialogView = this._dialogView.langSelectDialog()
        document.body.appendChild(dialogView)
        // 버튼 찾기
        const button = dialogView.getElementsByTagName('button')
        button[0].onclick = () => this.clickSelectLang(dialogView)
    }
    // 언어 선택 완료 이벤트
    clickSelectLang = (dialog) => {
        const selectData = this._dialogView.langSelectData
        // this._developLang = this._developLang.concat(selectData)
        const tempArr = this._developLang.concat(selectData)
        this._developLang = tempArr.filter((item, i) => {
            return (
                tempArr.findIndex((item2, j) => {
                    return item.name === item2.name
                }) === i
            )
        })
        // console.log(selectData, this._developLang)
        // 화면 추가
        const langWrapper = this._View.getElement('#langItemWrapper')
        selectData.map((item) => {
            // const element = document.createElement('p')
            // element.classList.add('input__signup--subbox--item')
            // element.innerHTML = item.name
            // langWrapper.appendChild(element)
            let go = true
            for (let i = 0; i <= langWrapper.childNodes.length; i++) {
                try {
                    if (langWrapper.childNodes[i].innerHTML == item.name) go = false
                } catch (e) {}
            }
            if (go) {
                const element = document.createElement('p')
                element.classList.add('input__signup--subbox--item')
                element.innerHTML = item.name
                element.onclick = (e) => {
                    e.stopPropagation()
                    this._developIde = this._developIde.filter((e) => {
                        return e.name != item.name
                    })
                    element.parentNode.removeChild(element)
                }
                langWrapper.appendChild(element)
            }
        })
        dialog.parentNode.removeChild(dialog)
        this._dialogView.langSelectData = []
    }
    // ide선택 추가
    clickAddIde = () => {
        const dialogView = this._dialogView.ideSelectDialog()
        document.body.appendChild(dialogView)

        const button = dialogView.getElementsByTagName('button')
        button[0].onclick = () => this.clickSelectIde(dialogView)
    }
    clickSelectIde = (dialog) => {
        const selectData = this._dialogView.ideSelectData

        const tempArr = this._developIde.concat(selectData)
        this._developIde = tempArr.filter((item, i) => {
            return (
                tempArr.findIndex((item2, j) => {
                    return item.name === item2.name
                }) === i
            )
        })
        // 화면 추가
        const langWrapper = this._View.getElement('#ideItemWrapper')
        selectData.map((item) => {
            // const element = document.createElement('p')
            // element.classList.add('input__signup--subbox--item')
            // element.innerHTML = item.name
            // langWrapper.appendChild(element)
            let go = true
            for (let i = 0; i <= langWrapper.childNodes.length; i++) {
                try {
                    if (langWrapper.childNodes[i].innerHTML == item.name) go = false
                } catch (e) {}
            }
            if (go) {
                const element = document.createElement('p')
                element.classList.add('input__signup--subbox--item')
                element.innerHTML = item.name
                element.onclick = (e) => {
                    e.stopPropagation()
                    this._developIde = this._developIde.filter((e) => {
                        return e.name != item.name
                    })
                    element.parentNode.removeChild(element)
                }
                langWrapper.appendChild(element)
            }
        })
        dialog.parentNode.removeChild(dialog)
        this._dialogView.ideSelectData = []
    }
    // 근무 상세 지역 선택 (서울만 사용)
    changeDetailWrokingPlace = () => {
        this._workingDetialPlace = this._workingDetialPlaceSelect.value
    }
    // 회원가입 스텝 2로 넘어가는 메서드
    // 20201229 로직 변경에 의해서 여기서 먼저 회원 가입을 진행하고 step 2에서 추가 정보 수정을 진행.
    goStepTwo = async () => {
        if (!this._checkNickname) {
            utils().snackbar('닉네임이 중복되었습니다.')
            return
        }
        const stepOneWrapper = this._View.getElement('#stepOne')
        const stepTwoWrapper = this._View.getElement('#stepTwo')

        const stepOneCheck = this.stepOneParamChecker()
        // 체크 유저 데이터 생성
        this._checkUserModel.reqData.registered_type = this._checkUserModel._typeEmail
        this._checkUserModel.reqData.profile_email = this._email
        // 회원 가입 가능한 상태인지 체크
        const checkUser = await this._checkUserModel.checkUser()
        if (checkUser.message === 'you_can_login') {
            utils().snackbar('이미 사용중인 이메일입니다.')
            return
        }
        if (checkUser.message !== 'you_can_join') return

        if (stepOneCheck) {
            const result = await this.signUp()
            if (result) {
                utils().snackbar('회원 가입에 성공 했습니다!<br />추가 정보를 입력해서 다양한 혜택을 경험하세요!')
                this._View.getElement('#title').innerHTML = '추가 정보 입력'
                this._View.getElement('#subTitle').innerHTML = `Additional information`
                stepOneWrapper.classList.add('hidden')
                stepTwoWrapper.classList.remove('hidden')
                this._View.getElement('#step1').classList.remove('focus')
                this._View.getElement('#step1').classList.add('unfocus')
                this._View.getElement('#step2').classList.remove('unfocus')
                this._View.getElement('#step2').classList.add('focus')
            }
        }
    }
    signUp = async () => {
        // 회원 가입 진행
        const reqData = this._usersModel.signupData
        // 필수 입력 사항
        reqData.registered_type = 'email'
        reqData.profile_nickname = this._nick
        reqData.profile_email = this._email
        reqData.password = this._pw
        reqData.push_status = 0
        reqData.is_information_open = 1

        const resData = await this._usersModel.signup(reqData)
        console.log(resData)
        // 회원가입 실패
        if (!resData || !resData.user_id || !resData.signin_token) {
            utils().snackbar('회원가입에 실패 했습니다.<br />관리자에게 문의해주세요.')
            return false
        }
        // 회원 가입 성공시 자동 로그인
        const loginResult = await this.autoLogin(resData.signin_token)
        // 자동 로그인 결과가 성공이면 추가 정보 입력창으로 이동
        // 실패일 경우 로그인창으로 보냄
        if (loginResult) {
            return true
        } else {
            this._singleTon.movePage('/login.html')
            return false
        }
    }
    // 회원 가입시 자동으로 로그인 되게 하는 함수
    autoLogin = async (signin_token) => {
        const reqData = {}
        reqData.registered_type = 'email'
        reqData.device_os = 'W'
        reqData.signin_token = signin_token
        reqData.profile_email = this._email
        reqData.password = this._pw
        const resData = await this._usersModel.loginUser(reqData)
        if (!resData.access_token) {
            return false
        } else {
            this._singleTon.setCookie('accessToken', resData.access_token, 1)
            return true
        }
    }
    // 회원 가입 이후 회원 정보를 추가 입력하는 메서드
    modInfoStart = async () => {
        console.log('들어옴')
        // 회원 가입 진행.
        const reqData = this._usersModel.signupData
        // 필수 입력 사항
        reqData.push_status = this._View.getElement('#pushAgree').checked ? 1 : -1 // 푸시 알림 동의
        // 선택 입력 사항
        // 생일
        if (this._birthdayInput.value) reqData.profile_birthday = this._birthdayInput.value
        // 프로필 이미지
        if (this._profileImgIdx) reqData.profile_image_id = this._profileImgIdx
        // 프로필 이미지 url
        reqData.profile_image_url = this._profileUrl ? this._profileUrl : `https://files.gaeshow.co.kr/uploads/profiles/default_profile.png`
        // 직종
        if (this._jobSelector.value) reqData.job_type_category_id = this._jobSelector.value
        // 업무 분야
        if (this._jobDetailSelector.value) reqData.job_field_category_id = this._jobDetailSelector.value
        // 성별
        if (this._gender) reqData.profile_gender = this._gender
        // 경력
        if (this._periodSelector.value) reqData.experience_years = this._periodSelector.value
        // 근속 년수
        if (this._continuePeriodSelector.value) reqData.longevity = this._continuePeriodSelector.value
        //지역
        if (this._workingPlace) reqData.working_area = this._workingPlace
        //지역 자세함
        if (this._workingDetialPlace) reqData.working_area_detail = this._workingDetialPlace
        // 연봉
        if (this._payInput.value) reqData.basic_salary = this._payInput.value
        // 깃허브 url
        if (this._githubUrlInput.value) {
            if (utils().emailChecker(this._githubUrlInput.value)) {
                reqData.github_url = this._githubUrlInput.value
            } else {
                utils().snackbar('깃허브 주소를 확인해주세요')
                return
            }
        }
        // 포트폴리오 url
        if (this._portfolioInput.value) {
            if (utils().emailChecker(this._portfolioInput.value)) {
                reqData.portfolio_url = this._portfolioInput.value
            } else {
                utils().snackbar('포트폴리오 주소를 확인해주세요')
                return
            }
        }
        // 제휴 여부
        if (this._affiliated) reqData.affiliated = this._affiliated
        // 디바이스 정보
        if (this._deviceOs) reqData.device_os = this._deviceOs
        // 개발 언어
        if (this._developLang) reqData.development_languages = this._developLang
        // 개발 ide
        if (this._developIde) reqData.development_ides = this._developIde
        console.log(reqData)
        const resData = await this._usersModel.modUser(reqData)
        if (resData.stats != 'ok') {
            utils().snackbar('추가정보 입력에 실패 했습니다.<br />관리자에게 문의해주세요.')
            return
        }

        this._singleTon.movePage('/')
    }

    // 스텝 1에서 필요한 파라미터를 체크하는 메서드
    stepOneParamChecker = () => {
        // 필수 입력
        const emailValue = this._View.getElement(`#email`).value
        const pwValue = this._View.getElement(`#pw`).value
        const pw2Value = this._View.getElement(`#pw2`).value
        const nickValue = this._View.getElement(`#nick`).value
        // 선택 입력

        // 파라미터 체크
        // 이메일
        if (!emailValue) {
            utils().snackbar(`이메일을 입력해주세요`)
            return false
        }
        if (!utils().emailChecker(emailValue)) {
            utils().snackbar(`정확한 이메일을 입력해주세요.`)
            return false
        }
        // 패스워드 체크
        if (!pwValue) {
            utils().snackbar(`비밀번호를 입력해주세요`)
            return false
        }
        if (!utils().passWordChecker(pwValue)) {
            utils().snackbar(`비밀번호는 영문,숫자와 기호를 포함한 8~20자로 사용해주세요`)
            return false
        }
        if (!pw2Value) {
            utils().snackbar(`비밀번호를 확인해주세요`)
            return false
        }
        if (pwValue != pw2Value) {
            utils().snackbar(`동일한 비밀번호를 입력해주세요`)
            return false
        }
        if (!nickValue) {
            utils().snackbar(`닉네임을 입력해주세요`)
            return false
        }
        if (!utils().nicknameChecker(nickValue)) {
            utils().snackbar(`닉네임은 2~10자로 사용해주세요`)
            return false
        }
        this._email = emailValue
        this._nick = nickValue
        this._pw = pwValue
        return true
    }
}
