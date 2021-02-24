export default class pagination {
    constructor(allCount, nowIndex, limit, type, blockCount = 10) {
        this._type = type
        this._allCount = allCount
        this._nowIndex = nowIndex
        this._limit = limit
        this._blockCount = blockCount

        this._totalPage = parseInt(this._allCount / this._limit) + 1
        // this._totalPage = 20
        if (this._totalPage > this._blockCount * this._totalPage) {
            this._totalPage++
        }
        this._startPage = parseInt((this._nowIndex - 1) / this._blockCount) * this._blockCount + 1
        this._endPage = this._startPage + this._blockCount
        if (this._endPage > this._totalPage) this._endPage = this._totalPage

        // console.log(this._allCount, this._nowIndex, this._totalPage, this._startPage, this._endPage)
    }

    getItem() {
        let wrapper, ul

        wrapper = document.createElement('div')
        wrapper.classList.add('body__item--paging')

        ul = document.createElement('ul')

        // 좌측 이동
        if (this._nowIndex > this._blockCount) {
            let left, leftA, leftImg
            leftA = document.createElement('a')
            leftA.href = `${this._type}.html?p=${this._startPage - this._blockCount > 0 ? this._startPage - this._blockCount : 1}`

            left = document.createElement('li')
            leftImg = document.createElement('img')
            leftImg.src = '../res/img/icon_left.svg'

            left.appendChild(leftImg)
            leftA.appendChild(left)
            ul.appendChild(leftA)
        }

        // 중앙 아이템
        const itemWrapper = document.createElement('div')
        itemWrapper.classList.add('body__item--paging--wrapper')
        // console.log(this._startPage, this._endPage)
        for (let i = this._startPage; i < this._endPage; i++) {
            const tempA = document.createElement('a')
            tempA.href = `/${this._type}.html?p=${i}`
            const temp = document.createElement('li')
            if (i == this._nowIndex) {
                temp.classList.add('underbar')
            }
            temp.innerHTML = i
            tempA.appendChild(temp)
            itemWrapper.appendChild(tempA)
        }
        ul.appendChild(itemWrapper)

        // 우측 이동
        if (this._endPage < this._totalPage) {
            let right, rightA, rightImg

            rightA = document.createElement('a')
            rightA.href = `${this._type}.html?p=${this._startPage + this._blockCount}`

            right = document.createElement('li')
            rightImg = document.createElement('img')
            rightImg.src = '../res/img/icon_right.svg'

            right.appendChild(rightImg)
            rightA.appendChild(right)

            ul.appendChild(rightA)
        }

        return ul
    }

    createPagenationMyProfile = () => {
        this._blockCount = 12
        let wrapper, ul

        wrapper = document.createElement('div')
        wrapper.classList.add('body__item--paging')

        ul = document.createElement('ul')

        let left, leftA, leftImg
        // 좌측 이동
        if (this._nowIndex > this._blockCount) {
            leftA = document.createElement('a')

            left = document.createElement('li')
            leftImg = document.createElement('img')
            leftImg.src = '../res/img/icon_left.svg'

            left.appendChild(leftImg)
            leftA.appendChild(left)
            ul.appendChild(leftA)
        }

        // 중앙 아이템
        const itemWrapper = document.createElement('div')
        itemWrapper.classList.add('body__item--paging--wrapper')
        const centerList = []

        for (let i = this._startPage; i <= this._endPage; i++) {
            const tempA = document.createElement('a')
            tempA.setAttribute('idx', i)
            const temp = document.createElement('li')
            if (i == this._nowIndex) {
                temp.classList.add('underbar')
            }
            temp.innerHTML = i
            tempA.appendChild(temp)
            centerList.push(tempA)
            itemWrapper.appendChild(tempA)
        }
        ul.appendChild(itemWrapper)

        let right, rightA, rightImg
        // 우측 이동
        if (this._endPage < this._totalPage) {
            rightA = document.createElement('a')

            right = document.createElement('li')
            rightImg = document.createElement('img')
            rightImg.src = '../res/img/icon_right.svg'

            right.appendChild(rightImg)
            rightA.appendChild(right)

            ul.appendChild(rightA)
        }

        return [ul, leftA, centerList, rightA]
    }

    createPagenationStore = () => {
        let wrapper, ul

        wrapper = document.createElement('div')
        wrapper.classList.add('body__item--paging')

        ul = document.createElement('ul')

        // 좌측 이동
        if (this._nowIndex > this._blockCount) {
            let left, leftA, leftImg
            leftA = document.createElement('a')
            leftA.href = `${this._type}.html?p=${this._startPage - this._blockCount > 0 ? this._startPage - this._blockCount : 1}`

            left = document.createElement('li')
            leftImg = document.createElement('img')
            leftImg.src = '../res/img/icon_left.svg'

            left.appendChild(leftImg)
            leftA.appendChild(left)
            ul.appendChild(leftA)
        }

        // 중앙 아이템
        const itemWrapper = document.createElement('div')
        itemWrapper.classList.add('body__item--paging--wrapper')
        // console.log(this._startPage, this._endPage)
        for (let i = this._startPage; i < this._endPage; i++) {
            const tempA = document.createElement('a')
            tempA.href = `/store.html?p=${i}`
            const temp = document.createElement('li')
            if (i == this._nowIndex) {
                temp.classList.add('underbar')
            }
            temp.innerHTML = i
            tempA.appendChild(temp)
            itemWrapper.appendChild(tempA)
        }
        ul.appendChild(itemWrapper)

        // 우측 이동
        if (this._endPage < this._totalPage) {
            let right, rightA, rightImg

            rightA = document.createElement('a')
            rightA.href = `store.html?p=${this._startPage + this._blockCount}`

            right = document.createElement('li')
            rightImg = document.createElement('img')
            rightImg.src = '../res/img/icon_right.svg'

            right.appendChild(rightImg)
            rightA.appendChild(right)

            ul.appendChild(rightA)
        }

        return ul
    }

    createPaginationExpectation = () => {
        let wrapper, ul

        wrapper = document.createElement('div')
        wrapper.classList.add('body__item--paging')

        ul = document.createElement('ul')

        // 좌측 이동
        if (this._nowIndex > this._blockCount) {
            let left, leftA, leftImg
            leftA = document.createElement('a')
            // leftA.href = `${this._type}.html?p=${this._startPage - this._blockCount > 0 ? this._startPage - this._blockCount : 1}`

            left = document.createElement('li')
            leftImg = document.createElement('img')
            leftImg.src = '../res/img/icon_left.svg'

            left.appendChild(leftImg)
            leftA.appendChild(left)
            ul.appendChild(leftA)
        }

        // 중앙 아이템
        const itemWrapper = document.createElement('div')
        itemWrapper.classList.add('body__item--paging--wrapper')

        const itemList = []
        // console.log(this._startPage, this._endPage)
        for (let i = this._startPage; i < this._endPage; i++) {
            const tempA = document.createElement('a')
            tempA.setAttribute('idx', i)
            // tempA.href = `/store.html?p=${i}`
            const temp = document.createElement('li')
            if (i == this._nowIndex) {
                temp.classList.add('underbar')
            }
            temp.innerHTML = i
            tempA.appendChild(temp)
            itemWrapper.appendChild(tempA)
            itemList.push(tempA)
        }
        ul.appendChild(itemWrapper)

        // 우측 이동
        if (this._endPage < this._totalPage) {
            let right, rightA, rightImg

            rightA = document.createElement('a')
            // rightA.href = `store.html?p=${this._startPage + this._blockCount}`

            right = document.createElement('li')
            rightImg = document.createElement('img')
            rightImg.src = '../res/img/icon_right.svg'

            right.appendChild(rightImg)
            rightA.appendChild(right)

            ul.appendChild(rightA)
        }

        return [ul, itemList]
    }
}
