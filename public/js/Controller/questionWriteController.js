import postModel from '../Model/postModel.js'
import serviceModel from '../Model/serviceCenterModel.js'
import categoryModel from '../Model/categoryModel.js'

export default class questionWriteController {
    constructor(view, utils) {
        this._view = view
        this._utils = utils

        this._categoryModel = new categoryModel()
        this._postModel = new postModel()
        this._serviceModel = new serviceModel()

        this._idx
        this.lifeCycle()
    }

    lifeCycle = async () => {
        this.setEditor()
        this.getCategory()
        this._view.getElement('#questionBtn').onclick = () => this.putQeustion()
        const titleWrap = this._view.getElement('#title')
        titleWrap.addEventListener('keydown', (e) => {
            if (titleWrap.value.length > 60) return
            this._view.getElement('#textLength').innerHTML = titleWrap.value.length
        })
    }
    getCategory = async () => {
        const resData = await this._categoryModel.getService()
        // console.log(resData)
        const selectedData = resData.find((e) => {
            if (e.name == `문의하기`) return true
        })
        this._idx = selectedData.id
    }

    setEditor = async () => {
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
                    this._utils.snackbar('이미지만 올릴 수 있습니다.')
                }
            }
        }
        // 이미지 서버 업로드
        const uploadImg = async (file) => {
            const resData = await this._postModel.uploadImage(file, file.name)
            console.log(resData)
            if (!resData || !resData[0].file_path) {
                this._utils.snackbar('이미지 업로드에 실패 했습니다.')
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

    putQeustion = async () => {
        const title = this._view.getElement('#title').value
        const content = this._view.getElement('.ql-editor').innerHTML
        const type = this._view.getElement('#category').options[this._view.getElement('#category').selectedIndex].value

        if (!type) {
            this._utils.snackbar('문의 내용 종류를 선택해주세요')
            return
        }
        if (!title) {
            this._utils.snackbar('문의 제목을 입력해주세요')
            return
        }
        if (!this._utils.removeHTMLTag(content)) {
            this._utils.snackbar('문의 내용을 작성해주세요')
            return
        }

        const resData = await this._serviceModel.putQuestion(3, type, title, content)
        if (!resData) {
            this._utils.snackbar('문의하기를 실패 하였습니다.<br />잠시 뒤 다시 시도 해 주세요.')
            return
        }
        if (!resData.post_id) {
            this._utils.snackbar('문의하기를 실패 하였습니다.<br />잠시 뒤 다시 시도 해 주세요.')
            return
        }
        window.location.href = `/questionview.html?n=${resData.post_id}`
    }
}
