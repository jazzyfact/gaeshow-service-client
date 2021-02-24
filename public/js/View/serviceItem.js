export default class serviceItem {
    constructor() {}

    createNoticeItem = (data) => {
        const { post_id, category_id, title, content, date, profile_nickname } = data

        const wrapper = document.createElement('div')
        wrapper.classList.add('body__item')
        wrapper.setAttribute('id', post_id)

        const bodyWrap = document.createElement('div')
        bodyWrap.classList.add('body__item--origin')

        // 인덱스
        const idxWrap = document.createElement('div')
        idxWrap.classList.add('body__item--origin--idx')
        idxWrap.innerHTML = post_id

        // 제목
        const headerWrap = document.createElement('div')
        headerWrap.classList.add('body__item--origin--main')
        const titleWrap = document.createElement('h4')
        titleWrap.innerHTML = `${title}`
        headerWrap.appendChild(titleWrap)

        // 날짜
        const dateWrap = document.createElement('div')
        dateWrap.classList.add('body__item--origin--date')
        const preWrap = document.createElement('p')
        preWrap.innerHTML = date.split(' ')[0]
        const nextWrap = document.createElement('p')
        nextWrap.innerHTML = `${date.split(' ')[1]} ${date.split(' ')[2]}`
        dateWrap.appendChild(preWrap)
        dateWrap.appendChild(nextWrap)

        bodyWrap.appendChild(idxWrap)
        bodyWrap.appendChild(headerWrap)
        bodyWrap.appendChild(dateWrap)

        const contentWrap = document.createElement('p')
        contentWrap.classList.add('body__item--content')
        contentWrap.classList.add('hidden')
        contentWrap.innerHTML = content

        wrapper.onclick = () => {
            if (contentWrap.classList.contains('hidden')) contentWrap.classList.remove('hidden')
            else contentWrap.classList.add('hidden')
        }
        wrapper.appendChild(bodyWrap)
        wrapper.appendChild(contentWrap)

        return wrapper
    }

    createFaQItem = (data) => {
        const { post_id, category_id, title, content, date, profile_nickname } = data

        const wrapper = document.createElement('div')
        wrapper.classList.add('body__item')
        wrapper.setAttribute('id', post_id)

        const bodyWrap = document.createElement('div')
        bodyWrap.classList.add('body__item--origin')

        // 인덱스
        const idxWrap = document.createElement('div')
        idxWrap.classList.add('body__item--origin--idx')
        idxWrap.innerHTML = post_id

        // 제목
        const headerWrap = document.createElement('div')
        headerWrap.classList.add('body__item--origin--main')
        const titleWrap = document.createElement('h4')
        titleWrap.innerHTML = `<b>Q </b>${title}`
        headerWrap.appendChild(titleWrap)

        // 날짜
        const dateWrap = document.createElement('div')
        dateWrap.classList.add('body__item--origin--date')
        const preWrap = document.createElement('p')
        preWrap.innerHTML = date.split(' ')[0]
        const nextWrap = document.createElement('p')
        nextWrap.innerHTML = `${date.split(' ')[1]} ${date.split(' ')[2]}`
        dateWrap.appendChild(preWrap)
        dateWrap.appendChild(nextWrap)

        bodyWrap.appendChild(idxWrap)
        bodyWrap.appendChild(headerWrap)
        bodyWrap.appendChild(dateWrap)

        const conWrap = document.createElement('div')
        conWrap.classList.add('body__item--content')
        conWrap.classList.add('hidden')

        const p1 = document.createElement('b')
        p1.classList.add('red')
        p1.innerHTML = 'A '
        const contentWrap = document.createElement('p')
        contentWrap.innerHTML = content

        conWrap.appendChild(p1)
        conWrap.appendChild(contentWrap)

        wrapper.onclick = () => {
            if (conWrap.classList.contains('hidden')) conWrap.classList.remove('hidden')
            else conWrap.classList.add('hidden')
        }
        wrapper.appendChild(bodyWrap)
        wrapper.appendChild(conWrap)

        return wrapper
    }

    createQuestionItem = (data) => {
        const { post_id, category_id, title, content, date, profile_nickname } = data

        const wrapper = document.createElement('a')
        wrapper.classList.add('body__item')
        wrapper.setAttribute('id', post_id)
        wrapper.href = `/questionview.html?n=${post_id}`

        const bodyWrap = document.createElement('div')
        bodyWrap.classList.add('body__item--origin')

        // 인덱스
        const idxWrap = document.createElement('div')
        idxWrap.classList.add('body__item--origin--idx')
        idxWrap.innerHTML = post_id

        // 제목
        const headerWrap = document.createElement('div')
        headerWrap.classList.add('body__item--origin--main')
        const titleWrap = document.createElement('h4')
        titleWrap.innerHTML = `${title}`
        headerWrap.appendChild(titleWrap)

        // 날짜
        const dateWrap = document.createElement('div')
        dateWrap.classList.add('body__item--origin--date')
        const preWrap = document.createElement('p')
        preWrap.innerHTML = date.split(' ')[0]
        const nextWrap = document.createElement('p')
        nextWrap.innerHTML = `${date.split(' ')[1]} ${date.split(' ')[2]}`
        dateWrap.appendChild(preWrap)
        dateWrap.appendChild(nextWrap)

        bodyWrap.appendChild(idxWrap)
        bodyWrap.appendChild(headerWrap)
        bodyWrap.appendChild(dateWrap)

        wrapper.onclick = () => {}
        wrapper.appendChild(bodyWrap)

        return wrapper
    }
    createReportItem = (myInfo, data) => {
        const { post_id, title, reason, content, date, process_status } = data
        const { profile_nickname, profile_image_url } = myInfo
        console.log(data)
        const itemWrap = document.createElement('div')

        const bodyItem = document.createElement('div')
        bodyItem.classList.add('body__item')

        const pIdx = document.createElement('p')
        pIdx.classList.add('body__item--idx')
        pIdx.innerHTML = post_id

        let user, userImg, userFigcap
        user = document.createElement('figure')
        userImg = document.createElement('img')
        userFigcap = document.createElement('figcaption')

        user.classList.add('body__item--writer')
        // userImg.src = profile_image_url
        // userImg.alt = '프로필 이미지'
        userFigcap.innerHTML = profile_nickname

        // user.appendChild(userImg)
        user.appendChild(userFigcap)

        let titleP = document.createElement('p')
        titleP.classList.add('body__item--title')
        titleP.innerHTML = content

        let statusP = document.createElement('p')
        statusP.classList.add('body__item--status')
        statusP.innerHTML = reason

        let directP = document.createElement('p')
        directP.classList.add('body__item--direct')
        directP.innerHTML = process_status

        bodyItem.appendChild(pIdx)
        bodyItem.appendChild(user)
        bodyItem.appendChild(titleP)
        bodyItem.appendChild(statusP)
        bodyItem.appendChild(directP)

        itemWrap.appendChild(bodyItem)

        // 신고 응답처리
        let resWrap, resTitle, resBody

        resWrap = document.createElement('div')
        resTitle = document.createElement('h3')
        resBody = document.createElement('p')

        resWrap.appendChild(resTitle)
        resWrap.appendChild(resBody)

        resWrap.classList.add('body__item--res')
        resWrap.classList.add('hidden')

        resTitle.innerHTML = `답변이 완료 되었습니다.`
        resBody.innerHTML = `답글 내용 들어갑니다`

        itemWrap.appendChild(resWrap)

        let isOpen = false

        bodyItem.onclick = () => {
            if (!isOpen) {
                isOpen = true
                resWrap.classList.remove('hidden')
            } else {
                isOpen = false
                resWrap.classList.add('hidden')
            }
        }
        return itemWrap
    }
}
