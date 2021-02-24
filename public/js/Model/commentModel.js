import Model from '../Core/Mvc/Model.js'

export default class commentModel extends Model {
    constructor(index) {
        super()
        this._originalUrl = `/posts/${index}/comments`
    }

    getComments = async (page = 1, limit = 10, isLogin) => {
        const url = isLogin ? `${this._originalUrl}/auth` : this._originalUrl
        const data = {
            page: page,
            limit: limit
        }
        try {
            const res = await this.getRequest(url, data)
            if (!res) throw '댓글 리스트 조회 실패'
            return res
        } catch (e) {
            console.error(e)
        }
    }

    addComment = async (content) => {
        const data = {
            content: content,
            depth: 1
        }

        try {
            const res = await this.postRequest(`${this._originalUrl}`, data)
            if (!res) throw '댓글 추가 실패'
            return res
        } catch (e) {
            console.error(e)
        }
    }

    addCommentDepth = async (idx, content) => {
        const data = {
            parent_id: idx,
            content: content,
            depth: 2
        }

        try {
            const res = await this.postRequest(`${this._originalUrl}`, data)
            if (!res) throw '댓글 추가 실패'
            return res
        } catch (e) {
            console.error(e)
        }
    }

    delComment = async (idx) => {
        try {
            const res = await this.deleteRequest(`${this._originalUrl}/${idx}`)
            if (!res) throw '댓글 삭제 실패'
            return res
        } catch (e) {
            console.error(e)
        }
    }

    modComment = async (commentIdx, value) => {
        try {
            const res = await this.putRequest(`${this._originalUrl}/${commentIdx}`, { content: value })
            if (!res) throw '댓글 수정 실패'
            return res
        } catch (e) {
            console.error(e)
        }
    }

    getIdeComment = async (data) => {
        try {
            const res = await this.getRequest(`/posts/recommends/comments`, data)
            if (!res) throw '댓글 조회 실패'
            return res
        } catch (e) {
            console.error(e)
        }
    }
    addIdeComment = async (data) => {
        try {
            const res = await this.postRequest(`/posts/recommends/comments`, data)
            if (!res) throw '댓글 등록 실패'
            return res
        } catch (e) {
            console.error(e)
        }
    }

    delIdeComment = async (data) => {
        try {
            const res = await this.deleteRequest(`/posts/recommends/comments/${data}`)
            if (!res) throw '댓글 삭제 실패'
            return res
        } catch (e) {
            console.error(e)
        }
    }

    updateIdeComment = async (data) => {
        try {
            const res = await this.putRequest(`/posts/recommends/comments/${data.comment_id}`, data)
            if (!res) throw '댓글 수정 실패'
            return res
        } catch (e) {
            console.error(e)
        }
    }
}
