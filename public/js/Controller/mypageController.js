import View from '../Core/Mvc/View.js'
import categoryModel from '../Model/categoryModel.js'
import dialog from '../View/dialog.js'
import utils from '../Core/Singleton/utils.js'
import usersModel from '../Model/usersModel.js'
import Singleton from '../Core/Singleton/Singleton.js'

export default class mypageController {
    constructor(myInfo) {
        this._isSocial = utils().getParameterByName('t')
        this._myInfoOri = myInfo

        this._categoryModel = new categoryModel()
        this._view = new View()
        this._dialogView = new dialog()
        this._usersModel = new usersModel()
        this._singleTon = new Singleton()

        this._checkNickname = true
        this._nick
        this._profileImgIdx
        this._profileUrl
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

        this._nickInput = this._view.getElement('#nick')
        this._profileInput = this._view.getElement(`#profileInput`)
        this._profileImg = this._view.getElement(`#profileImg`)
        this._birthdayInput = this._view.getElement(`#birthday`)
        this._jobSelector = this._view.getElement('#jobSelector')
        this._jobDetailSelector = this._view.getElement('#jobDetailSelector')
        this._man = this._view.getElement('#man')
        this._woman = this._view.getElement('#woman')
        this._workingPlaceSelect = this._view.getElement('#workingPlaceSelector')
        this._workingDetialPlaceWrapper = this._view.getElement('#workingDetailPlace')
        this._workingDetialPlaceSelect = this._view.getElement('#workingDetailPlaceSelector')
        this._periodSelector = this._view.getElement('#periodSelector')
        this._continuePeriodSelector = this._view.getElement('#continuePeriodSelector')
        this._payInput = this._view.getElement('#payInput')
        this._portfolioInput = this._view.getElement('#portfolioUrlInput')
        this._githubUrlInput = this._view.getElement('#githubUrlInput')
        this._addLang = this._view.getElement('#addLang')
        this._addIde = this._view.getElement('#addIde')
        this._modBtn = this._view.getElement('#modBtn')
        this._infoOpenCheck = this._view.getElement('#infoOpen')
        this._pushAlramCheck = this._view.getElement('#pushAlram')
        // 회원 탈퇴
        this._byeTitle = this._view.getElement('#byeTitle')
        this._byeFirst = this._view.getElement('#byeFirst')
        this._byeSecond = this._view.getElement('#byeSecond')
        this._byeFirstBtn = this._view.getElement('#byeFirstBtn')
        this._byeEndBtn = this._view.getElement('#byeBtn')

        this.lifeCycle()
    }

    lifeCycle = async () => {
        flatpickr(this._birthdayInput, {})
        this.getJobData().then((e) => this.setData(this._myInfoOri, e))

        this._profileInput.onchange = () => this.imageFileUpload(this._profileInput)
        this._profileImg.onclick = () => this.imageFileDelete()
        this._man.onclick = () => this.genderSelector('man')
        this._woman.onclick = () => this.genderSelector('woman')
        this._workingPlaceSelect.onchange = () => this.changeWorkingPlace()
        this._workingDetialPlaceSelect.onchange = () => this.changeDetailWrokingPlace()
        this._addLang.onclick = () => this.clickAddLang()
        this._addIde.onclick = () => this.clickAddIde()
        this._modBtn.onclick = () => this.modStart()
        // 닉네임 중복 체크
        this._nickInput.addEventListener('blur', (e) => this.nicknameChecker())
        // 회원탈퇴
        this._byeTitle.onclick = () => (this._byeFirst.classList.contains('hidden') ? this._byeFirst.classList.remove('hidden') : this._byeFirst.classList.add('hidden'))
        this._byeFirstBtn.onclick = () => (this._byeSecond.classList.contains('hidden') ? this._byeSecond.classList.remove('hidden') : this._byeSecond.classList.add('hidden'))
        this._byeEndBtn.onclick = () => this.byeUser()

        // 소셜 회원가입 직후 추가 정보입력 화면 변경
        if (this._isSocial == 's') {
            utils().snackbar('추가 정보 입력하고 더욱 다양한 혜택을 누리세요!')
            this._view.getElement('#nickWrap').classList.add('hidden')
            this._view.getElement('#title').innerHTML = '추가 정보 입력'
            this._view.getElement('#subTitle').innerHTML = `Additional information`
            this._view.getElement('#modBtn').innerHTML = `추가 정보 입력하기`
            this._view.getElement('.bye').classList.add('hidden')
        }
    }

