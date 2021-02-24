import Model from '../Core/Mvc/Model.js'
export default class serviceModel extends Model {
    constructor() {
        super()
    }

    getServicePostData = async (idx, page, limit, search = '') => {
        let reqData = {
            category_id: idx,
            page: page,
            limit: limit
        }

        if (search) {
            reqData.search_type = `content`
            reqData.search_word = search
        }

        try {
            const res = await this.getRequest('/services', reqData)
            return res
        } catch (e) {
            console.log(e)
        }
    }

    getSericePostDataAuto = async (idx, page, limit, search = '') => {
        let reqData = {
            category_id: idx,
            page: page,
            limit: limit
        }

        if (search) {
            reqData.search_type = `content`
            reqData.search_word = search
        }

        try {
            const res = await this.getRequest('/services/auth', reqData)
            return res
        } catch (e) {
            console.log(e)
        }
    }

    putQuestion = async (cate, type, title, content) => {
        let reqData = {
            category_id: cate,
            type: parseInt(type),
            title: title,
            content: content
        }
        console.log(reqData)

        try {
            const res = await this.postRequest('/services', reqData)
            if (!res) return null
            return res
        } catch (e) {
            console.log(e)
            return null
        }
    }

    getQuestion = async (idx) => {
        try {
            const res = await this.getRequest(`/services/${idx}`)
            if (!res) return null
            return res
        } catch (e) {
            console.log(e)
            return null
        }
    }

    putReport = async (data) => {
        try {
            const res = await this.postRequest(`/services`, data)
            if (!res) return null
            return res
        } catch (e) {
            console.log(e)
            return null
        }
    }
    getComment = async (index) => {
        try {
            const res = await this.getRequest(`/services/${index}/comments/auth`)
            if (!res) return null
            return res
        } catch (e) {
            console.log(e)
            return null
        }
    }
}
