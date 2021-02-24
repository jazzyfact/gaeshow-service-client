export default class storeItem {
    constructor() {}

    createStoreCategoryView = (data) => {
        const { id, name, explanation, categories } = data
        // 0뎁스 카테고리
        let ul, a, li, p
        ul = document.createElement('ul')
        a = document.createElement('a')
        li = document.createElement('li')
        p = document.createElement('p')

        ul.classList.add('nav__top--open')

        a.classList.add('nav__title')
        a.href = `/store.html?i=${id}`
        li.innerHTML = name
        p.innerHTML = `-`

        a.appendChild(li)
        // if (categories.length > 0) a.appendChild(p)
        ul.appendChild(a)

        const subTitleList = []

        categories.map((e) => {
            const { id, name, explanation } = e
            let s_a, s_li
            s_a = document.createElement('a')
            s_a.href = `/store.html?i=${id}`
            s_li = document.createElement('li')

            s_a.classList.add('nav__sub')
            s_li.innerHTML = name

            s_a.appendChild(s_li)

            ul.appendChild(s_a)
            subTitleList.push(s_a)
        })

        p.onclick = () => {
            if (ul.className.includes('open')) {
                ul.classList.remove('nav__top--open')
                ul.classList.add('nav__top--close')
                p.innerHTML = `+`
                subTitleList.map((e) => e.classList.add('hidden'))
            } else {
                ul.classList.remove('nav__top--close')
                ul.classList.add('nav__top--open')
                p.innerHTML = `-`
                subTitleList.map((e) => e.classList.remove('hidden'))
            }
        }

        return ul
    }

    createStoreListItem = (data) => {
        // console.log(data)
        const { id, name, price, view_count, review_count, expectation_count, qna_count, share_count, average_score, thumbnail } = data

        let wrap

        wrap = document.createElement('a')
        wrap.href = `/product.html?i=${id}`

        let figure, figcaption, share, qna, img

        figure = document.createElement('figure')
        figcaption = document.createElement('figcaption')
        share = document.createElement('p')
        qna = document.createElement('p')
        img = document.createElement('img')

        figcaption.appendChild(share)
        figcaption.appendChild(qna)
        figure.appendChild(figcaption)
        figure.appendChild(img)

        wrap.appendChild(figure)

        figure.classList.add('main__recommend--titleImg')

        share.innerHTML = `공유 ${share_count}`
        qna.innerHTML = `Q&A ${qna_count}개`
        img.src = thumbnail ? thumbnail : '../res/img/logo.svg'
        img.alt = `개쇼 ${name} 상품`

        let title = document.createElement('p')
        title.classList.add('main__recommend--titleStr')
        title.innerHTML = name

        wrap.appendChild(title)

        let desWrap, price_p, average_p

        desWrap = document.createElement('div')
        price_p = document.createElement('p')
        average_p = document.createElement('p')

        desWrap.classList.add('main__recommend--subTitle--wrapper')
        price_p.classList.add('main__recommend--subTitle--price')
        average_p.classList.add('main__recommend--subTitle--point')

        desWrap.appendChild(price_p)
        desWrap.appendChild(average_p)

        wrap.appendChild(desWrap)

        price_p.innerHTML = `₩ ${price}`
        const avText = average_score ? average_score : 0
        average_p.innerHTML = `평점 ${avText == 0 ? `없음` : parseFloat(avText).toFixed(1)}`

        let exAverage_p, reviewCount_p
        exAverage_p = document.createElement('p')
        reviewCount_p = document.createElement('p')

        wrap.appendChild(exAverage_p)
        wrap.appendChild(reviewCount_p)

        exAverage_p.classList.add('main__recoomend--subTitles')
        reviewCount_p.classList.add('main__recoomend--subTitles')

        exAverage_p.innerHTML = `구매 전 기대평 ${expectation_count}개`
        reviewCount_p.innerHTML = `리뷰수 ${review_count}개`

        return wrap
    }
    createEmptyListItem = () => {
        let wrap = document.createElement('div')

        let h3 = document.createElement('h3')
        h3.innerHTML = '제품을 찾을 수 없습니다.'

        wrap.appendChild(h3)

        return wrap
    }

    createCompareItem = (data) => {
        const div = document.createElement('div')
        if (data == '더 높은') {
            div.classList.add('large__avg--high')
            div.innerHTML = `<p>이 제품은 <b>기대 평점</b>보다 <span>사용자의 총 평점이 더 높은 제품</span>입니다</p>`
        } else if (data == '동일한') {
            div.classList.add('large__avg--mid')
            div.innerHTML = `<p>이 제품은 <b>기대 평점</b>과 <span>사용자의 총 평점이 동일한 제품</span>입니다</p>`
        } else {
            div.classList.add('large__avg--low')
            div.innerHTML = `<p>이 제품은 <b>기대 평점</b>보다 <span>사용자의 총 평점이 더 낮은 제품</span>입니다</p>`
        }

        return div
    }
    createExpectItem = (data, isMyComment) => {
        const wrap = document.createElement('li')
        let div, h5, p, p2
        div = document.createElement('div')
        h5 = document.createElement('h5')
        p = document.createElement('p')
        p2 = document.createElement('button')

        div.classList.add('small__exreview--body--avg')

        wrap.appendChild(div)
        wrap.appendChild(h5)
        wrap.appendChild(p2)
        wrap.appendChild(p)

        // h5.innerHTML = data.content.length > 20 ? data.content.substring(0, 20) + '..' : data.content
        h5.innerHTML = data.content
        p.innerHTML = `<p><b>${data.profile_nickname}</b>&nbsp;<span>${data.created_at}</span></p>`
        p2.innerHTML = `더보기`

        let span, star1, star2, star3, star4, star5, p_text, optionWrap, mod, del, report
        span = document.createElement('span')

        star1 = document.createElement('p')
        star2 = document.createElement('p')
        star3 = document.createElement('p')
        star4 = document.createElement('p')
        star5 = document.createElement('p')

        star1.classList.add(data.average_score > 0 ? 'fill' : 'epmty')
        star2.classList.add(data.average_score > 1 ? 'fill' : 'epmty')
        star3.classList.add(data.average_score > 2 ? 'fill' : 'epmty')
        star4.classList.add(data.average_score > 3 ? 'fill' : 'epmty')
        star5.classList.add(data.average_score > 4 ? 'fill' : 'epmty')

        star1.innerHTML = '★'
        star2.innerHTML = '★'
        star3.innerHTML = '★'
        star4.innerHTML = '★'
        star5.innerHTML = '★'

        span.appendChild(star1)
        span.appendChild(star2)
        span.appendChild(star3)
        span.appendChild(star4)
        span.appendChild(star5)

        p_text = document.createElement('p')
        p_text.innerHTML = data.average_score

        optionWrap = document.createElement('div')
        mod = document.createElement('p')
        del = document.createElement('p')
        report = document.createElement('p')

        optionWrap.classList.add('optionWrap')
        mod.classList.add('mod')
        del.classList.add('del')
        report.classList.add('reportBtn')

        mod.innerHTML = '수정'
        del.innerHTML = '삭제'
        report.innerHTML = '신고'
        if (isMyComment) {
            optionWrap.appendChild(mod)
            optionWrap.appendChild(del)
        } else {
            optionWrap.appendChild(report)
        }
        div.appendChild(span)
        div.appendChild(p_text)
        div.appendChild(optionWrap)

        return [wrap, mod, del, report, h5, p2]
    }

    createEmptyExpectItem = () => {
        let li, div1, div2, div3

        li = document.createElement('li')
        div1 = document.createElement('div')
        div2 = document.createElement('div')
        div3 = document.createElement('div')

        li.appendChild(div1)
        li.appendChild(div2)
        li.appendChild(div3)

        li.classList.add('empty')
        div1.classList.add('mid')
        div2.classList.add('long')
        div3.classList.add('mid')

        return li
    }
    createEmptyExpectItemTop = () => {
        const div = document.createElement('div')
        div.innerHTML = '기대평이 없습니다.'

        div.classList.add('empty__top')
        return div
    }

    createModalView = () => {
        let wrap
        wrap = document.createElement('div')
        wrap.classList.add('modal')

        let body
        body = document.createElement('div')
        body.classList.add('modal__body')

        wrap.appendChild(body)

        let subtitle
        subtitle = document.createElement('h4')
        body.appendChild(subtitle)

        let figure, img, figcap, p_name, p_price, starWrap, starSpan, star1, star2, star3, star4, star5, starDes
        figure = document.createElement('figure')
        img = document.createElement('img')
        figcap = document.createElement('figcaption')
        p_name = document.createElement('p')
        p_price = document.createElement('p')
        starWrap = document.createElement('div')
        starSpan = document.createElement('span')
        star1 = document.createElement('p')
        star2 = document.createElement('p')
        star3 = document.createElement('p')
        star4 = document.createElement('p')
        star5 = document.createElement('p')
        starDes = document.createElement('p')

        p_name.classList.add('name')
        p_price.classList.add('price')
        starWrap.classList.add('starwrap')

        figure.appendChild(img)
        figure.appendChild(figcap)
        figure.appendChild(starWrap)

        figcap.appendChild(p_name)
        figcap.appendChild(p_price)

        starSpan.appendChild(star1)
        starSpan.appendChild(star2)
        starSpan.appendChild(star3)
        starSpan.appendChild(star4)
        starSpan.appendChild(star5)

        starWrap.appendChild(starSpan)
        starWrap.appendChild(starDes)

        star1.innerHTML = '★'
        star2.innerHTML = '★'
        star3.innerHTML = '★'
        star4.innerHTML = '★'
        star5.innerHTML = '★'

        star1.classList.add('empty')
        star2.classList.add('empty')
        star3.classList.add('empty')
        star4.classList.add('empty')
        star5.classList.add('empty')

        starDes.innerHTML = '선택해주세요'

        const starList = []
        starList.push(star1)
        starList.push(star2)
        starList.push(star3)
        starList.push(star4)
        starList.push(star5)

        body.appendChild(figure)

        let text
        text = document.createElement('textarea')
        text.placeholder = `최대 500글자 까지 작성할 수 있습니다.`

        body.appendChild(text)

        let addBtn = document.createElement('button')
        addBtn.innerHTML = '등록하기'
        body.appendChild(addBtn)

        return [wrap, subtitle, img, p_name, p_price, starWrap, starList, text, addBtn]
    }

    createReviewItem = (isMyComment = false, data) => {
        // console.log(data)
        const wrap = document.createElement('li')
        wrap.classList.add('large__comment--list--item')

        let figure, img, figcap, div, star1, star2, star3, star4, star5, p_text, figcap2, wrapdiv

        figure = document.createElement('figure')
        img = document.createElement('img')
        figcap = document.createElement('figcaption')
        div = document.createElement('div')
        star1 = document.createElement('p')
        star2 = document.createElement('p')
        star3 = document.createElement('p')
        star4 = document.createElement('p')
        star5 = document.createElement('p')
        p_text = document.createElement('p')
        figcap2 = document.createElement('div')
        wrapdiv = document.createElement('div')

        img.src = data.profile_image_url ? data.profile_image_url : `../res/img/icon_default_img.png`

        const starList = []
        starList.push(star1)
        starList.push(star2)
        starList.push(star3)
        starList.push(star4)
        starList.push(star5)
        star1.innerHTML = `☆`
        star2.innerHTML = `☆`
        star3.innerHTML = `☆`
        star4.innerHTML = `☆`
        star5.innerHTML = `☆`
        // console.log(data)
        for (let i = 0; i < data.average_score; i++) {
            starList[i].classList.add('yellow--light')
            starList[i].innerHTML = `★`
        }

        p_text.innerHTML = `<p><b>${data.average_score ? data.average_score : 0}.0</b> / 5</p>`

        div.appendChild(star1)
        div.appendChild(star2)
        div.appendChild(star3)
        div.appendChild(star4)
        div.appendChild(star5)
        figcap.appendChild(div)
        figcap.appendChild(p_text)

        // 위치 변경
        wrapdiv.appendChild(img)
        wrapdiv.appendChild(figcap)
        figure.appendChild(wrapdiv)
        figure.appendChild(figcap2)

        wrap.appendChild(figure)

        const desWrap = document.createElement('div')
        wrap.appendChild(desWrap)

        wrapdiv.classList.add('userImg')
        figcap2.classList.add('userDes')

        // 이미지 추가되면 체크해야함
        const imageWrap = document.createElement('div')
        imageWrap.classList.add('imgs')
        const imageList = []

        data.attachs.map((e) => {
            // 데이터 동적으로 넣기
            const tempImage = document.createElement('img')
            tempImage.src = e.url
            imageList.push({ img: e.url })
            imageWrap.appendChild(tempImage)
        })

        desWrap.appendChild(imageWrap)

        const p_des = document.createElement('p')
        p_des.classList.add('des')
        p_des.innerHTML = data.content
        const p_el = document.createElement('button')
        p_el.innerHTML = '더보기'
        desWrap.appendChild(p_des)
        desWrap.appendChild(p_el)

        const tagWrap = document.createElement('div')
        tagWrap.classList.add('tags')
        //태그 동적 생성
        // 데이터 정렬
        data.tags.sort()
        data.tags.map((e) => {
            const tempTag = document.createElement('div')
            tempTag.classList.add('tag')
            tempTag.innerHTML = e
            tagWrap.appendChild(tempTag)
        })

        desWrap.appendChild(tagWrap)

        const p_userName = document.createElement('p')
        p_userName.classList.add('user')
        const tempArr = []
        if (data.jobfield) tempArr.push(data.jobfield)
        if (data.job_type) tempArr.push(data.job_type)
        if (data.experience_years) tempArr.push(data.experience_years)
        const userExplain = tempArr.length > 0 ? `(${tempArr.join(' / ')})` : ''
        p_userName.innerHTML = `<b>${data.profile_nickname}</b> ${userExplain}`
        // 위치 변경
        // desWrap.appendChild(p_userName)
        figcap2.appendChild(p_userName)

        let userWrap, p_date, likeFig, likeFigcap, likeImg, optionWrap, mod, del, report

        userWrap = document.createElement('div')
        p_date = document.createElement('p')
        likeFig = document.createElement('figure')
        likeFigcap = document.createElement('figcaption')
        likeImg = document.createElement('img')
        optionWrap = document.createElement('div')
        mod = document.createElement('a')
        del = document.createElement('a')
        report = document.createElement('a')

        userWrap.classList.add('user__des')
        optionWrap.classList.add('user__option')

        // 위치 변경
        // userWrap.appendChild(p_date)
        figcap2.appendChild(p_date)

        likeFig.appendChild(likeImg)
        likeFig.appendChild(likeFigcap)
        userWrap.appendChild(likeFig)
        if (isMyComment) {
            optionWrap.appendChild(mod)
            optionWrap.appendChild(del)
        } else {
            optionWrap.appendChild(report)
        }
        userWrap.appendChild(optionWrap)
        // 위치 변경
        // desWrap.appendChild(userWrap)
        tagWrap.appendChild(userWrap)

        p_date.innerHTML = data.created_at
        if (data.rating_id && data.rating_id != 0) {
            likeImg.src = '../res/img/icon_like.svg'
        } else {
            likeImg.src = '../res/img/icon_like_df.svg'
        }
        likeImg.alt = '개쇼 상품 좋아요 이미지'
        likeFigcap.innerHTML = data.liked

        mod.innerHTML = '수정하기'
        del.innerHTML = '삭제하기'
        report.innerHTML = '신고하기'

        let exWrap, ex_title, div1, div2, div3, ex_star1, ex_star2, ex_star3, ex_star4, ex_star5, p_aver, p_content, p_el2, div4

        exWrap = document.createElement('div')
        ex_title = document.createElement('p')
        div1 = document.createElement('div')
        div2 = document.createElement('div')
        div3 = document.createElement('div')
        ex_star1 = document.createElement('p')
        ex_star2 = document.createElement('p')
        ex_star3 = document.createElement('p')
        ex_star4 = document.createElement('p')
        ex_star5 = document.createElement('p')
        p_aver = document.createElement('p')
        p_content = document.createElement('p')
        p_el2 = document.createElement('button')
        div4 = document.createElement('span')

        exWrap.classList.add('exreview')
        p_content.classList.add('exreview__des')
        p_aver.classList.add('exreview__stars')
        const exCheck = data['expectation_comment']
        if (exCheck) {
            // console.log('구매전 기대평 있음')
            exWrap.appendChild(ex_title)
            div1.appendChild(div2)
            div2.appendChild(div3)
            div3.appendChild(ex_star1)
            div3.appendChild(ex_star2)
            div3.appendChild(ex_star3)
            div3.appendChild(ex_star4)
            div3.appendChild(ex_star5)
            div2.appendChild(p_aver)
            div4.appendChild(p_content)
            div4.appendChild(p_el2)
            div2.appendChild(div4)
            exWrap.appendChild(div1)
            desWrap.appendChild(exWrap)

            ex_title.innerHTML = `이 사용자의 구매전 기대평`
            const tempArrStart = []
            tempArrStart.push(ex_star1)
            tempArrStart.push(ex_star2)
            tempArrStart.push(ex_star3)
            tempArrStart.push(ex_star4)
            tempArrStart.push(ex_star5)
            tempArrStart.map((e, i) => {
                e.innerHTML = `★`
                if (data.expectation_comment.average_score > i) {
                    e.classList.add('fill')
                } else {
                    e.classList.add('empty')
                }
            })
            p_aver.innerHTML = `<b>${data.expectation_comment.average_score}</b> / 5`
            p_content.innerHTML = `${data.expectation_comment.content}`
            p_el2.innerHTML = '더보기'
        }

        return [wrap, imageWrap, imageList, mod, del, report, likeFig, likeImg, likeFigcap, p_el, p_des, p_content, p_el2]
    }
    createDataLapDeveloperBarChart = (data) => {
        const div = document.createElement('div')
        div.classList.add('small__job--item')

        const p = document.createElement('p')
        p.innerHTML = data.name

        div.appendChild(p)

        let div2, span, barBack, barFill, p_value
        div2 = document.createElement('div')
        span = document.createElement('span')
        barBack = document.createElement('div')
        barFill = document.createElement('div')
        p_value = document.createElement('p')

        barBack.classList.add('back')
        barFill.classList.add('fill')

        span.appendChild(barBack)
        span.appendChild(barFill)
        div2.appendChild(span)
        div2.appendChild(p_value)

        div.appendChild(div2)

        barFill.style.width = `${data.rate}%`

        p_value.innerHTML = `${data.rate}%`
        return div
    }
    createDataLapAgeBarChart = (data) => {
        const div = document.createElement('div')
        div.classList.add('small__age--item')

        const p = document.createElement('p')
        p.innerHTML = `${data.rate}%`

        div.appendChild(p)

        let div2, span, barBack, barFill, p_value
        div2 = document.createElement('div')
        span = document.createElement('span')
        barBack = document.createElement('div')
        barFill = document.createElement('div')
        p_value = document.createElement('p')

        barBack.classList.add('back')
        barFill.classList.add('fill')

        span.appendChild(barBack)
        span.appendChild(barFill)
        div2.appendChild(span)
        div2.appendChild(p_value)

        div.appendChild(div2)

        barFill.style.height = `${data.rate}%`

        p_value.innerHTML = `${data.age}대`

        return div
    }

    createExperienceBar = (data) => {
        const div = document.createElement('div')
        div.classList.add('small__job--item')

        const p = document.createElement('p')
        if (data.experience_years >= 5) {
            p.innerHTML = `${data.experience_years}년차 이상`
        } else {
            if (data.experience_years == '데이터 수집중') {
                p.innerHTML = `${data.experience_years}`
            } else {
                p.innerHTML = `${data.experience_years}년차`
            }
        }

        div.appendChild(p)

        let div2, span, barBack, barFill, p_value
        div2 = document.createElement('div')
        span = document.createElement('span')
        barBack = document.createElement('div')
        barFill = document.createElement('div')
        p_value = document.createElement('p')

        barBack.classList.add('back')
        barFill.classList.add('fill-blue')

        span.appendChild(barBack)
        span.appendChild(barFill)
        div2.appendChild(span)
        div2.appendChild(p_value)

        div.appendChild(div2)

        barFill.style.width = `${data.rate}%`

        p_value.innerHTML = `${data.rate}%`
        return div
    }

    createAddReviewCommentImageView = () => {
        let fig, img, figcap
        fig = document.createElement('figure')
        img = document.createElement('img')
        figcap = document.createElement('figcaption')

        figcap.innerHTML = 'X'

        fig.appendChild(img)
        fig.appendChild(figcap)

        return [fig, img]
    }

    createModalLaregeImage = (clickIndex, imgList) => {
        console.log(imgList)
        let wrap = document.createElement('div')
        wrap.classList.add('wrap')

        let cancle = document.createElement('div')
        cancle.classList.add('cancle')
        cancle.innerHTML = 'X'

        let leftImg = document.createElement('img')
        leftImg.src = '../res/img/icon_left.svg'
        leftImg.classList.add('img')

        let contentWrap, bigImg, smallImgWrap, count
        contentWrap = document.createElement('div')
        contentWrap.classList.add('contentWrap')

        bigImg = document.createElement('img')
        bigImg.src = imgList[clickIndex].img
        bigImg.classList.add('bigImg')

        smallImgWrap = document.createElement('div')
        smallImgWrap.classList.add('smallContentWrap')

        const imgWrapList = []

        imgList.map((e, i) => {
            const tempImg = document.createElement('img')
            tempImg.src = e.img
            if (i == clickIndex) tempImg.classList.add('focus')
            else tempImg.classList.add('unfocus')
            smallImgWrap.appendChild(tempImg)

            imgWrapList.push(tempImg)
        })

        count = document.createElement('p')
        count.innerHTML = `${clickIndex + 1} / ${imgList.length}`

        contentWrap.appendChild(bigImg)
        contentWrap.appendChild(smallImgWrap)
        contentWrap.appendChild(count)

        let rightImg = document.createElement('img')
        rightImg.src = '../res/img/icon_right.svg'
        rightImg.classList.add('img')

        wrap.appendChild(leftImg)
        wrap.appendChild(contentWrap)
        wrap.appendChild(rightImg)
        wrap.appendChild(cancle)

        return [wrap, leftImg, rightImg, cancle, imgWrapList, bigImg, count]
    }
}
