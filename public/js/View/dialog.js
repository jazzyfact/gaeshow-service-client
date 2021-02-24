import categoryModel from '../Model/categoryModel.js'

export default class dialog {
    constructor() {
        this._categoryModel = new categoryModel()
        this._langServerData
        this._ideServerData
    }

    langSelectData = []
    ideSelectData = []

    langSelectDialog() {
        let isSearchMode = false

        let wrapper, itemWrappr, title, input, subtitle
        wrapper = document.createElement('div')
        wrapper.className = 'dialog'

        itemWrappr = document.createElement('div')
        itemWrappr.classList.add('dialog__item')

        title = document.createElement('h3')
        title.classList.add('dialog__lang--title')
        title.innerHTML = `언어 선택하기`

        input = document.createElement('input')
        input.classList.add('dialog__lang--input')
        input.type = 'text'
        input.value = ''
        input.placeholder = `언어 이름을 영어로 검색해주세요.`

        subtitle = document.createElement('p')
        subtitle.classList.add('dialog__lang--subtitle')
        subtitle.innerHTML = '직접 입력하기'

        //검색 결과
        let sTitle, sConWrapper
        sTitle = document.createElement('h5')
        sTitle.classList.add('dialog__lang--searchTitle')
        sTitle.innerHTML = '검색 결과'

        sConWrapper = document.createElement('div')
        sConWrapper.classList.add('dialog__lang--searchItemWrapper')

        // 선택 언어
        let cTitle, cConWrapper
        cTitle = document.createElement('h5')
        cTitle.classList.add('dialog__lang--choiceTitle')
        cTitle.innerHTML = '선택한 언어'

        cConWrapper = document.createElement('div')
        cConWrapper.classList.add('dialog__lang--choiceItemWrapper')

        // 선택 완료
        let okBtn
        okBtn = document.createElement('button')
        okBtn.classList.add('dialog__lang--ok')
        okBtn.innerHTML = '선택완료'

        itemWrappr.appendChild(title)
        itemWrappr.appendChild(input)
        itemWrappr.appendChild(subtitle)
        itemWrappr.appendChild(sTitle)
        itemWrappr.appendChild(sConWrapper)
        itemWrappr.appendChild(cTitle)
        itemWrappr.appendChild(cConWrapper)
        itemWrappr.appendChild(okBtn)

        wrapper.appendChild(itemWrappr)

        // 클릭 이벤트 관리
        // 언어 검색
        input.onkeypress = (e) => this.search(e, sConWrapper, cConWrapper)
        // 검색 <-> 직접 입력 변경
        subtitle.onclick = () => {
            isSearchMode = !isSearchMode
            if (isSearchMode) {
                sTitle.classList.add('hidden')
                sConWrapper.classList.add('hidden')
                subtitle.innerHTML = '검색해서 입력하기'
                input.onkeypress = (e) => this.insert(e, cConWrapper)
            } else {
                sTitle.classList.remove('hidden')
                sConWrapper.classList.remove('hidden')
                subtitle.innerHTML = '직접 입력하기'
                input.onkeypress = (e) => this.search(e, sConWrapper, cConWrapper)
            }
        }

        return wrapper
    }
    ideSelectDialog() {
        let isSearchMode = false

        let wrapper, itemWrappr, title, input, subtitle
        wrapper = document.createElement('div')
        wrapper.className = 'dialog'

        itemWrappr = document.createElement('div')
        itemWrappr.classList.add('dialog__item')

        title = document.createElement('h3')
        title.classList.add('dialog__lang--title')
        title.innerHTML = `IDE 선택하기`

        input = document.createElement('input')
        input.classList.add('dialog__lang--input')
        input.type = 'text'
        input.value = ''
        input.placeholder = `IDE 이름을 영어로 검색해주세요.`

        subtitle = document.createElement('p')
        subtitle.classList.add('dialog__lang--subtitle')
        subtitle.innerHTML = '직접 입력하기'

        //검색 결과
        let sTitle, sConWrapper
        sTitle = document.createElement('h5')
        sTitle.classList.add('dialog__lang--searchTitle')
        sTitle.innerHTML = '검색 결과'

        sConWrapper = document.createElement('div')
        sConWrapper.classList.add('dialog__lang--searchItemWrapper')

        // 선택 언어
        let cTitle, cConWrapper
        cTitle = document.createElement('h5')
        cTitle.classList.add('dialog__lang--choiceTitle')
        cTitle.innerHTML = '선택한 IDE'

        cConWrapper = document.createElement('div')
        cConWrapper.classList.add('dialog__lang--choiceItemWrapper')

        // 선택 완료
        let okBtn
        okBtn = document.createElement('button')
        okBtn.classList.add('dialog__lang--ok')
        okBtn.innerHTML = '선택완료'

        itemWrappr.appendChild(title)
        itemWrappr.appendChild(input)
        itemWrappr.appendChild(subtitle)
        itemWrappr.appendChild(sTitle)
        itemWrappr.appendChild(sConWrapper)
        itemWrappr.appendChild(cTitle)
        itemWrappr.appendChild(cConWrapper)
        itemWrappr.appendChild(okBtn)

        wrapper.appendChild(itemWrappr)

        // 클릭 이벤트 관리
        // 언어 검색
        input.onkeypress = (e) => this.ideSearch(e, sConWrapper, cConWrapper)
        // 검색 <-> 직접 입력 변경
        subtitle.onclick = () => {
            isSearchMode = !isSearchMode
            if (isSearchMode) {
                sTitle.classList.add('hidden')
                sConWrapper.classList.add('hidden')
                subtitle.innerHTML = '검색해서 입력하기'
                input.onkeypress = (e) => this.ideInsert(e, cConWrapper)
            } else {
                sTitle.classList.remove('hidden')
                sConWrapper.classList.remove('hidden')
                subtitle.innerHTML = '직접 입력하기'
                input.onkeypress = (e) => this.ideSearch(e, sConWrapper, cConWrapper)
            }
        }

        return [wrapper, itemWrappr]
    }

