import serviceModel from '../Model/serviceCenterModel.js'

export default class questionViewController {
    constructor(view, utils) {
        this._view = view
        this._utils = utils

        this._idx = utils.getParameterByName('n')

        this._serviceModel = new serviceModel()

        this.lifeCycle()
    }

    lifeCycle = async () => {
        await this.getData().then((e) => this.setData(e))
    }

    getData = async () => {
        if (!this._idx) {
            this._utils.snackbar('잘못된 접근입니다.')
            return
        }

        const resData = await this._serviceModel.getQuestion(this._idx)

        return resData
    }
    getComment = async () => {
        const resData = await this._serviceModel.getComment(this._idx)
        return resData
    }

    setData = async (data) => {
        // console.log(data)
        const { post_id, category_id, title, content, date, profile_nickname, process_status } = data
        // 질문
        this._view.getElement('#title').innerHTML = title
        this._view.getElement('#des').innerHTML = date
        this._view.getElement('#content').innerHTML = content
        const replyP = this._view.getElement('#reContent')
        if (process_status != '처리 완료') {
            // 답변
            replyP.innerHTML = `답변 대기중 입니다.`
        } else {
            const resData = await this.getComment()
            // console.log(resData)
            if (resData.id) {
                const { id, date, content } = resData
                replyP.innerHTML = `${date}<br/><br/>${content}`
            } else {
                replyP.innerHTML = `답변 대기중 입니다.`
            }
        }
    }
}
