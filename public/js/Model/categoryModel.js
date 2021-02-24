import Model from '../Core/Mvc/Model.js'

export default class categoryModel extends Model {
    constructor() {
        super()
        this._typeStore = 'store'
        this._typePost = 'post'
        this._typeService = 'service'
        this._typeJob = 'job'
        this._typeIde = 'ide'
        this._typeLan = 'language'
    }
    _reqData = {
        type: ''
    }

    getJob = async () => {
        this._reqData.type = this._typeJob
        try {
            const res = await this.getRequest('/categories', this._reqData)
            if (!res) throw '잡 카테고리 조회 실패!'
            return res
        } catch (e) {
            console.error(e)
        }
    }

    getIde = async () => {
        this._reqData.type = this._typeIde
        try {
            const res = await this.getRequest('/categories', this._reqData)
            if (!res) throw '잡 카테고리 조회 실패!'
            return res
        } catch (e) {
            console.error(e)
        }
    }
    getLanguage = async () => {
        this._reqData.type = this._typeLan
        try {
            const res = await this.getRequest('/categories', this._reqData)
            if (!res) throw '잡 카테고리 조회 실패!'
            return res
        } catch (e) {
            console.error(e)
        }
    }

    getPost = async () => {
        this._reqData.type = this._typePost
        try {
            const res = await this.getRequest('/categories', this._reqData)
            if (!res) throw '포스트 카테고리 조회 실패!'
            return res
        } catch (e) {
            console.error(e)
        }
    }
    getService = async () => {
        this._reqData.type = this._typeService
        try {
            const res = await this.getRequest('/categories', this._reqData)
            if (!res) throw '서비스 카테고리 조회 실패!'
            return res
        } catch (e) {
            console.error(e)
        }
    }

    getIdeLang = async (data) => {
        try {
            const res = await this.getRequest('/categories', data)
            if (!res) throw '서비스 카테고리 조회 실패!'
            return res
        } catch (e) {
            console.error(e)
        }
    }
    getStore = async (data) => {
        try {
            const res = await this.getRequest('/categories', data)
            if (!res) throw '상품 카테고리 목록 조회 실패'
            return res
        } catch (e) {
            console.error(e)
        }
    }
}
