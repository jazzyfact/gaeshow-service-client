import utils from '../Core/Singleton/utils.js'
import postModel from '../Model/postModel.js'
import View from '../Core/Mvc/View.js'
import portfolioItem from '../View/portfolioItem.js'
import categoryModel from '../Model/categoryModel.js'
import usersModel from '../Model/usersModel.js'
import storeModel from '../Model/storeModel.js'

const typePortfolio = 'portfolio'
const typeBoard = 'board'
const typeBadMouse = 'badmouse'
const typeTip = 'tip'
const typeWorkspace = 'workspace'

export default class portfolioWriteController {
    constructor(isLogin, type, myInfo) {
        // console.log(type)
        this._myInfo = myInfo
        this._postIdx = utils().getParameterByName('p')
        this._postModel = new postModel()
        this._view = new View()
        this._portfolioItem = new portfolioItem()
        this._categoryModel = new categoryModel()
        this._usersModel = new usersModel()
        this._storeModel = new storeModel()
        this._isLogin = isLogin
        this._type = type
        this._categoryIdx
        this._tagData = []
        this._imgId
        this._imgUrl
        // 공통
        this._titleInput = this._view.getElement('#title')
        this._addPostBtn = this._view.getElement('#addPost')
        this._addPostBtn.onclick = () => this.addPost()

        // 포폴용
        if (this._type == typePortfolio) {
            flatpickr(this._view.getElement('#date'), {})
            this._dateInput = this._view.getElement('#date')

            this._inputPlatform = this._view.getElement('#inputPlatform')
            this._inputLang = this._view.getElement('#inputLang')
            this._inputIDE = this._view.getElement('#inputIDE')

            this._inputPlatform.onkeypress = (e) => this.addTag('platform', e, this._inputPlatform.value)
            this._inputLang.onkeypress = (e) => this.addTag('language', e, this._inputLang.value)
            this._inputIDE.onkeypress = (e) => this.addTag('ide', e, this._inputIDE.value)
        }
        // 기타 추가
        if (this._type == typeBoard) {
            this._inputEtc = this._view.getElement('#inputEtc')
            this._inputEtc.onkeypress = (e) => this.addTag('etc', e, this._inputEtc.value, 'red--bg')
        }
        if (this._type == typeBadMouse) {
            this._inputEtc = this._view.getElement('#inputEtc')
            this._inputEtc.onkeypress = (e) => this.addTag('etc', e, this._inputEtc.value, 'yellow--bg')
        }
        if (this._type == typeTip) {
            this._inputEtc = this._view.getElement('#inputEtc')
            this._inputEtc.onkeypress = (e) => this.addTag('etc', e, this._inputEtc.value, 'orange--bg')
        }
        if (this._type == typeWorkspace) {
            this._inputEtc = this._view.getElement('#inputEtc')
            // this._inputEtc.onkeypress = (e) => this.addTag('etc', e, this._inputEtc.value, 'gray--border')
            this.setWorkspaceImg()
        }

        this.lifeCycle()
    }

