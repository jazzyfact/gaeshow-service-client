import categoryModel from '../Model/categoryModel.js'
import postModel from '../Model/postModel.js'
import portfolioItem from '../View/portfolioItem.js'
import View from '../Core/Mvc/View.js'
import utils from '../Core/Singleton/utils.js'

export default class workspaces {
    constructor(isLogin) {
        this._categoryModel = new categoryModel()
        this._postModel = new postModel()
        this._postItem = new portfolioItem()
        this._view = new View()

        this._searchWord = utils().getParameterByName('s') ? utils().getParameterByName('s') : null

        this._isLogin = isLogin
        this._page = 1
        this._limit = 12
        this._idx
        this._isRequest = false
        this._isNext = false

        this.lifeCycle()
    }
    lifeCycle = async () => {
        await this.getCategory()
            .then((e) => this.getData(e))
            .then((f) => this.setData(f))

        // 인피니티 스크롤을 위한 스크롤 이벤트 반영
        window.addEventListener('scroll', () => this.setScrollEvent())
        // 글쓰기 버튼 활성화
        this._view.getElement(`#writeBtn`).onclick = () => {
            if (!this._isLogin) {
                utils().snackbar('로그인이 필요한 서비스입니다.')
                return
            }

            window.location.href = '/workspace__write.html'
        }
    }

    getCategory = async () => {
        const resData = await this._categoryModel.getPost()
        // console.log(resData)
        let idx
        if (resData) {
            resData.map((e) => {
                if (e.id == 5) {
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
    getData = async (idx) => {
        if (!idx) console.error('idx값 못 받아옴')
        const reqData = this._postModel._oriReqData
        reqData.category_id = idx
        reqData.page = this._page
        reqData.limit = this._limit

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
        }
        // 검색어가 있다면
        if (this._searchWord) {
            reqData.search_word = this._searchWord
        }

        const resData = await this._postModel.getPosts(reqData)
        return resData
    }
    setData = async (items) => {
        // console.log(items)
        const { is_next, post_count, posts } = items
        this._isNext = is_next

        const wrap = this._view.getElement('#listWrap')

        posts.map((itemData) => {
            const item = this._postItem.createWorkSpaceListItem(itemData)
            // console.log(item)
            wrap.appendChild(item)
        })
    }

    setScrollEvent = () => {
        let scrollLocation = document.documentElement.scrollTop
        let windowHeight = window.innerHeight
        let fullHeight = document.body.scrollHeight
        // console.log(scrollLocation, windowHeight, fullHeight)

        // 진입 조건
        // 90% 이상의 하단 스크롤
        // 요청중이 아님
        // 다음 요청할 데이터가 있음
        if (((scrollLocation + windowHeight) / fullHeight) * 100 >= 90 && !this._isRequest && this._isNext) {
            this._isRequest = true
            // 서버로 요청을 추가로 보냄
            this._page++
            this.getData(this._idx)
                .then((e) => this.setData(e))
                .then(() => {
                    this._isRequest = false
                })
        }
    }
}