    getJobData = async () => {
        const resData = await this._categoryModel.getJob()
        // 받은 데이터로 셀렉트 값 넣어주기
        resData.map((item) => {
            const data = item
            const tempItem = document.createElement('option')
            tempItem.innerHTML = data.ko_name
            tempItem.value = data.id
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

        return resData
    }

    setData = (data, jobdata) => {
        // console.log(jobdata, data)
        this._nickInput.value = data.profile_nickname
        if (data.profile_image_url) {
            this._profileUrl = data.profile_image_url
            this.insertImage(data.profile_image_url)
        }
        if (data.profile_birthday) {
            this._birthday = data.profile_birthday
            this._birthdayInput.value = data.profile_birthday
        }
        if (data.job_type) {
            const jobName = jobdata.find((e) => {
                if (e.ko_name == data.job_type) return true
            })
            const arr = this._jobSelector.childNodes
            for (let i = 0; i < arr.length; i++) {
                if (arr[i].innerHTML == jobName.ko_name) arr[i].setAttribute('selected', true)
            }
        }
        if (data.job_field) {
            while (this._jobDetailSelector.hasChildNodes()) {
                this._jobDetailSelector.removeChild(this._jobDetailSelector.firstChild)
            }

            let filed_name
            jobdata.find((e) => {
                const field = e.job_field
                filed_name = field.find((f) => {
                    if (f.en_name == data.job_field) {
                        field.map((e) => {
                            const t = document.createElement('option')
                            t.innerHTML = e.ko_name
                            t.value = e.id
                            if (f.en_name == e.en_name) t.setAttribute('selected', true)
                            this._jobDetailSelector.appendChild(t)
                        })
                    }
                })
            })
        }
        if (data.profile_gender) {
            if (data.profile_gender == '남') this.genderSelector('man')
            else this.genderSelector('woman')
        }
        if (data.experience_years) {
            const arr = this._periodSelector.childNodes
            let targetValue = data.experience_years
            targetValue = targetValue.replace('년차', '')
            targetValue = targetValue.replace(' 이상', '')
            // console.log(targetValue)
            for (let i = 0; i < arr.length; i++) {
                if (arr[i].value == targetValue) arr[i].setAttribute('selected', true)
            }
        }
        if (data.working_area) {
            this._workingPlace = data.working_area
            const arr = this._workingPlaceSelect.childNodes
            for (let i = 0; i < arr.length; i++) {
                if (arr[i].innerHTML == data.working_area) {
                    arr[i].setAttribute('selected', true)
                    if (arr[i].innerHTML === '서울특별시') {
                        this._workingDetialPlaceWrapper.classList.remove('hidden')
                    }
                }
            }
        }
        if (data.working_area_detail) {
            this._workingDetialPlace = data.working_area_detail
            const arr = this._workingDetialPlaceSelect.childNodes
            for (let i = 0; i < arr.length; i++) {
                if (arr[i].innerHTML == data.working_area_detail) arr[i].setAttribute('selected', true)
            }
        }
        if (data.basic_salary) {
            this._payInput.value = data.basic_salary
        }
        if (data.longevity) {
            const arr = this._continuePeriodSelector.childNodes
            for (let i = 0; i < arr.length; i++) {
                if (arr[i].value == data.longevity) arr[i].setAttribute('selected', true)
            }
        }
        if (data.github_url) {
            this._githubUrlInput.value = data.github_url
        }
        if (data.portfolio_url) {
            this._portfolioInput.value = data.portfolio_url
        }
        if (data.ides.length > 0) {
            this._dialogView.ideSelectData = data.ides
            this.clickSelectIde()
        }
        if (data.languages.length > 0) {
            this._dialogView.langSelectData = data.languages
            this.clickSelectLang()
        }
        this._infoOpenCheck.checked = data.is_information_open == 0 ? false : true
        this._pushAlramCheck.checked = data.push_status == 0 ? false : true
    }
    insertImage = async (url) => {
        // 클라 화면에 이미지 배치
        const profileImg = this._view.getElement(`#profileImg`)
        profileImg.src = url
        profileImg.classList.remove('hidden')

        const profileLabel = this._view.getElement(`#profileLabel`)
        profileLabel.classList.add('hidden')
    }
    nicknameChecker = async () => {
        const err = this._view.getElement('#nickChecker')
        if (this._myInfoOri.profile_nickname == this._nickInput.value) {
            err.innerHTML = ''
            this._checkNickname = true
            return
        }
        const reqData = { profile_nickname: this._nickInput.value }

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
        console.log(resData)
        // 리스폰 데이터 성공
        const { attach_id, file_path } = resData[0]
        this._profileImgIdx = attach_id
        this._profileUrl = file_path

        // 클라 화면에 이미지 배치
        const profileImg = this._view.getElement(`#profileImg`)
        profileImg.src = imgUrl
        profileImg.classList.remove('hidden')

        const profileLabel = this._view.getElement(`#profileLabel`)
        profileLabel.classList.add('hidden')
    }
    // 프로필 이미지 삭제
    imageFileDelete = async () => {
        this._profileImgIdx = null
        this._profileUrl = null

        const profileImg = this._view.getElement(`#profileImg`)
        profileImg.classList.add('hidden')

        const profileLabel = this._view.getElement(`#profileLabel`)
        profileLabel.classList.remove('hidden')
    }

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
    changeDetailWrokingPlace = () => {
        this._workingDetialPlace = this._workingDetialPlaceSelect.value
    }
    clickAddLang = () => {
        const dialogView = this._dialogView.langSelectDialog()
        document.body.appendChild(dialogView)
        dialogView.addEventListener('click', (e) => {
            if (e.target == dialogView) {
                dialogView.parentNode.removeChild(dialogView)
            }
        })
        // 버튼 찾기
        const button = dialogView.getElementsByTagName('button')
        button[0].onclick = () => this.clickSelectLang(dialogView)
    }
    // 언어 선택 완료 이벤트
    clickSelectLang = (dialog) => {
        const selectData = this._dialogView.langSelectData
        if (selectData.length < 1) {
            utils().snackbar('선택된 언어가 없습니다')
            return
        }
        const tempArr = this._developLang.concat(selectData)
        this._developLang = tempArr.filter((item, i) => {
            return (
                tempArr.findIndex((item2, j) => {
                    return item.name === item2.name
                }) === i
            )
        })
        // 화면 추가
        const langWrapper = this._view.getElement('#langItemWrapper')
        selectData.map((item) => {
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
        if (dialog) dialog.parentNode.removeChild(dialog)
        this._dialogView.langSelectData = []
    }
    // ide선택 추가
    clickAddIde = () => {
        const dialogView = this._dialogView.ideSelectDialog()
        document.body.appendChild(dialogView[0])

        dialogView[0].addEventListener('click', (e) => {
            if (e.target == dialogView[0]) {
                dialogView[0].parentNode.removeChild(dialogView[0])
            }
        })
        const button = dialogView[0].getElementsByTagName('button')
        button[0].addEventListener('click', (event) => {
            this.clickSelectIde(dialogView[0])
        })
    }
    clickSelectIde = (dialog) => {
        const selectData = this._dialogView.ideSelectData
        if (selectData.length < 1) {
            utils().snackbar('선택된 IDE가 없습니다')
            return
        }
        const tempArr = this._developIde.concat(selectData)
        this._developIde = tempArr.filter((item, i) => {
            return (
                tempArr.findIndex((item2, j) => {
                    return item.name === item2.name
                }) === i
            )
        })
        // 화면 추가
        const langWrapper = this._view.getElement('#ideItemWrapper')

        selectData.map((item) => {
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
        if (dialog) dialog.parentNode.removeChild(dialog)
        this._dialogView.ideSelectData = []
    }

    modStart = async () => {
        // 회원 가입 진행.
        const reqData = this._usersModel.modData
        // 필수 입력 사항
        reqData.profile_nickname = this._nickInput.value
        reqData.is_information_open = this._infoOpenCheck.checked ? 1 : 0 // 개인정보 오픈
        reqData.push_status = this._pushAlramCheck.checked ? 1 : 0 // 푸쉬알람 허용
        if (!this._checkNickname) {
            utils().snackbar('닉네임이 중복 되었습니다')
            return
        }
        // 선택 입력 사항
        // 생일
        if (this._birthdayInput.value) reqData.profile_birthday = this._birthdayInput.value
        // 프로필 이미지
        if (this._profileImgIdx) reqData.profile_image_id = this._profileImgIdx
        // 프로필 이미지 url
        if (this._profileUrl) reqData.profile_image_url = this._profileUrl
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

        // console.log(reqData)
        const resData = await this._usersModel.modUser(reqData)
        // console.log(resData)
        if (!resData.stats == 'ok') {
            utils().snackbar('회원가입에 실패 했습니다.<br />관리자에게 문의해주세요.')
            return
        }
        // 회원가입 성공
        // 로그인 페이지로 이동
        this._singleTon.movePage('/profile.html')
        // console.log(resData)
    }

    // 회원 탈퇴
    byeUser = async () => {
        const text = this._view.getElement('#byeText').value
        if (!text || text != '탈퇴에 동의합니다') {
            utils().snackbar('탈퇴 문구를 확인해주세요.')
            return
        }
        // 회원 탈퇴 로직
        const resData = await this._usersModel.deleteUser()
        if (resData.stats == 'ok') {
            this._singleTon.deleteCookie('accessToken')
            window.location.href = '/'
        } else {
            console.log(resData)
            utils().snackbar('회원 탈퇴에 실패 했습니다.')
        }
    }
}
