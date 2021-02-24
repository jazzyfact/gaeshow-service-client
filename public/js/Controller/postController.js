import categoryModel from '../Model/categoryModel.js'
import postModel from '../Model/postModel.js'
import portfolioItem from '../View/portfolioItem.js'
import View from '../Core/Mvc/View.js'
import utils from '../Core/Singleton/utils.js'

const CONTENT = 'content'
const NICKNAME = 'nickname'
const TAG = 'tag'
const ORIGINAL = '/portfolio.html'

const typePortfolio = 'portfolio'
const typeBoard = 'board'
const typeBadMouse = 'badmouse'
const typeTip = 'tip'

export default class postController {
    constructor(isLogin, type) {
        // console.log(type)
        this._categoryModel = new categoryModel()
        this._postModel = new postModel()
        this._portfolioItem = new portfolioItem()
        this._View = new View()
        // 페이지 구분
        this._type = type
        // 페이지 기본 데이터
        this._postIndex
        this._nowPage = utils().getParameterByName('p') ? utils().getParameterByName('p') : 1
        this._searchWord = utils().getParameterByName('s') ? utils().getParameterByName('s') : null
        this._limit = 10
        // 서버 리턴 데이터
        this._resData

        // 검색 버튼
        this._searchBtn = this._View.getElement('#search')
        this._searchType = this._View.getElement('#searchType')
        this._searchText = this._View.getElement('#searchText')
        this._writeBtn = this._View.getElement('#writeBtn')
        this._writeA = this._View.getElement('#writeA')

        this._searchBtn.onclick = () => this.getSearch()
        if (isLogin) {
            if (type == typePortfolio) this._writeA.href = `/portfolio__write.html`
            if (type == typeBoard) this._writeA.href = `/board__write.html`
            if (type == typeBadMouse) this._writeA.href = `/badmouse__write.html`
            if (type == typeTip) this._writeA.href = `/tips__write.html`
        } else this._writeBtn.onclick = () => utils().snackbar('로그인이 필요한 서비스입니다.')

        // lifeCycle
        this.lifeCycle()
    }
    lifeCycle = async () => {
        await this.getCategory()
        await this.getData()
        await this.setPostItem()
        await this.setPagination()
    }

    getCategory = async () => {
        const resData = await this._categoryModel.getPost()
        // console.log(resData)
        if (!resData) return

        let filterd
        if (this._type == typePortfolio) {
            filterd = resData.filter((it) => it.id === 8)
        }
        if (this._type == typeBoard) {
            filterd = resData.filter((it) => it.id === 2)
        }
        if (this._type == typeBadMouse) {
            filterd = resData.filter((it) => it.id === 3)
        }
        if (this._type == typeTip) {
            filterd = resData.filter((it) => it.id === 4)
        }

        this._postIndex = filterd[0].id
        this._View.getElement('#cateTitle').innerHTML = filterd[0].name
        this._View.getElement('#cateExplain').innerHTML = filterd[0].explanation
    }

    getData = async () => {
        const reqData = this._postModel._oriReqData
        // 필수 데이터 넣기
        reqData.category_id = this._postIndex
        reqData.page = this._nowPage
        reqData.limit = this._limit

        // 파라미터 데이터 체크
        // 검색 타입
        const type = utils().getParameterByName('t')
        if (type) {
            switch (type) {
                case 'c':
                    reqData.search_type = 'content'
                    break
                case 't':
                    reqData.search_type = 'tag'
                    break
                case 'n':
                    reqData.search_type = 'nickname'
                    break
            }
            this._searchType.value = reqData.search_type
        }
        if (this._searchWord) {
            if (type === 't') {
                reqData.search_word = `["${this._searchWord}"]`
            } else {
                reqData.search_word = this._searchWord
            }
            this._searchText.value = this._searchWord
        } else {
            const searchText = utils().getParameterByName('s')
            // 검색어
            if (searchText) {
                if (type === 't') {
                    reqData.search_word = `["${searchText}"]`
                } else {
                    reqData.search_word = searchText
                }
                this._searchText.value = searchText
            }
        }
        console.log(reqData)
        const resData = await this._postModel.getPosts(reqData)
        // console.log(resData)
        this._resData = resData
    }
    getSearch = async () => {
        let type = this._searchType.value
        const text = this._searchText.value

        if (!text) {
            utils().snackbar('검색어를 입력해주세요')
            return
        }

        switch (type) {
            case CONTENT:
                type = 'c'
                break
            case TAG:
                type = 't'
                break
            case NICKNAME:
                type = 'n'
                break
        }

        window.location.href = `${ORIGINAL}?t=${type}&s=${text}`
    }

    setPostItem = async () => {
        const setionBody = this._View.getElement('#sectionBody')
        this._resData.posts.map((item) => {
            const itemElement = this._portfolioItem.getItem(item, this._type)
            setionBody.appendChild(itemElement)
        })
    }

    setPagination = async () => {
        if (this._resData.post_count <= this._limit) return
        const paginationView = await import('../View/pagination.js')
        let paginationRepo = new paginationView.default(this._resData.post_count, this._nowPage, this._limit, this._type)
        const paginationItem = paginationRepo.getItem()

        const pageWrapper = this._View.getElement('.body__item--paging')
        pageWrapper.appendChild(paginationItem)
    }
    removeAllItem = () => {
        // 포스트 아이템 지우기
        const sectionBody = this._View.getElement('#sectionBody')
        const posts = this._View.getElements('.body__item', sectionBody)
        for (let i = 0; i < posts.length; i++) {
            posts[i].parentNode.removeChild(posts[i])
        }
        // 페이징 지우기
        const paging = this._View.getElement('.paging')
        while (paging.hasChildNodes()) {
            paging.removeChild(paging.firstChild)
        }
    }
}
