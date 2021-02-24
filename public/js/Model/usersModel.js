import Model from '../Core/Mvc/Model.js'

export default class usersModel extends Model {
    constructor() {
        super()
    }
    signupData = {
        registered_type: '',
        profile_nickname: '',
        device_os: 'W'
    }
    emailLoginData = {
        registered_type: 'email',
        device_os: 'W',
        signin_token: '',
        password: '',
        profile_email: ''
    }
    socialLoginData = {
        registered_type: '',
        device_os: 'W',
        unique_id: ''
    }
    modData = {
        profile_nickname: ''
    }
    // 회원 가입 진행
    signup = async (data) => {
        // console.log('signup start')
        try {
            const res = await this.postRequest('/users/join', data)
            if (!res) throw '회원가입 실패'
            return res
        } catch (e) {
            console.error(e)
        }
    }
    //내 정보 요청
    myInfo = async () => {
        try {
            const res = await this.getRequest('/users')
            if (!res) throw '내정보 요청 실패'
            return res
        } catch (e) {
            console.error(e)
        }
    }
    // 유저 정보 요청
    getUserInfo = async (userIndex, isLogin) => {
        try {
            const url = isLogin ? `/users/${userIndex}/auth` : `/users/${userIndex}`
            const res = await this.getRequest(url)
            if (!res) throw '내정보 요청 실패'
            return res
        } catch (e) {
            console.error(e)
        }
    }

    //회원 로그인 요청
    loginUser = async (data) => {
        try {
            const res = await this.postRequest('/users/login', data)
            if (!res) throw 'loginUser is empty result'
            return res
        } catch (e) {
            console.error(e)
        }
    }

    //회원 로그아웃 요청
    logoutUser = async () => {
        try {
            const res = await this.postRequest('/users/logout')
            if (!res) throw 'logout fail!'
            return res
        } catch (e) {
            console.error(e)
        }
    }
    //회원 삭제
    deleteUser = async () => {
        try {
            const res = await this.deleteRequest('/users')
            if (!res) throw '회원탈퇴 실패'
            return res
        } catch (e) {
            console.error(e)
        }
    }
    // 프로필 업로드
    profileImgUpload = async (fileData, name) => {
        const formData = new FormData()
        formData.append('files', fileData, name)
        formData.append('type', 'user')
        try {
            const res = await this.postRequestFormData('/files/images', formData)
            if (!res) throw '프로필 이미지 업로드 실패'
            return res
        } catch (e) {
            console.error(e)
        }
    }
    modUser = async (data) => {
        // console.log('signup start')
        try {
            const res = await this.putRequest('/users', data)
            if (!res) throw '회원가입 실패'
            return res
        } catch (e) {
            console.error(e)
        }
    }
    checkNickname = async (data) => {
        try {
            const res = await this.postRequest('/users/profile-nickname', data)
            if (!res) throw '닉네임 중복체크 실패'
            return res
        } catch (e) {
            console.error(e)
        }
    }

    follow = async (userIndex) => {
        try {
            const res = await this.postRequest(`/users/${userIndex}/follows`)
            if (!res) throw '팔로우 추가 실패'
            return res
        } catch (e) {
            console.error(e)
        }
    }
    unfollow = async (followIndex) => {
        try {
            const res = await this.deleteRequest(`/users/follows/${followIndex}`)
            if (!res) throw '팔로우 취소 실패'
            return res
        } catch (e) {
            console.error(e)
        }
    }
}
