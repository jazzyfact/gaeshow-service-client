import View from '../Core/Mvc/View.js'
import utils from '../Core/Singleton/utils.js'
import storeItem from '../View/storeItem.js'
import storeModel from '../Model/storeModel.js'
import categoryModel from '../Model/categoryModel.js'
import postModel from '../Model/postModel.js'
import portfolioItem from '../View/portfolioItem.js'

const typePortfolio = 'portfolio'
const typeBoard = 'board'
const typeBadMouse = 'badmouse'
const typeTip = 'tip'

export default class resultController {
    constructor() {
        this._view = new View()
        this._storeItem = new storeItem()
        this._storeModel = new storeModel()
        this._categoryModel = new categoryModel()
        this._postModel = new postModel()
        this._portfolioItem = new portfolioItem()

        this._searchWord = utils().getParameterByName('s')
        if (this._searchWord) {
            this._view.getElement('#navSearchText').value = this._searchWord
        }
        this._communitySearchType = 'c'

        this._workSpaceId
        this._portfolioId
        this._boardId
        this._badMouseId
        this._tipId

        this._searchResultIsEmpty = true

        this.lifeCycle()
    }

    lifeCycle = async () => {
        const isSearchWord = this.setTitle(this._searchWord)
        if (isSearchWord) {
            // 검색어 존재함
            this.getStoreData().then((storeData) => this.setStoreData(storeData))
            this.getCategory()
                .then((categoryData) => {
                    // 카테고리 정보 파싱
                    if (!categoryData) return
                    categoryData.map((e) => {
                        if (e.id == 5) this._workSpaceId = e.id
                        if (e.id == 8) this._portfolioId = e.id
                        if (e.id == 2) this._boardId = e.id
                        if (e.id == 3) this._badMouseId = e.id
                        if (e.id == 4) this._tipId = e.id
                    })
                    return true
                })
                .then(() => this.getCommunityData(this._workSpaceId, 8))
                .then((workspaceData) => this.setWorksapceData(workspaceData))
                .then(() => this.getCommunityData(this._portfolioId, 4))
                .then((portfolioData) => this.setPortfolioData(portfolioData))
                .then(() => this.getCommunityData(this._boardId, 4))
                .then((boardData) => this.setBoardData(boardData))
                .then(() => this.getCommunityData(this._badMouseId, 4))
                .then((badmouseData) => this.setBadMouseData(badmouseData))
                .then(() => this.getCommunityData(this._tipId, 4))
                .then((tipData) => this.setTipData(tipData))
                .then(() => {
                    if (this._searchResultIsEmpty) {
                        const titleWrap = this._view.getElement('#titleWrap')
                        titleWrap.innerHTML = `<b>"${this._searchWord}"</b>에 대한 검색 결과가 없습니다.`
                    }
                })
        }
    }

    setTitle = (text) => {
        const titleWrap = this._view.getElement('#titleWrap')
        if (text) {
            titleWrap.innerHTML = `<b>'${text}'</b>로 <b>검색한 결과 </b>입니다.`
            return true
        } else {
            titleWrap.innerHTML = `<b>잘못된 접근입니다.<b>`
            return false
        }
    }
    getCategory = async () => {
        const resData = await this._categoryModel.getPost()
        return resData
    }

    getStoreData = async () => {
        const reqData = {}
        reqData.page = 1
        reqData.limit = 8
        reqData.category_id = 1
        reqData.search_type = 'name'
        reqData.search_word = `${this._searchWord}`

        const resData = await this._storeModel.getList(reqData)
        // console.log(resData)
        return resData
    }
    setStoreData = (data) => {
        const { product_count, is_next, products } = data
        const countText = this._view.getElement('#storeItemCount')
        countText.innerHTML = product_count

        if (product_count == 0) {
            //검색 결과 없음
        } else {
            const wrapH = this._view.getElement('#storeWrap')
            wrapH.classList.remove('hidden')
            const link = this._view.getElementsByTagName('a', wrapH)
            link[0].href = `/store.html?t=n&s=${this._searchWord}`
            const wrap = this._view.getElement('#storeItemWrap')
            wrap.classList.remove('hidden')
            // 검색 결과 있음
            products.map((itemData) => {
                const item = this._storeItem.createStoreListItem(itemData)
                wrap.appendChild(item)
            })

            this._searchResultIsEmpty = false
        }
    }