    async search(e, swrap, wrap) {
        if (e.key === 'Enter' || e.keyCode == 13) {
            const searchText = e.target.value
            // 검색 시작
            // 데이터가 없으면 최초 1번 요청
            if (!this._langServerData) {
                const resData = await this._categoryModel.getLanguage()
                this._langServerData = resData
            }
            this._langServerData.map((item) => {
                const en_name = item.en_name
                const idx = item.id
                if (en_name.indexOf(searchText) != -1) {
                    const addedItem = document.createElement('div')
                    addedItem.innerHTML = item.en_name

                    swrap.appendChild(addedItem)

                    addedItem.onclick = () => {
                        wrap.appendChild(addedItem)
                        this.langSelectData.push({
                            type: 'existing',
                            language_category_id: idx,
                            name: en_name
                        })

                        addedItem.onclick = () => {
                            wrap.removeChild(addedItem)
                            this.langSelectData.map((items, index) => {
                                if (items.language_category_id === idx) {
                                    this.langSelectData.pop(index)
                                }
                            })
                        }
                    }
                }
            })
        }
    }

    insert(e, wrap) {
        if (e.key === 'Enter') {
            // 검색 시작
            const addText = e.target.value
            // 데이터 입력
            this.langSelectData.push({
                type: 'added',
                name: addText
            })
            // 아이템 생성
            const addedItem = document.createElement('div')
            addedItem.innerHTML = addText

            // 아이템 넣기
            wrap.appendChild(addedItem)
            // 인풋 텍스트 비우기
            e.target.value = ''
            // 아이템 클릭시 삭제
            addedItem.onclick = () => {
                wrap.removeChild(addedItem)
                this.langSelectData.map((items, index) => {
                    if (items.name === addText) {
                        this.langSelectData.pop(index)
                    }
                })
            }
        }
    }

    async ideSearch(e, swrap, wrap) {
        if (e.key === 'Enter') {
            const searchText = e.target.value
            // 검색 시작
            // 데이터가 없으면 최초 1번 요청
            if (!this._ideServerData) {
                const resData = await this._categoryModel.getIde()
                this._ideServerData = resData
            }
            this._ideServerData.map((item) => {
                const en_name = item.en_name
                const idx = item.id
                if (en_name.indexOf(searchText) != -1) {
                    const addedItem = document.createElement('div')
                    addedItem.innerHTML = item.en_name

                    swrap.appendChild(addedItem)

                    addedItem.onclick = () => {
                        wrap.appendChild(addedItem)
                        this.ideSelectData.push({
                            type: 'existing',
                            ide_category_id: idx,
                            name: en_name
                        })

                        addedItem.onclick = () => {
                            wrap.removeChild(addedItem)
                            this.ideSelectData.map((items, index) => {
                                if (items.language_category_id === idx) {
                                    this.ideSelectData.pop(index)
                                }
                            })
                        }
                    }
                }
            })
        }
    }

    ideInsert(e, wrap) {
        if (e.key === 'Enter') {
            // 검색 시작
            const addText = e.target.value
            // 데이터 입력
            this.ideSelectData.push({
                type: 'added',
                name: addText
            })
            // 아이템 생성
            const addedItem = document.createElement('div')
            addedItem.innerHTML = addText

            // 아이템 넣기
            wrap.appendChild(addedItem)
            // 인풋 텍스트 비우기
            e.target.value = ''
            // 아이템 클릭시 삭제
            addedItem.onclick = () => {
                wrap.removeChild(addedItem)
                this.ideSelectData.map((items, index) => {
                    if (items.name === addText) {
                        this.ideSelectData.pop(index)
                    }
                })
            }
        }
    }
}