    lifeCycle = async () => {
        this.getCategory()
        await this.setEditor()
        if (this._postIdx) {
            // 수정 모드
            // console.log(this._isLogin)
            if (!this._isLogin) window.location.href = '/portfolio__write.html'
            this._addPostBtn.innerHTML = `게시물 수정하기`
            await this.setModData()
        }
    }
    getCategory = async () => {
        const resData = await this._categoryModel.getPost()
        // console.log(resData)
        if (resData) {
            resData.map((item) => {
                if (item.name == '자기 작업물 자랑' && this._type == typePortfolio) {
                    this._categoryIdx = item.id
                    return
                }
                if (item.name == '업무 얘기 공유' && this._type == typeBoard) {
                    this._categoryIdx = item.id
                    return
                }
                if (item.name == '회사 욕 하기' && this._type == typeBadMouse) {
                    this._categoryIdx = item.id
                    return
                }
                if (item.name == '프리랜서 팁 공유' && this._type == typeTip) {
                    this._categoryIdx = item.id
                    return
                }
                if (item.name == '워크스페이스 공유' && this._type == typeWorkspace) {
                    this._categoryIdx = item.id
                    return
                }
            })
        }
    }
    setEditor = async () => {
        // await import(`../../res/library/quill/dist/quill.js`)
        // await import(`../../res/library/quill/quill-image-resize/image-resize.min.js`)

        const toolbarOptions = [
            ['bold', 'italic', 'underline', 'strike'], // toggled buttons
            ['blockquote', 'code-block'],
            ['image'],

            [{ header: 1 }, { header: 2 }], // custom button values
            [{ list: 'ordered' }, { list: 'bullet' }],
            [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
            [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
            [{ direction: 'rtl' }], // text direction

            [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
            [{ header: [1, 2, 3, 4, 5, 6, false] }],

            [{ color: [] }, { background: [] }], // dropdown with defaults from theme
            [{ font: [] }],
            [{ align: [] }],

            ['clean'] // remove formatting button
        ]
        // 퀼 생성
        this._quill = new Quill('#quill', {
            modules: {
                toolbar: toolbarOptions,
                imageResize: {}
            },
            theme: 'snow',
            placeholder: '내용을 입력해주세요',
            height: '30rem'
        })

        // 이미지 툴바 이벤트 캐치
        const selectLocalImg = () => {
            const input = document.createElement('input')
            input.setAttribute('type', 'file')
            input.click()

            input.onchange = () => {
                const file = input.files[0]

                // file type is only image.
                if (/^image\//.test(file.type)) {
                    uploadImg(file)
                } else {
                    utils().snackbar('이미지만 올릴 수 있습니다.')
                }
            }
        }
        // 이미지 서버 업로드
        const uploadImg = async (file) => {
            const resData = await this._postModel.uploadImage(file, file.name)
            // console.log(resData)
            if (!resData || !resData[0].file_path) {
                utils().snackbar('이미지 업로드에 실패 했습니다.')
                return
            }

            insertToEditor(resData[0].file_path)
        }
        // 에디터에 추가
        const insertToEditor = (url) => {
            const range = this._quill.getSelection()
            this._quill.insertEmbed(range.index, 'image', url)
        }

        this._quill.getModule('toolbar').addHandler('image', () => selectLocalImg())
    }

    setModData = async () => {
        const resData = await this._postModel.getPostDetail(this._postIdx, this._postIdx)
        console.log(resData)
        const { title, content, tags, thumbnail, release_date } = resData
        this._titleInput.value = title
        this._view.getElement('.ql-editor').innerHTML = content

        this._inputPlatform = this._view.getElement('#inputPlatform')
        this._inputLang = this._view.getElement('#inputLang')
        this._inputIDE = this._view.getElement('#inputIDE')

        if (this._type == typePortfolio) {
            this._dateInput.value = release_date.split('.').join('-')
            tags.map((e) => {
                e.key = 'Enter'
                this.addTag(e.type, e, e.name)
            })
        }
        // 기타 추가
        if (this._type == typeBoard) {
            tags.map((e) => {
                e.key = 'Enter'
                this.addTag(e.type, e, e.name, 'red--bg')
            })
        }
        if (this._type == typeBadMouse) {
            tags.map((e) => {
                e.key = 'Enter'
                this.addTag(e.type, e, e.name, 'yellow--bg')
            })
        }
        if (this._type == typeTip) {
            tags.map((e) => {
                e.key = 'Enter'
                this.addTag(e.type, e, e.name, 'orange--bg')
            })
        }
        if (this._type == typeWorkspace) {
            const imgWrap = this._view.getElement('#selecImgWrap')
            const imgView = this._view.getElement('#selectImgView')
            const profileLabel = this._view.getElement(`#selectLabel`)
            // 이미지 뷰 등록
            imgWrap.classList.remove('hidden')
            imgView.src = thumbnail
            profileLabel.classList.add('hidden')
            tags.map((e) => {
                e.key = 'Enter'
                e.offsetY = e.y
                e.offsetX = e.x
                this.getImgClickLocation(e)
            })
        }
    }

    // 태그를 추가하는 이벤트
    addTag = async (type, e, value, className, workspaceData = {}) => {
        if (e.key === 'Enter') {
            if (!value) {
                utils().snackbar('태그를 입력 해주세요.')
                return
            }
            let tagData = {
                type: type,
                name: value
            }
            // console.log(workspaceData)
            if (workspaceData.x) {
                tagData.x = workspaceData.x
                tagData.y = workspaceData.y
                tagData.type = workspaceData.type
                tagData.items = workspaceData.items
            }
            if (workspaceData.product_id) {
                tagData.product_id = workspaceData.product_id
            }
            this._tagData.push(tagData)
            // console.log(this._tagData)

            const addedItem = this._portfolioItem.createTagItem(tagData, className)
            // 스스로를 클릭하면 지우도록
            addedItem.onclick = () => {
                const index = this._tagData.indexOf(tagData)
                this._tagData.splice(index, 1)
                addedItem.parentNode.removeChild(addedItem)
                // 워크스페이스 태그 삭제시, 이미지뷰의 아이템도 삭제
                if (workspaceData.x) {
                    const item = workspaceData.items[0]
                    item.parentNode.removeChild(item)
                }
            }
            // 워크스페이스 태그 호버시 이미지뷰의 아이템도 보여주게함
            if (workspaceData.x) {
                addedItem.onmouseenter = () => {
                    if (workspaceData.type == 'added') {
                        workspaceData.items[7].classList.remove('hidden')
                    }
                    if (workspaceData.type == 'existing') {
                        console.log(workspaceData)
                        workspaceData.items[6].classList.remove('hidden')
                    }
                }
                addedItem.onmouseleave = () => {
                    if (workspaceData.type == 'added') {
                        workspaceData.items[7].classList.add('hidden')
                    }
                    if (workspaceData.type == 'existing') {
                        workspaceData.items[6].classList.add('hidden')
                    }
                }
            }

            // 타입별 구분
            switch (type) {
                case 'platform':
                    this._inputPlatform.parentNode.insertBefore(addedItem, this._inputPlatform)
                    this._inputPlatform.value = ``
                    break
                case 'language':
                    this._inputLang.parentNode.insertBefore(addedItem, this._inputLang)
                    this._inputLang.value = ``
                    break
                case 'ide':
                    this._inputIDE.parentNode.insertBefore(addedItem, this._inputIDE)
                    this._inputIDE.value = ``
                    break
                default:
                    this._inputEtc.parentNode.insertBefore(addedItem, this._inputEtc)
                    this._inputEtc.value = ``
                    break
            }
        }
    }

    setWorkspaceImg = async () => {
        const imgWrap = this._view.getElement('#selecImgWrap')
        const imgDeleteBtn = this._view.getElement('#selectDeleteBtn')
        const profileLabel = this._view.getElement(`#selectLabel`)
        imgDeleteBtn.onclick = () => imageFileDelete()
        const imgView = this._view.getElement('#selectImgView')
        imgView.onclick = (e) => this.getImgClickLocation(e)
        const imageInput = this._view.getElement('#selectImg')

        imageInput.onchange = () => imageFileUpload(imageInput)
        // 워크스페이스 이미지 세팅
        const imageFileUpload = async (element) => {
            const imgFiles = element.files
            // 예외처리
            if (!imgFiles || imgFiles.lenth === 0) {
                utils().snackbar(`이미지 파일을 선택해주세요.`)
                return
            }

            // 파일 정보 파싱
            const { name, lastModified, size, type } = imgFiles[0]
            const imgUrl = URL.createObjectURL(imgFiles[0])
            // 이미지 업로드 진행
            // console.log(imgFiles[0])
            const resData = await this._postModel.uploadImage(imgFiles[0], name)
            // const resData = await this._usersModel.profileImgUpload(imgFiles[0], name)
            // 리스폰 데이터 성공
            const { attach_id, file_path } = resData[0]
            this._imgId = attach_id
            this._imgUrl = file_path
            // console.log(resData[0])

            // 클라 화면에 이미지 배치
            imgWrap.classList.remove('hidden')
            imgView.src = imgUrl

            profileLabel.classList.add('hidden')
        }
        //  이미지 삭제
        const imageFileDelete = async () => {
            this._imgId = null
            this._imgUrl = null

            imgWrap.classList.add('hidden')

            const profileLabel = this._view.getElement(`#selectLabel`)
            profileLabel.classList.remove('hidden')

            this.resetTag()
            this.resetImgViewLabel()
        }
    }

    getImgClickLocation = async (e) => {
        // console.log(e)
        // 태그로써 등록되지 않은 아이템들 모두 지우기 등록 이전 임시 화면 제거
        const workspaces = this._view.getElements('.workspace__items')

        for (let i = 0; i < workspaces.length; i++) {
            const workspace = workspaces[i]
            let isAdded = false

            this._tagData.map((e) => {
                if (e.x && e.y) {
                    let x = workspace.style.left
                    let y = workspace.style.top
                    x = x.replace('%', '')
                    y = y.replace('%', '')

                    console.log(x, y, e.x, e.y)
                    // 동일한 지점 클릭인식
                    // 소수점 4번째 자리까지 같은 것으로 인식 했으나 너무 정밀해서 같은것으로 인식 못함
                    // if (parseFloat(e.x) == parseFloat(x) && parseFloat(e.y) == parseFloat(y)) {
                    //     isAdded = true
                    // }
                    // 소수점 1번째 자리까지 같다면 같은것으로 인식
                    if (parseFloat(e.x).toFixed(1) == parseFloat(x).toFixed(1) && parseFloat(e.y).toFixed(1) == parseFloat(y).toFixed(1)) {
                        isAdded = true
                    }
                }
            })

            if (!isAdded) {
                workspace.parentNode.removeChild(workspace)
            }
        }
        // 데이터
        let addedData = {}

        // 넣을 이미지 뷰 (부모)
        const parentWrap = this._view.getElement(`#selecImgWrap`)
        const imgView = this._view.getElement(`#selectImgView`)
        // 이미지의 가로 세로 크기
        const { clientWidth, clientHeight } = imgView
        // 클릭한 위치의 위치값
        const { offsetX, offsetY, clientX } = e
        // console.log(e)
        const browserWidth = window.innerWidth
        let itemList
        // 수정 모드 구분
        // 수정 모드는 id 값 기준으로 판단.
        if (this._postIdx && e.id && e.type) {
            // 수정시에는 들어온 값 그대로 넣음
            addedData.x = offsetX
            addedData.y = offsetY
            itemList = this._portfolioItem.createWrokspacePhotoItem(offsetX, offsetY, e.name)
        } else {
            // 퍼센트값 구하기
            const xPer = (offsetX / clientWidth) * 100
            const yPer = (offsetY / clientHeight) * 100
            // console.log(xPer, yPer)
            addedData.x = xPer.toFixed(4)
            addedData.y = yPer.toFixed(4)
            itemList = this._portfolioItem.createWrokspacePhotoItem(xPer, yPer, '')
        }
        // 모바일 대응 , 화면 크기에 따라서 검색하는 자식 아이템이 벗어나게 되면 좌측으로 옮김
        // console.log(browserWidth, clientX)
        if (clientX < 0) clientX * -1
        console.log(browserWidth, clientX)
        // 클릭 위치를 세로 3등분 한다
        // 왼쪽 클릭 영역
        const leftSideArea = browserWidth - 260
        const rightSideArea = 260
        if (leftSideArea > clientX) {
            //왼쪽 클릭
            // itemList[7].style.transform = `translate(-50%,2rem)`
            // itemList[6].style.transform = `translate(-50%,2rem)`
        } else if (rightSideArea < clientX) {
            itemList[7].style.transform = `translate(-100%,2rem)`
            itemList[6].style.transform = `translate(-100%,2rem)`
        } else {
            itemList[7].style.transform = `translate(-50%,2rem)`
            itemList[6].style.transform = `translate(-50%,2rem)`
        }

        if (browserWidth < clientX + 200) {
        }

        const selectedItem = itemList[0]
        // console.log(selectedItem)

        // console.log(selectedItem)
        parentWrap.appendChild(selectedItem)
        // 스토어 검색 시작
        const storeSearchStart = async (value) => {
            // 기존 아이템 지우기
            while (itemList[3].hasChildNodes()) {
                itemList[3].removeChild(itemList[3].firstChild)
            }
            // 검색 진행
            const reqData = {}
            reqData.page = 1
            reqData.limit = 3
            reqData.filter = 'view'
            reqData.search_type = 'name'
            reqData.search_word = value
            reqData.category_id = 1

            const resData = await this._storeModel.getList(reqData)
            const { product_count, products } = resData

            if (product_count == 0) {
                itemList[2].classList.remove('hidden')
                itemList[2].innerHTML = '검색 결과가 없습니다.'
            } else {
                itemList[2].classList.remove('hidden')
                itemList[3].classList.remove('hidden')
                itemList[2].innerHTML = '검색 결과'
                products.map((e) => {
                    const items = this._portfolioItem.createWorkspacePhotoSearchItem(e)
                    itemList[3].append(items[0])
                    items[1].onclick = () => storeSearchItemSet(items[2], items[0], items[1])
                })
            }
        }
        // 스토어 검색 결과 보여주기
        const storeSearchItemSet = (data, self, btn) => {
            // console.log(data)
            addedData.type = `existing`
            addedData.name = data.name
            addedData.product_id = data.id
            addedData.items = itemList
            let e = { key: `Enter` }
            this.addTag('etc', e, data.name, 'gray--border', addedData)
            closeAndHoverEvent('existing')

            // 선택된 자기 자신만 강조 색상을 넣어줌
            // console.log(itemList[3].childNodes)
            const copySelf = self.cloneNode(true)
            while (itemList[3].hasChildNodes()) {
                itemList[3].removeChild(itemList[3].firstChild)
            }
            itemList[3].appendChild(copySelf)
            itemList[1].classList.add('hidden')
            itemList[2].classList.add('hidden')
            btn.classList.add('hidden')
            this._view.getElement('.workspace__items--add--inputWrap', itemList[0]).classList.add('hidden')
            this._view.getElement('.workspace__items--add--title', itemList[0]).classList.add('hidden')
            this._view.getElement('.workspace__items--add--change', itemList[0]).classList.add('hidden')
            this._view.getElementsByTagName('button', itemList[0])[0].classList.add('hidden')
        }
        const directAdd = (value) => {
            // console.log(value)
            addedData.type = 'added'
            addedData.name = value
            addedData.items = itemList
            let e = { key: `Enter` }
            this.addTag('etc', e, value, 'gray--border', addedData)
            closeAndHoverEvent('added')
        }

        const closeAndHoverEvent = (type) => {
            itemList[6].classList.add('hidden')
            itemList[7].classList.add('hidden')

            if (type == 'added') {
                itemList[8].onclick = () => {
                    if (itemList[7].classList.contains('hidden')) {
                        itemList[7].classList.remove('hidden')
                    } else {
                        itemList[7].classList.add('hidden')
                    }
                }
            } else {
                itemList[8].onclick = () => {
                    if (itemList[6].classList.contains('hidden')) {
                        itemList[6].classList.remove('hidden')
                    } else {
                        itemList[6].classList.add('hidden')
                    }
                }
            }
        }

        // 수정모드 인지 구분 해서 수정일때에는 강제 입력
        if (this._postIdx && e.type == 'added') {
            // 직접 등록한 태그
            directAdd(e.name)
        } else if (this._postIdx && e.type == 'existing') {
            // 상품 검색
            console.log('상품 검색', e)
        } else {
            // 새등록
            //검색
            itemList[1].onkeypress = (e) => {
                if (e.key != 'Enter') return
                const value = itemList[1].value
                if (!value) return
                storeSearchStart(value)
            }

            // 직접 등록
            itemList[4].onkeypress = (e) => {
                if (e.key != 'Enter') return
                const value = itemList[4].value
                if (!value) return
                directAdd(value)
                itemList[4].readOnly = true
                itemList[4].onkeypress = {}
                itemList[5].classList.add('hidden')
                itemList[10].classList.add('hidden')
            }
            itemList[5].onclick = () => {
                const value = itemList[4].value
                itemList[4].readOnly = true
                if (!value) return
                directAdd(value)

                itemList[4].readOnly = true
                itemList[4].onkeypress = {}
                itemList[5].classList.add('hidden')
                itemList[10].classList.add('hidden')
            }
        }
    }

    // 포스트 등록
    addPost = async () => {
        // 텍스트 검사
        if (!this._titleInput.value) {
            utils().snackbar('제목을 입력해주세요')
            return
        }
        // 에디터 내용
        if (!utils().removeHTMLTag(this._view.getElement('.ql-editor').innerHTML)) {
            utils().snackbar('내용을 입력해주세요')
            return
        }
        // 워크스페이스의 경우 이미지 없으면 빠꾸!
        if (!this._imgId) {
            utils().snackbar(`워크스페이스 등록은 이미지가 필요합니다.`)
            return
        }
        // 데이터 수집
        let reqData = {
            category_id: this._categoryIdx,
            title: this._titleInput.value,
            content: this._view.getElement('.ql-editor').innerHTML,
            tags: this._tagData
        }
        // console.log(reqData)
        // return

        // 포트폴리오
        if (this._type == typePortfolio) {
            // 출시일
            if (!this._dateInput.value) {
                utils().snackbar('출시일을 입력 해주세요')
                return
            }
            reqData.release_date = this._dateInput.value
        }
        if (this._type == typeWorkspace) {
            reqData.thumbnail_id = this._imgId
        }

        let resData
        if (!this._postIdx) {
            resData = await this._postModel.addPost(reqData)
            if (!resData.post_id) {
                utils().snackbar('게시물 등록에 실패 했습니다. 다시 시도해주세요.')
                return
            }
            if (this._type == typePortfolio) window.location.href = `/portfolioview.html?n=${resData.post_id}`
            if (this._type == typeBoard) window.location.href = `/boardview.html?n=${resData.post_id}`
            if (this._type == typeBadMouse) window.location.href = `/badmouseview.html?n=${resData.post_id}`
            if (this._type == typeTip) window.location.href = `/tipsview.html?n=${resData.post_id}`
            if (this._type == typeWorkspace) window.location.href = `/workspace.html?n=${resData.post_id}`
        }
        if (this._postIdx) {
            resData = await this._postModel.modPost(reqData, this._postIdx)
            if (resData.stats != 'ok') {
                utils().snackbar('게시물 수정에 실패 했습니다. 다시 시도해주세요.')
                return
            }
            if (this._type == typePortfolio) window.location.href = `/portfolioview.html?n=${this._postIdx}`
            if (this._type == typeBoard) window.location.href = `/boardview.html?n=${this._postIdx}`
            if (this._type == typeBadMouse) window.location.href = `/badmouseview.html?n=${this._postIdx}`
            if (this._type == typeTip) window.location.href = `/tipsview.html?n=${this._postIdx}`
            if (this._type == typeWorkspace) window.location.href = `/workspace.html?n=${this._postIdx}`
        }
    }

    resetTag = () => {
        // 태그 모두 삭제
        this._tagData = []
        const tagWrap = this._view.getElement('#inputEtc').parentNode
        const tagItems = this._view.getElementsByTagName('p', tagWrap)

        const removeRepeat = (items) => {
            if (tagItems.length > 0) {
                items[0].parentNode.removeChild(items[0])
                return removeRepeat(items)
            }
        }
        removeRepeat(tagItems)
    }

    resetImgViewLabel = () => {
        const items = this._view.getElements('.workspace__items')
        // console.log(items)
        for (let i = 0; i < items.length; i++) {
            items[i].parentNode.removeChild(items[i])
        }
    }
}
