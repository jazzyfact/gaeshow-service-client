import View from '../Core/Mvc/View.js'

export default class recentItem {
    constructor() {
        this._view = new View()
        this.createDefaultStructure()
        this.setHeaderItem()
        this.setFooter()
    }

    createDefaultStructure = () => {
        // 배경 아이템 생성
        this.wrapper = this._view.createElement('main', 'sidebar__recentItem--wrapper')
        // 타이틀
        this.header = this._view.createElement('header', 'sidebar__recentItem--header')
        // 내용 본문 최대 3개
        this.section = this._view.createElement('section', 'sidebar__recentItem--section')
        // 푸터
        // this.footer = this._view.createElement('footer', 'sidebar__recentItem--header')

        // wrapper 하나에 모두 넣기
        // this.wrapper.appendChild(this.header)
        this._view.appendElementFromParent(this.wrapper, this.header)
        this._view.appendElementFromParent(this.wrapper, this.section)
        // this._view.appendElementFromParent(this.wrapper, this.footer)
    }

    // 헤더 설정
    setHeaderItem = () => {
        const _headerTitle = this._view.createElement('h3', 'sidebar__recentItem--title--header')
        _headerTitle.innerHTML = '최근 본 상품'
        this._view.appendElementFromParent(this.header, _headerTitle)
    }

    // Section 설정
    setSectionItem(imgSrc, title, price, product_id) {
        const _img = this._view.createElement('img', 'sidebar__recentItem--img')
        const _title = this._view.createElement('h5', 'sidebar__recentItem--title--item')
        const _price = this._view.createElement('p', 'sidebar__recentItem--price')

        // 속성값 입력
        _img.src = imgSrc ? imgSrc : `../res/img/logo.svg`
        _title.innerHTML = title
        _price.innerHTML = price

        this._view.appendElementFromParent(this.section, _img)
        this._view.appendElementFromParent(this.section, _title)
        this._view.appendElementFromParent(this.section, _price)

        this.section.onclick = () => (window.location.href = `/product.html?i=${product_id}`)
    }

    setFooter = () => {
        const _footerBtn = this._view.createElement('Button', 'sidebar__recentItem--closeBtn')

        _footerBtn.innerHTML = '메뉴 닫기'

        this._view.appendElementFromParent(this.footer, _footerBtn)
    }

    getElement = () => {
        return this.wrapper
    }
}
