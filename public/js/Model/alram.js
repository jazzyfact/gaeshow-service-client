import Model from '../Core/Mvc/Model.js'

export default class categoryModel extends Model {
    constructor() {
        super()
    }

    getAlram = async (reqData) => {
        try {
            const res = await this.getRequest('/notifications', reqData)
            if (!res) throw '알람 조회 실패'
            return res
        } catch (e) {
            console.error(e)
        }
    }

    readAlram = async (index) => {
        try {
            const res = await this.putRequest(`/notifications/${index}`)
            console.log(res)
            if (!res) throw '알람 읽음 처리 실패'
            return res
        } catch (e) {
            console.error(e)
        }
    }
}