    getCommunityData = async (idx, limit) => {
        const reqData = this._postModel._oriReqData
        // 필수 데이터 넣기
        reqData.category_id = idx
        reqData.page = 1
        reqData.limit = limit
        reqData.search_type = 'content'
        reqData.search_word = this._searchWord

        const resData = await this._postModel.getPosts(reqData)
        return resData
    }
    setWorksapceData = (data) => {
        const { post_count, is_next, posts } = data
        const countWrap = this._view.getElement('#workItemCount')
        countWrap.innerHTML = post_count
        // console.log(data)
        if (post_count == 0) {
            // 데이터 없음
        } else {
            const wrapH = this._view.getElement('#workWrap')
            wrapH.classList.remove('hidden')
            const link = this._view.getElementsByTagName('a', wrapH)
            link[0].href = `/workspaces.html?t=${this._communitySearchType}&s=${this._searchWord}`
            const wrap = this._view.getElement('#workItemWrap')
            wrap.classList.remove('hidden')
            // 데이터 있음
            posts.map((itemData) => {
                const item = this._portfolioItem.createWorkSpaceListItem(itemData)
                // console.log(item)
                wrap.appendChild(item)
            })

            this._searchResultIsEmpty = false
        }
    }
    setPortfolioData = (data) => {
        const { post_count, is_next, posts } = data
        // console.log(data)
        const countWrap = this._view.getElement('#portItemCount')
        countWrap.innerHTML = post_count

        if (post_count == 0) {
            // 데이터 없음
        } else {
            const wrapH = this._view.getElement('#portfolioWrap')
            wrapH.classList.remove('hidden')
            const link = this._view.getElementsByTagName('a', wrapH)
            link[0].href = `portfolio.html?t=${this._communitySearchType}&s=${this._searchWord}`
            const wrap = this._view.getElement('#portfolioItemWrap')
            wrap.classList.remove('hidden')
            // 데이터 있음
            posts.map((itemData) => {
                const item = this._portfolioItem.getItem(itemData, typePortfolio)
                // console.log(item)
                wrap.appendChild(item)
            })

            this._searchResultIsEmpty = false
        }
    }
    setBoardData = (data) => {
        const { post_count, is_next, posts } = data
        console.log(data)
        const countWrap = this._view.getElement('#boardCount')
        countWrap.innerHTML = post_count

        if (post_count == 0) {
            // 데이터 없음
        } else {
            const wrapH = this._view.getElement('#boardWrap')
            wrapH.classList.remove('hidden')
            const link = this._view.getElementsByTagName('a', wrapH)
            link[0].href = `board.html?t=${this._communitySearchType}&s=${this._searchWord}`
            const wrap = this._view.getElement('#boardItemWrap')
            wrap.classList.remove('hidden')
            // 데이터 있음
            posts.map((itemData) => {
                const item = this._portfolioItem.getItem(itemData, typePortfolio)
                // console.log(item)
                wrap.appendChild(item)
            })

            this._searchResultIsEmpty = false
        }
    }
    setBadMouseData = (data) => {
        const { post_count, is_next, posts } = data

        const countWrap = this._view.getElement('#badmouseCount')
        countWrap.innerHTML = post_count

        if (post_count == 0) {
            // 데이터 없음
        } else {
            const wrapH = this._view.getElement('#badmouseWrap')
            wrapH.classList.remove('hidden')
            const link = this._view.getElementsByTagName('a', wrapH)
            link[0].href = `badmouse.html?t=${this._communitySearchType}&s=${this._searchWord}`
            const wrap = this._view.getElement('#badmouseItemWrap')
            wrap.classList.remove('hidden')
            // 데이터 있음
            posts.map((itemData) => {
                const item = this._portfolioItem.getItem(itemData, typePortfolio)
                // console.log(item)
                wrap.appendChild(item)
            })

            this._searchResultIsEmpty = false
        }
    }

    setTipData = (data) => {
        const { post_count, is_next, posts } = data

        const countWrap = this._view.getElement('#tipCount')
        countWrap.innerHTML = post_count

        if (post_count == 0) {
            // 데이터 없음
        } else {
            const wrapH = this._view.getElement('#tipWrap')
            wrapH.classList.remove('hidden')
            const link = this._view.getElementsByTagName('a', wrapH)
            link[0].href = `tips.html?t=${this._communitySearchType}&s=${this._searchWord}`
            const wrap = this._view.getElement('#tipItemWrap')
            wrap.classList.remove('hidden')
            // 데이터 있음
            posts.map((itemData) => {
                const item = this._portfolioItem.getItem(itemData, typePortfolio)
                // console.log(item)
                wrap.appendChild(item)
            })

            this._searchResultIsEmpty = false
        }
    }
}
