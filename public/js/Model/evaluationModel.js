import Model from '../Core/Mvc/Model.js'

export default class evaluationModel extends Model {
    constructor() {
        super()
    }

    // index 는 해당 게시글 번호
    // data 에는 {rating : 1} , 1 = like -1 = dislike
    putLike = async (data) => {
        const url = `/ratings`

        try {
            const res = await this.postRequest(url, data)
            return res
        } catch (e) {
            console.error(e)
        }
    }
    delLike = async (index) => {
        const url = `/ratings/${index}`

        try {
            const res = await this.deleteRequest(url)
            return res
        } catch (e) {
            console.error(e)
        }
    }

    putBookmark = async (type, postId) => {
        const url = `/bookmarks`
        const reqData = {
            unique_id: postId,
            type: type
        }

        try {
            const res = await this.postRequest(url, reqData)
            return res
        } catch (e) {
            console.error(e)
        }
    }
    delBookmark = async (postId) => {
        const url = `/bookmarks/${postId}`
        try {
            const res = await this.deleteRequest(url)
            return res
        } catch (e) {
            console.error(e)
        }
    }
}
