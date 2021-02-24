import categoryModel from '../Model/categoryModel.js'
import postModel from '../Model/postModel.js'
import utils from '../Core/Singleton/utils.js'
import portfolioitem from '../View/portfolioItem.js'
import View from '../Core/Mvc/View.js'

const lang = `language`
const ide = `ide`
export default class ideController {
    constructor() {
        this._categoryModel = new categoryModel()
        this._postModel = new postModel()
        this._portfolioItem = new portfolioitem()
        this._view = new View()

        this._postIndex
        this._requestDefind = lang
        this._nowPage = utils().getParameterByName('p') ? utils().getParameterByName('p') : 1
        this._limit = 10

        this.lifeCycle()
    }

    lifeCycle = async () => {
        this.getCategory().then((e) => this.setData(e))
        this.getCategoryTitle()
        this._view.getElement('#lang').onclick = () => this.requestTypeOnclick(lang)
        this._view.getElement('#ide').onclick = () => this.requestTypeOnclick(ide)
    }
    getCategoryTitle = async () => {
        const resData = await this._categoryModel.getPost()
        console.log(resData)
        let idx
        if (resData) {
            resData.map((e) => {
                if (e.id == 7) {
                    idx = e.id
                    this._idx = idx
                    this._view.getElement('#cateTitle').innerHTML = e.name
                    this._view.getElement('#cateExplain').innerHTML = e.explanation
                    return
                }
            })
            return idx
        }
    }

    getCategory = async () => {
        let data = {
            type: this._requestDefind
        }
        const type = utils().getParameterByName('t')
        if (type) {
            switch (type) {
                case 'c':
                    data.search_type = 'content'
                    break
                case 't':
                    data.search_type = 'tag'
                    break
                case 'n':
                    data.search_type = 'nickname'
                    break
            }
            this._searchType.value = data.search_type
        }
        const searchText = utils().getParameterByName('s')
        // 검색어
        if (searchText) {
            if (type === 't') {
                data.search_word = `["${searchText}"]`
            } else {
                data.search_word = searchText
            }
            this._searchText.value = searchText
        }

        const resData = await this._categoryModel.getIdeLang(data)
        if (!resData) return
        return resData
    }

    setData = async (data) => {
        const wrap = this._view.getElement('#itemList')
        // 자식 모두 지우기
        while (wrap.hasChildNodes()) {
            wrap.removeChild(wrap.firstChild)
        }

        const headerItem = this._portfolioItem.createIdeLangHeaderItem(this._requestDefind)
        wrap.appendChild(headerItem)
        // 아이템 추가
        data.map((item) => {
            const uiItem = this._portfolioItem.createIdeLangItem(item, this._requestDefind)

            wrap.appendChild(uiItem)
        })
    }

    requestTypeOnclick = (type) => {
        const langBtn = this._view.getElement('#lang')
        const ideBtn = this._view.getElement('#ide')
        const subTitle = this._view.getElement('#subTitle')
        if (type == ide) {
            langBtn.classList.remove('focus')
            ideBtn.classList.add('focus')
            subTitle.innerHTML = 'IDE 리스트'
        } else if (type == lang) {
            ideBtn.classList.remove('focus')
            langBtn.classList.add('focus')
            subTitle.innerHTML = '언어 리스트'
        }
        // 요청 타입자 변경
        this._requestDefind = type

        this.getCategory().then((e) => this.setData(e))
    }
}
