import Model from '../Core/Mvc/Model.js'

export default class postModel extends Model {
    constructor() {
        super()

        this._originalUrl = '/posts'
        // 필수 요청 데이터
        // 이거 건드리지 말것. 리턴 받은 원본을 사본으로 가공할것
        this._oriReqData = {
            category_id: '',
            page: '',
            limit: ''
        }
    }

    getPosts = async (data) => {
        try {
            const res = await this.getRequest(this._originalUrl, data)
            if (!res) throw '포스트 요청 실패!'
            return res
        } catch (e) {
            console.error(e)
        }
    }

    getPostDetail = async (index, isLogin = false) => {
        const setUrl = isLogin ? `/${index}/auth` : `/${index}`
        // console.log(setUrl)
        try {
            const res = await this.getRequest(`${this._originalUrl}${setUrl}`)
            if (!res) throw '포스트 상세보기 요청 실패!'
            return res
        } catch (e) {
            console.error(e)
            return null
        }
    }

    getIdePostsDetail = async (data) => {
        // console.log(data)
        try {
            const res = await this.getRequest(`/posts/recommends`, data)
            if (!res) throw '포스트 요청 실패!'
            return res
        } catch (e) {
            console.error(e)
        }
    }

    uploadImage = async (fileData, name) => {
        const formData = new FormData()
        formData.append('files', fileData, name)
        formData.append('type', 'post')
        try {
            const res = await this.postRequestFormData('/files/images', formData)
            if (!res) throw '이미지 업로드 실패'
            return res
        } catch (e) {
            console.error(e)
        }
    }

    addPost = async (data) => {
        try {
            const res = await this.postRequest(this._originalUrl, data)
            if (!res) throw '포스트 업로드 실패'
            return res
        } catch (e) {
            console.error(e)
        }
    }

    modPost = async (data, idx) => {
        try {
            const res = await this.putRequest(`${this._originalUrl}/${idx}`, data)
            if (!res) throw '포스트 수정 실패'
            return res
        } catch (e) {
            console.error(e)
        }
    }

    delPost = async (idx) => {
        try {
            const res = await this.deleteRequest(`${this._originalUrl}/${idx}`)
            if (!res) throw '포스트 삭제 실패'
            return res
        } catch (e) {
            console.error(e)
        }
    }
}
