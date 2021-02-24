export default class report {
    constructor() {
        this._data = [
            { name: '선택해주세요', value: '0' },
            { name: '구입처 요청', value: '1' },
            { name: '스포/낙시', value: '2' },
            { name: '매물글', value: '3' },
            { name: '과도한 친목', value: '4' },
            { name: '홍보', value: '5' },
            { name: '비매너', value: '6' },
            { name: '음란성', value: '7' },
            { name: '정치/사회 관련', value: '8' },
            { name: '허위 사실', value: '9' },
            { name: '도배성 글', value: '10' },
            { name: '투자/투기', value: '11' },
            { name: '거짓 유저 정보', value: '12' },
            { name: '기타', value: '13' }
        ]
    }

    createReportView = () => {
        const background = document.createElement('div')
        background.classList.add('report')

        const wrap = document.createElement('div')
        wrap.classList.add('report__wrap')

        const title = document.createElement('h3')
        title.classList.add('report__title')
        title.innerHTML = '신고하기'

        const subTitle = document.createElement('p')
        subTitle.classList.add('report__subTitle')
        subTitle.innerHTML = '신고 사유'

        const selector = document.createElement('select')
        selector.classList.add('report__select')

        this._data.map((e) => {
            const option = document.createElement('option')
            option.value = e.value
            option.innerHTML = e.name

            selector.appendChild(option)
        })

        const textArea = document.createElement('textarea')
        textArea.placeholder = '신고하신 내용에 대해서 의견을 적어주시면 더욱 빠르게 처리가 가능합니다.'

        const btnWrap = document.createElement('div')
        btnWrap.classList.add('report__btnWrap')
        const cancle = document.createElement('button')
        cancle.innerHTML = '취소'
        const btn = document.createElement('button')
        btn.innerHTML = '신고하기'

        btnWrap.appendChild(cancle)
        btnWrap.appendChild(btn)

        background.appendChild(wrap)

        wrap.appendChild(title)
        wrap.appendChild(subTitle)
        wrap.appendChild(selector)
        wrap.appendChild(textArea)
        wrap.appendChild(btnWrap)

        return [background, selector, textArea, btn, cancle]
    }
}
