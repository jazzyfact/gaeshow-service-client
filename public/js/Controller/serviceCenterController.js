import cateModel from '../Model/categoryModel.js'
import serviceModel from '../Model/serviceCenterModel.js'
import serviceItem from '../View/serviceItem.js'

export default class serviceCenterController {
    constructor(viewRepo, util, type, myInfo = {}) {
        this._type = type
        this._view = viewRepo
        this._util = util
        this._myinfo = myInfo

        this._categoryModel = new cateModel()
        this._serviceModel = new serviceModel()
        this._serviceItem = new serviceItem()

        this._page = 1
        this._limit = 30

        this._searchParam = this._util.getParameterByName('s')
        if (this._searchParam) this._view.getElement('#searchText').value = this._searchParam

        this._view.getElement('#searchBtn').onclick = () => this.searchStart()
        this._view.getElement('#searchText').onkeydown = (e) => {
            if (e.key == 'Enter') {
                this.searchStart()
            }
        }

        this.lifeCycle()
    }

    lifeCycle = async () => {
        const resCate = await this.getCategory()
        const resPost = await this.getServicePostsData(resCate)
        await this.setServicePostData(resPost)
    }

    getCategory = async () => {
        const resData = await this._categoryModel.getService()
        // console.log(resData)
        // const selectedData = resData.find((e) => {
        //     if (e.name == `공지사항`) return true
        // })
        let selectedData = resData.find((e) => {
            if (e.name == `공지사항` && this._type == 'notice') return true
            if (e.name == `자주하는 질문` && this._type == 'faq') return true
            if (e.name == `문의하기` && this._type == 'question') return true
        })

        if (!selectedData) selectedData = { id: 4 }
        return selectedData.id
    }

    getServicePostsData = async (idx) => {
        let resData
        // resData = await this._serviceModel.getServicePostData(idx, this._page, this._limit, this._searchParam)
        if (this._type == `notice` || this._type == `faq`) {
            resData = await this._serviceModel.getServicePostData(idx, this._page, this._limit, this._searchParam)
        } else {
            resData = await this._serviceModel.getSericePostDataAuto(idx, this._page, this._limit, this._searchParam)
        }
        // console.log(resData)
        return resData
    }

    setServicePostData = async (data) => {
        const { post_count, posts, is_next } = data
        const wrapper = this._view.getElement('#body__list')
        // ui 생성
        posts.map((e) => {
            let item
            if (this._type == 'notice') item = this._serviceItem.createNoticeItem(e)
            if (this._type == 'faq') item = this._serviceItem.createFaQItem(e)
            if (this._type == 'question') item = this._serviceItem.createQuestionItem(e)
            if (this._type == 'report') item = this._serviceItem.createReportItem(this._myinfo, e)
            if (item) wrapper.appendChild(item)
        })
    }

    searchStart = () => {
        const textValue = this._view.getElement('#searchText').value
        if (!textValue) {
            this._util.snackbar('검색어를 입력해주세요')
            return
        }
        if (this._type == 'notice') window.location.href = `/notice.html?s=${textValue}`
        if (this._type == 'faq') window.location.href = `/faq.html?s=${textValue}`
    }
}
