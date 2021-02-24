import Model from '../Core/Mvc/Model.js'

export default class shareModel extends Model {
    constructor() {
        super()
    }

    addShare = async (isLogin, id, type) => {
        try {
            const reqData = {}
            reqData.type = type
            let url = isLogin ? `/shares/${id}/auth` : `/share/${id}`
            const res = await this.postRequest(url, reqData)
            if (!res) throw '쉐어 추가 실패'
            return res
        } catch (e) {
            console.error(e)
        }
    }
}
