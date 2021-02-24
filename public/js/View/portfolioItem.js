export default class portfolioItem {
    constructor() {}

    getItem = (data, type) => {
        // console.log(data)
        const Wrapper = document.createElement('a')
        Wrapper.classList.add('body__item')

        if (type == 'portfolio') Wrapper.href = `/portfolioview.html?n=${data.post_id}`
        if (type == 'board') Wrapper.href = `/boardview.html?n=${data.post_id}`
        if (type == 'badmouse') Wrapper.href = `/badmouseview.html?n=${data.post_id}`
        if (type == 'tip') Wrapper.href = `/tipsview.html?n=${data.post_id}`

        // 게시물 번호
        const itemIdx = document.createElement('div')
        itemIdx.classList.add('body__item--idx')
        itemIdx.innerHTML = data.post_id

        let desWrapper, title, des, ext
        desWrapper = document.createElement('div')
        desWrapper.classList.add('body__item--main')

        title = document.createElement('div')
        title.classList.add('body__item--main--title')

        let titleBase, titleShirink

        titleBase = document.createElement('h4')
        titleBase.innerHTML = data.title

        titleShirink = document.createElement('p')

        title.appendChild(titleBase)
        title.appendChild(titleShirink)

        des = document.createElement('p')
        des.classList.add('body__item--main--des')
        des.innerHTML = data.content.replace(/(<([^>]+)>)/gi, '')

        ext = document.createElement('p')
        ext.classList.add('body__item--main--ext')
        ext.innerHTML = `<a class="black">${data.date}</a><a>조회수 ${data.view_count}회</a><a>공유횟수 ${data.share_count}회</a><a>댓글 ${data.comment_count}개</a>`

        let box, buttonWrapepr, roundWrapper
        box = document.createElement('div')
        box.classList.add('body__item--main--box')

        buttonWrapepr = document.createElement('div')
        buttonWrapepr.classList.add('box--button')

        data.tags.map((item) => {
            let temp, classname
            // console.log(item)
            if (type == 'board') classname = 'red--bg'
            if (type == 'badmouse') classname = 'yellow--bg'
            if (type == 'tip') classname = 'orange--bg'
            temp = this.createTagItem(item, classname)

            buttonWrapepr.appendChild(temp)
        })
        roundWrapper = document.createElement('div')
        roundWrapper.classList.add('box--round')

        const bookmark = document.createElement('figure')
        const bookmarkImg = document.createElement('img')
        const bookmarkCaption = document.createElement('figcaption')

        bookmarkImg.src = '../res/img/icon_bookmark.svg'
        bookmarkImg.alt = '북마크 아이콘'

        bookmarkCaption.innerHTML = data.bookmark_count

        bookmark.appendChild(bookmarkImg)
        bookmark.appendChild(bookmarkCaption)

        const like = document.createElement('figure')
        const likeImg = document.createElement('img')
        const likeCaption = document.createElement('figcaption')

        likeImg.src = '../res/img/icon_like.svg'
        likeImg.alt = '좋아요 아이콘'

        likeCaption.innerHTML = data.liked

        like.appendChild(likeImg)
        like.appendChild(likeCaption)

        roundWrapper.appendChild(like)
        roundWrapper.appendChild(bookmark)

        box.appendChild(buttonWrapepr)
        box.appendChild(roundWrapper)

        desWrapper.appendChild(title)
        desWrapper.appendChild(des)
        desWrapper.appendChild(ext)
        desWrapper.appendChild(box)

        let writer, writerFig, writerImg, writerCaption, writerP
        writer = document.createElement('div')
        writer.classList.add('body__item--writer')

        writerFig = document.createElement('figure')

        writerImg = document.createElement('img')
        writerImg.src = data.profile_image_url
        writerImg.alt = `${data.profile_nickname}의 프로필 사진`

        writerCaption = document.createElement('figcaption')
        writerCaption.innerHTML = data.profile_nickname

        writerFig.appendChild(writerImg)
        writerFig.appendChild(writerCaption)

        writerP = document.createElement('p')
        // 아이템 파싱
        // 없는 것은 어레이에 넣지 않고 진행
        const tempArr = []
        // console.log(data.job_type, data.experience_years, data.working_area)
        if (data.job_type) tempArr.push(`${data.job_type}`)
        if (data.experience_years) tempArr.push(`${data.experience_years}`)
        if (data.working_area) tempArr.push(`${data.working_area}`)

        if (tempArr.length > 0) writerP.innerHTML = `${tempArr.join(' / ')}`
        else writerP.innerHTML = ''

        writer.appendChild(writerFig)
        writerCaption.appendChild(writerP)
        // writer.appendChild(writerP)

        const date = document.createElement('div')
        date.classList.add('body__item--date')

        const dateP = document.createElement('p')
        dateP.innerHTML = data.date

        date.appendChild(dateP)

        Wrapper.appendChild(itemIdx)
        Wrapper.appendChild(desWrapper)
        Wrapper.appendChild(writer)
        Wrapper.appendChild(date)
        return Wrapper
    }

    createTagItem = (tagData, className) => {
        const temp = document.createElement('p')
        switch (tagData.type) {
            case 'platform':
                temp.classList.add('purple--bg')
                break
            case 'language':
                temp.classList.add('blue--bg')
                break
            case 'ide':
                temp.classList.add('green--bg')
                break
            default:
                if (className == 'gray--border') {
                    temp.classList.add('gray--border')
                    temp.classList.add('gray')
                } else {
                    temp.classList.add(className)
                }

                break
        }
        temp.innerHTML = tagData.name

        return temp
    }

    createWorkSpaceListItem = (data) => {
        const wrap = document.createElement('a')
        wrap.classList.add('body__item')

        let fig, img, background
        fig = document.createElement('figure')
        img = document.createElement('img')
        background = document.createElement('div')
        background.classList.add('background')

        let figCap, span1, span2, span1_img, span2_img, span1_p, span2_p

        figCap = document.createElement('figcaption')
        span1 = document.createElement('span')
        span2 = document.createElement('span')
        span1_img = document.createElement('img')
        span2_img = document.createElement('img')
        span1_p = document.createElement('p')
        span2_p = document.createElement('p')

        span1.appendChild(span1_img)
        span1.appendChild(span1_p)
        span2.appendChild(span2_img)
        span2.appendChild(span2_p)
        figCap.appendChild(span1)
        figCap.appendChild(span2)

        fig.appendChild(img)
        fig.appendChild(background)
        fig.appendChild(figCap)

        let divWrap
        divWrap = document.createElement('div')

        let div, h4, span, p1, p2, p3
        div = document.createElement('div')
        h4 = document.createElement('h4')
        span = document.createElement('span')
        p1 = document.createElement('p1')
        p2 = document.createElement('p2')
        p3 = document.createElement('p3')

        span.appendChild(p1)
        span.appendChild(p2)
        span.appendChild(p3)

        div.appendChild(h4)
        div.appendChild(span)

        let fig2, img2, figCap2
        fig2 = document.createElement('figure')
        img2 = document.createElement('img')
        figCap2 = document.createElement('figcaption')

        fig2.appendChild(img2)
        fig2.appendChild(figCap2)

        divWrap.appendChild(div)
        divWrap.appendChild(fig2)

        wrap.appendChild(fig)
        wrap.appendChild(divWrap)

        // data insert
        wrap.href = `/workspace.html?n=${data.post_id}`
        if (data.thumbnail) img.src = data.thumbnail
        else img.src = `../res/img/logo.svg`
        //
        span1_img.src = `./res/img/icon_like.svg`
        span1_p.innerHTML = data.liked
        span2_img.src = `./res/img/icon_bookmark.svg`
        span2_p.innerHTML = data.bookmark_count

        h4.innerHTML = data.title
        p1.innerHTML = `공유 <b>${data.share_count}</b>회&nbsp;`
        p2.innerHTML = `댓글 <b>${data.comment_count}</b>개&nbsp;`
        p3.innerHTML = `조회수 <b>${data.view_count}</b>`

        img2.src = data.profile_image_url
        img2.alt = `개쇼 ${data.profile_nickname} 프로필 아이콘`
        figCap2.innerHTML = data.profile_nickname
        return wrap
    }

    createWrokspacePhotoItem = (x, y, value = '') => {
        const wrap = document.createElement('div')
        wrap.classList.add(`workspace__items`)
        wrap.style.top = `${y}%`
        wrap.style.left = `${x}%`
        // 버튼 모양
        const buttonIcon = document.createElement('label')
        buttonIcon.innerHTML = `+`

        wrap.appendChild(buttonIcon)

        // 관련된 상품 태그하기
        let article, h3, inputWrap, inputIcon, input, h4
        article = document.createElement('article')
        h3 = document.createElement('h3')
        inputWrap = document.createElement('div')
        inputIcon = document.createElement('img')
        input = document.createElement('input')
        h4 = document.createElement('h4')

        article.classList.add('workspace__items--add')
        h3.classList.add('workspace__items--add--title')
        inputWrap.classList.add('workspace__items--add--inputWrap')
        inputIcon.classList.add('workspace__items--add--inputWrap--img')
        input.classList.add('workspace__items--add--inputWrap--input')
        h4.classList.add('workspace__items--add--change')

        h3.innerHTML = `관련된 상품 태그하기`

        inputIcon.src = '../res/img/icon_search.svg'
        inputIcon.alt = `개쇼 검색`

        input.type = 'text'
        input.placeholder = `상품 검색하기`
        input.value = value

        inputWrap.appendChild(inputIcon)
        inputWrap.appendChild(input)

        h4.innerHTML = `직접 등록하기`

        article.appendChild(h3)
        article.appendChild(inputWrap)
        article.appendChild(h4)

        wrap.appendChild(article)

        let h4_2, ul
        h4_2 = document.createElement('h4')
        ul = document.createElement('ul')

        h4_2.classList.add('workspace__items--add--search')
        h4_2.classList.add('hidden')

        ul.classList.add('workspace__items--add--search--list')
        ul.classList.add('hidden')

        h4_2.innerHTML = `검색 결과`

        article.appendChild(h4_2)
        article.appendChild(ul)

        // 직접 등록하기
        let article2, articleH3, articleInput, articleInputWrap, articleH4, articleBtn

        article2 = document.createElement('article')
        articleH3 = document.createElement('h3')
        articleInput = document.createElement('input')
        articleH4 = document.createElement('h4')
        articleBtn = document.createElement('button')
        articleInputWrap = document.createElement('div')

        articleInputWrap.appendChild(articleInput)

        article2.classList.add('workspace__items--add')
        article2.classList.add('hidden')
        articleH3.classList.add('workspace__items--add--title')
        articleH4.classList.add(`workspace__items--add--change`)
        articleInputWrap.classList.add(`workspace__items--add--inputWrap`)
        articleInput.classList.add('workspace__items--add--inputWrap--input')
        articleBtn.classList.add('workspace__items--add--btn')

        articleH3.innerHTML = `직접 등록하기`
        articleInput.placeholder = `상품의 이름을 입력해주세요`
        articleInput.value = value
        articleH4.innerHTML = `검색해서 등록하기`
        articleBtn.innerHTML = `태그하기`

        article2.appendChild(articleH3)
        article2.appendChild(articleInputWrap)
        article2.appendChild(articleH4)
        article2.appendChild(articleBtn)

        wrap.appendChild(article2)

        // 클릭 이벤트

        h4.onclick = () => {
            article.classList.add('hidden')
            article2.classList.remove('hidden')
        }

        articleH4.onclick = () => {
            article2.classList.add('hidden')
            article.classList.remove('hidden')
        }

        return [wrap, input, h4_2, ul, articleInput, articleBtn, article, article2, buttonIcon, h4, articleH4]
    }

    createWorkspacePhotoSearchItem = (data) => {
        // console.log(data)
        let fig, img, figcap, title, price, button
        fig = document.createElement('figure')
        img = document.createElement('img')
        figcap = document.createElement('figcaption')
        title = document.createElement('h5')
        price = document.createElement('h5')
        button = document.createElement('button')

        img.src = data.thumbnail ? data.thumbnail : `../res/img/logo.svg`
        img.alt = `개쇼 상품 이미지`

        title.innerHTML = data.name
        price.innerHTML = data.price
        button.innerHTML = `태그하기`

        title.classList.add('title')
        price.classList.add('price')

        figcap.appendChild(title)
        figcap.appendChild(price)
        figcap.appendChild(button)

        fig.appendChild(img)
        fig.appendChild(figcap)

        return [fig, button, data]
    }

    createWorkspaceViewPhotoItemTypeAdded = (data) => {
        const { name, x, y } = data
        const wrap = document.createElement('span')
        const label = document.createElement('label')
        const title = document.createElement('h4')

        wrap.classList.add('img__plus')
        label.classList.add('img__plus--icon')
        title.classList.add('img__plus--title')
        title.classList.add('hidden')

        label.innerHTML = `+`
        title.innerHTML = name

        wrap.appendChild(label)
        wrap.appendChild(title)

        wrap.style.left = `${x}%`
        wrap.style.top = `${y}%`

        wrap.onmouseenter = () => {
            title.classList.remove('hidden')
        }
        wrap.onmouseleave = () => {
            title.classList.add('hidden')
        }

        return [wrap, title]
    }
    createWorkspaceViewPhotoItemTypeExisting = (data, product) => {
        const { name, x, y } = data
        const wrap = document.createElement('span')
        const label = document.createElement('label')
        const itemWrap = document.createElement('div')
        const title = document.createElement('h4')
        const desWrap = document.createElement('figure')
        const desFigcap = document.createElement('figcaption')
        const desName = document.createElement('p')
        const desPrice = document.createElement('p')
        const desBtn = document.createElement('button')
        const img = document.createElement('img')

        wrap.classList.add('img__plus')
        label.classList.add('img__plus--icon')
        itemWrap.classList.add('img__plus--wrap')
        title.classList.add('img__plus--title')
        desWrap.classList.add('img__plus--des')
        desFigcap.classList.add('img__plus--figcap')
        desName.classList.add('img__plus--desName')
        desPrice.classList.add('img__plus--desPrice')

        itemWrap.classList.add('hidden')

        label.innerHTML = `+`
        title.innerHTML = '관련된 상품 보기'
        img.src = product.product_images[0].url
        desName.innerHTML = product.name
        desPrice.innerHTML = `${product.price}원`
        desBtn.innerHTML = '자세히 보기'

        desBtn.onclick = () => {
            window.location.href = `/product.html?i=${product.product_id}`
        }

        desFigcap.appendChild(desName)
        desFigcap.appendChild(desPrice)
        desFigcap.appendChild(desBtn)

        desWrap.appendChild(img)
        desWrap.appendChild(desFigcap)

        itemWrap.appendChild(title)
        itemWrap.appendChild(desWrap)

        wrap.appendChild(label)
        wrap.appendChild(itemWrap)

        wrap.style.left = `${x}%`
        wrap.style.top = `${y}%`

        wrap.onmouseenter = () => {
            itemWrap.classList.remove('hidden')
        }
        wrap.onmouseleave = () => {
            itemWrap.classList.add('hidden')
        }

        return [wrap, itemWrap]
    }

    createIdeLangHeaderItem = (type) => {
        let li, index, title

        li = document.createElement('li')
        li.classList.add('item__header')

        index = document.createElement('p')
        index.classList.add('item__header--idx')

        title = document.createElement('p')
        title.classList.add('item__header--title')

        // 데이터 넣기
        index.innerHTML = `#`
        if (type == 'ide') title.innerHTML = `IDE 이름`
        else title.innerHTML = `언어 이름`

        li.appendChild(index)
        li.appendChild(title)

        return li
    }

    createIdeLangItem = (data, type) => {
        let li, index, title, a

        li = document.createElement('li')
        li.classList.add('item__body')

        index = document.createElement('p')
        index.classList.add('item__body--idx')

        title = document.createElement('p')
        title.classList.add('item__body--title')

        a = document.createElement('a')
        a.innerHTML = `바로가기`

        // 데이터 넣기
        index.innerHTML = data.id
        title.innerHTML = data.en_name
        a.href = `/remview.html?n=${data.id}&i=${type == 'ide' ? 'i' : 'l'}`

        li.appendChild(index)
        li.appendChild(title)
        li.appendChild(a)

        return li
    }
    createIdeLangCommentItem = async (data, myInfo) => {
        const { advantage_content, average_score, date, disadvantage_content, job_type, profile_image_url, profile_nickname, user_id, working_area } = data
        let wrap, userWrap, starWrap, goodWrap, badWrap

        wrap = document.createElement('li')
        userWrap = document.createElement('div')
        starWrap = document.createElement('div')
        goodWrap = document.createElement('div')
        badWrap = document.createElement('div')

        wrap.classList.add('appraisal__item')
        userWrap.classList.add('appraisal__item--user')
        starWrap.classList.add('appraisal__item--section')
        goodWrap.classList.add('appraisal__item--section')
        badWrap.classList.add('appraisal__item--section')

        wrap.appendChild(userWrap)
        wrap.appendChild(starWrap)
        wrap.appendChild(goodWrap)
        wrap.appendChild(badWrap)

        // 유저
        let fig, userImg, figcap, pDes, pInfo, div, modBtn, delBtn, dateDiv, span

        fig = document.createElement('figure')
        userImg = document.createElement('img')
        figcap = document.createElement('figcaption')
        pDes = document.createElement('p')
        pInfo = document.createElement('p')
        div = document.createElement('div')
        span = document.createElement('span')
        dateDiv = document.createElement('p')
        modBtn = document.createElement('button')
        delBtn = document.createElement('button')

        pDes.classList.add('big')
        pInfo.classList.add('small')

        fig.appendChild(userImg)
        fig.appendChild(figcap)
        figcap.appendChild(pDes)
        figcap.appendChild(pInfo)
        div.appendChild(dateDiv)

        div.appendChild(span)
        span.appendChild(modBtn)
        if (myInfo) {
            if (myInfo.user_id == user_id) span.appendChild(delBtn)
        }

        userWrap.appendChild(fig)
        userWrap.appendChild(div)

        userImg.src = profile_image_url
        pDes.innerHTML = `<b>${profile_nickname}</b>님의 평가`
        const tempArr = []
        if (job_type) tempArr.push(job_type)
        if (working_area) tempArr.push(working_area)
        pInfo.innerHTML = `(${tempArr.join(' / ')})`
        dateDiv.innerHTML = `${date} 작성`
        if (myInfo) {
            if (myInfo.user_id == user_id) {
                delBtn.innerHTML = `삭제하기`
                modBtn.innerHTML = `수정하기`
            } else {
                modBtn.innerHTML = `신고하기`
            }
        }
        // ide 평점
        // 스타뷰 동적 로드
        const starFile = await import(`../View/starRating.js`)
        const starRepo = new starFile.default()

        let subtitle, starItem, starRating
        subtitle = document.createElement('h3')
        starItem = document.createElement('div')
        starRating = document.createElement('p')

        subtitle.classList.add('appraisal__item--subTitle')
        starItem.classList.add(`appraisal__item--starItem`)
        starRating.classList.add(`text`)

        starWrap.appendChild(subtitle)
        starWrap.appendChild(starItem)

        subtitle.innerHTML = `IDE 총 평점`
        // 별 만들기
        const floatRating = parseFloat(average_score).toFixed(1)
        // 정수 판단
        let firstRate = floatRating.split('.')[0]
        // 소수점 판단
        let secondRate = floatRating.split('.')[1]
        let isSecond = false
        if (firstRate == 0 || secondRate == 0) isSecond = true
        for (let i = 0; i < 5; i++) {
            let star
            if (i < firstRate) {
                // 채워진 별
                star = starRepo.getStar(20, `#ffe200`, true, 1)
            } else if (!isSecond) {
                // 반만 채워진 별
                isSecond = true
                star = starRepo.getStar(20, `#ffe200`, true, secondRate)
            } else {
                // 안채워진 별
                star = starRepo.getStar(20, `rgba(0,0,0,0.1)`, true, 0)
            }
            starItem.appendChild(star)
        }
        starItem.appendChild(starRating)
        starRating.innerHTML = `<b>${average_score}</b> / 5`

        // 장점 장점이 있는 경우에만 데이터 추가
        if (advantage_content) {
            let adTitle, adContent
            adTitle = document.createElement('h3')
            adContent = document.createElement('div')

            adTitle.classList.add(`appraisal__item--subTitle`)

            goodWrap.appendChild(adTitle)
            goodWrap.appendChild(adContent)

            adTitle.innerHTML = '장점'
            adContent.innerHTML = advantage_content
        }
        // 단점
        if (disadvantage_content) {
            let adTitle, adContent
            adTitle = document.createElement('h3')
            adContent = document.createElement('div')

            adTitle.classList.add(`appraisal__item--subTitle`)

            goodWrap.appendChild(adTitle)
            goodWrap.appendChild(adContent)

            adTitle.innerHTML = '단점'
            adContent.innerHTML = disadvantage_content
        }

        return [wrap, modBtn, delBtn]
    }
}
