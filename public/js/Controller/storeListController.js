import categoryModel from '../Model/categoryModel.js'
import storeItem from '../View/storeItem.js'
import storeModel from '../Model/storeModel.js'
import utils from '../Core/Singleton/utils.js'
import View from '../Core/Mvc/View.js'
import pagination from '../View/pagination.js'

export default class storeContoller {
    constructor() {
        this._cateModel = new categoryModel()
        this._storeItem = new storeItem()
        this._view = new View()
        this._storeModel = new storeModel()
        this._pagination = new pagination()

        this._storeCateArr
        this._pageCategoryIndex = utils().getParameterByName('i') ? utils().getParameterByName('i') : 1
        this._pageFilterIndex = utils().getParameterByName('f') ? utils().getParameterByName('f') : 'new'

        this._pageLimit = 12
        this._pageCount = utils().getParameterByName('p') ? utils().getParameterByName('p') : 1
        this._categoryData

        // 검색
        this._searchWord = utils().getParameterByName('s') ? utils().getParameterByName('s') : null
        this._searchType = utils().getParameterByName('t') ? utils().getParameterByName('t') : null

        this._searchInput = this._view.getElement('#searchText')
        this._searchSelector = this._view.getElement('#storeSearchFilter')

        this.selectedIndex

        this.lifeCycle()
    }

    lifeCycle = async () => {
        this.getCategory().then((e) => {
            this._storeCateArr = e
            this.setStoreCategory(e)
            this.getStoreData(this._pageCategoryIndex)
                .then((data) => {
                    // 키워드 검출
                    const keyword = []
                    let img
                    data.products.map((e, i) => {
                        keyword.push(e.name)
                        if (i == 0) {
                            img = e.thumbnail
                        }
                    })
                    // 설명
                    const des = `총 ${data.product_count}개의 검색 결과. ${keyword.join(',')}와 다양한 상품을 확인하세요!`
                    // 검색어 없을떄
                    if (!this._searchWord) {
                        const koCategoryName = this._categoryData.filter((e) => e.id == this._pageCategoryIndex)
                        if (koCategoryName.length > 0) utils().setSEO(`${koCategoryName[0].name} - GAESHOW`, keyword.join(','), des, img)
                    } else {
                        const title = `${this._searchWord} - 검색결과`
                        utils().setSEO(`${title}`, keyword.join(','), des, img)
                    }
                    // 검색어
                    return this.setStoreItem(data)
                })
                .then((e) => this.setPagination(e))

            // 이벤트 바인딩 이전에 옵션 선택하기
            const selectBox = this._view.getElement('#storeFilter')
            for (let i = 0; i < selectBox.options.length; i++) {
                if (selectBox.options[i].value == this._pageFilterIndex) {
                    selectBox.options[i].selected = true
                }
            }
            // 검색어 입력
            if (this._searchWord) {
                this._searchInput.value = this._searchWord
            }
            // 검색 타입 설정
            if (this._searchType == 'n') this._searchSelector.selectedIndex = 1
            if (this._searchType == 'b') this._searchSelector.selectedIndex = 0

            // 이벤트 바인딩
            this._view.getElement('#storeFilter').onchange = () => this.filterChangeEvent()
            this._view.getElement('#searchBtn').onclick = () => {
                if (!this._searchInput.value) {
                    utils().snackbar('검색어를 입력해주세요')
                    return
                }

                let selectValue = this._searchSelector.value
                if (selectValue == 'brand') selectValue = 'b'
                else selectValue = 'n'

                window.location.href = `/store.html?t=${selectValue}&s=${this._searchInput.value}`
            }
        })
    }

    getCategory = async () => {
        const reqData = { type: 'store' }
        const resData = await this._cateModel.getStore(reqData)
        this._categoryData = resData
        return resData
    }
    setStoreCategory = async (data) => {
        const categoryWrap = this._view.getElement('#categoryWrap')

        data.map((e, index) => {
            const item = this._storeItem.createStoreCategoryView(e, index)
            categoryWrap.appendChild(item)
        })
    }

    getStoreData = async (cateIndex) => {
        const filter = this._view.getElement('#storeFilter').value
        // console.log(filter)
        const reqData = {}
        reqData.page = this._pageCount
        reqData.limit = this._pageLimit
        reqData.category_id = parseInt(cateIndex)
        if (filter && filter != 'new') reqData.filter = filter
        if (this._searchType) {
            if (this._searchType == 'n') reqData.search_type = 'name'
            if (this._searchType == 'b') reqData.search_type = 'brand'
            reqData.search_word = this._searchWord
        }
        console.log(reqData)

        const resData = await this._storeModel.getList(reqData)
        return resData
    }

    setStoreItem = async (data) => {
        // console.log(data)
        const { is_next, product_count, products } = data

        this._view.getElement('#count').innerHTML = product_count

        const itemWrap = this._view.getElement('#itemWrap')

        while (itemWrap.hasChildNodes()) {
            itemWrap.removeChild(itemWrap.firstChild)
        }
        console.log(data)
        if (product_count == 0) {
            // 상품 없음
            const item = this._storeItem.createEmptyListItem()
            itemWrap.appendChild(item)
        } else {
            products.map((itemData) => {
                const item = this._storeItem.createStoreListItem(itemData)
                // console.log(itemData)
                itemWrap.appendChild(item)
            })
        }

        return product_count
    }

    setPagination = async (count) => {
        if (!count) return
        if (count <= this._pageLimit) return
        const paginationView = await import('../View/pagination.js')
        let paginationRepo = new paginationView.default(count, this._pageCount, this._pageLimit, 'store')
        const paginationItem = paginationRepo.createPagenationStore()

        const pageWrapper = this._view.getElement('.body__item--paging')
        pageWrapper.appendChild(paginationItem)
    }

    filterChangeEvent = async () => {
        this._pageFilterIndex = this._view.getElement('#storeFilter').value
        window.location.href = `/store.html?i=${this._pageCategoryIndex}&f=${this._pageFilterIndex}`
    }
}
