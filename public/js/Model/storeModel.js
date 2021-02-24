import Model from '../Core/Mvc/Model.js'

export default class postModel extends Model {
    constructor() {
        super()

        this._url = '/products'
    }

    // insert Data
    // page,limit,filter,search_type,search_word
    getList = async (data) => {
        try {
            const res = await this.getRequest(this._url, data)
            if (!res) throw '상품 리스트 조회 실패'
            return res
        } catch (e) {
            console.error(e)
        }
    }

    getProductDetailData = async (index) => {
        try {
            const res = await this.getRequest(`${this._url}/${index}`)
            if (!res) throw '상품 자세히 보기 조회 실패'
            return res
        } catch (e) {
            console.error(e)
        }
    }
    getReviewData = async (index) => {
        try {
            const res = await this.getRequest(`${this._url}/${index}/reviews`)
            if (!res) throw '상품 리뷰 조회 실패'
            return res
        } catch (e) {
            console.error(e)
        }
    }

    getCommentData = async (data, index, isLogin) => {
        try {
            const url = !isLogin ? `${this._url}/${index}/comments` : `${this._url}/${index}/comments/auth`
            const res = await this.getRequest(url, data)
            if (!res) throw '상품 리뷰 조회 실패'
            return res
        } catch (e) {
            console.error(e)
        }
    }
    addCommentData = async (data, index) => {
        try {
            const res = await this.postRequest(`${this._url}/${index}/comments`, data)
            if (!res) throw '상품 댓글 추가 실패'
            return res
        } catch (e) {
            console.error(e)
        }
    }
    modCommentData = async (data, postIndex, commentIndx) => {
        try {
            const res = await this.putRequest(`${this._url}/${postIndex}/comments/${commentIndx}`, data)
            if (!res) throw '상품 댓글 수정 실패'
            return res
        } catch (e) {
            console.error(e)
        }
    }
    delCommentData = async (postIndex, commentIndx) => {
        try {
            const res = await this.deleteRequest(`${this._url}/${postIndex}/comments/${commentIndx}`)
            if (!res) throw '상품 댓글 삭제 실패'
            return res
        } catch (e) {
            console.error(e)
        }
    }
    getDataLap = async (index) => {
        try {
            const res = await this.getRequest(`${this._url}/${index}/data`)
            if (!res) throw '데이터랩 조회 실패'
            return res
        } catch (e) {
            console.error(e)
        }
    }

    uploadImg = async (fileList) => {
        const formData = new FormData()
        formData.append('type', 'comment')
        fileList.map((e) => {
            formData.append('files', e.data, e.name)
        })
        try {
            const res = await this.postRequestFormData('/files/images', formData)
            if (!res) throw '프로필 이미지 업로드 실패'
            return res
        } catch (e) {
            console.error(e)
        }
    }
}
