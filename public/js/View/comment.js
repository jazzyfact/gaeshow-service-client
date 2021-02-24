export default class comment {
    constructor() {}

    createComment = (comment = '', date = '', userImg = '', nickname = '', userInfo = '', liked = 0, comment_id, isMyComment, title = null, user_id) => {
        // console.log(user_id)
        let isDelete = false
        if (!comment && !date && !userImg && !nickname) {
            isDelete = true
        }
        let wrapper, contentUi, dateUi, titleWrap
        wrapper = document.createElement('div')
        wrapper.classList.add('comment__list--item')
        wrapper.setAttribute('idx', comment_id)

        titleWrap = document.createElement('h3')
        titleWrap.innerHTML = title ? title : ''

        contentUi = document.createElement('textArea')
        contentUi.value = isDelete ? '삭제된 댓글입니다.' : comment
        contentUi.setAttribute('readonly', 'readonly')
        contentUi.classList.add('comment__list--content')
        contentUi.style.height = '1px'

        const more = document.createElement('button')
        more.innerHTML = '더보기'

        dateUi = document.createElement('p')
        dateUi.classList.add('comment__list--date')
        dateUi.innerHTML = date

        let userWrapper

        userWrapper = document.createElement('div')
        userWrapper.classList.add('comment__list--user')

        let userFigUi, userImgUi, userCapUi, userPUi

        userFigUi = document.createElement('figure')
        userFigUi.classList.add('comment__list--user--info')

        userImgUi = document.createElement('img')
        userImgUi.src = userImg
        userImgUi.alt = '프로필 이미지'

        userCapUi = document.createElement('figcaption')
        userCapUi.innerHTML = nickname

        userPUi = document.createElement('p')
        userPUi.innerHTML = userInfo
        if (!isDelete) {
            userFigUi.appendChild(userImgUi)
            userFigUi.appendChild(userCapUi)
            userFigUi.appendChild(userPUi)
            userFigUi.onclick = () => {
                window.location.href = `/profile.html?n=${user_id}`
            }
        }
        userWrapper.appendChild(userFigUi)

        let userPostWrapper, userLikedFig, userLikedImg, userLikedCap, addComment, report, del, mod
        userPostWrapper = document.createElement('div')
        userPostWrapper.classList.add('comment__list--user--post')

        userLikedFig = document.createElement('figure')

        userLikedImg = document.createElement('img')
        userLikedImg.src = `../res/img/icon_like_df.svg`
        userLikedImg.alt = `좋아요 아이콘`

        userLikedCap = document.createElement('figcaption')
        userLikedCap.innerHTML = liked

        userLikedFig.appendChild(userLikedImg)
        userLikedFig.appendChild(userLikedCap)
        if (isDelete) userLikedFig.classList.add('hidden')

        addComment = document.createElement('p')
        addComment.id = 'commentAdd'
        addComment.innerHTML = '댓글달기'

        if (!title) userPostWrapper.appendChild(userLikedFig)
        userPostWrapper.appendChild(addComment)

        if (!isDelete) {
            if (!isMyComment) {
                report = document.createElement('p')
                report.innerHTML = '신고하기'
                userPostWrapper.appendChild(report)
            } else {
                del = document.createElement('p')
                del.innerHTML = `삭제하기`
                del.classList.add('del')

                mod = document.createElement('p')
                mod.innerHTML = `수정하기`
                mod.classList.add('mod')

                userPostWrapper.appendChild(del)
                userPostWrapper.appendChild(mod)
            }
        }

        userWrapper.appendChild(userPostWrapper)
        if (title) wrapper.appendChild(titleWrap)
        wrapper.appendChild(contentUi)
        wrapper.appendChild(more)
        if (!isDelete) wrapper.appendChild(dateUi)
        wrapper.appendChild(userWrapper)

        return [wrapper, addComment, userLikedImg, report, contentUi, more]
    }
    // 대댓글
    createCommentDepth = (comment = '', date = '', userImg = '', nickname = '', userInfo = '', liked = 0, parentIdx, comment_id, isMyComment, user_id) => {
        // console.log(user_id)
        let isDelete = false
        if (!comment && !date && !userImg && !nickname) {
            isDelete = true
        }
        let wrapper, tempWrapper, tempP, contentUi, dateUi, tempWrap

        wrapper = document.createElement('div')
        wrapper.classList.add('comment__list--answer')
        wrapper.setAttribute('pidx', parentIdx)
        wrapper.setAttribute('idx', comment_id)

        tempWrapper = document.createElement('div')
        tempWrapper.classList.add('comment__list--answer--content')

        tempP = document.createElement('p')
        tempP.innerHTML = '┕'

        contentUi = document.createElement('textArea')
        contentUi.value = isDelete ? '삭제된 댓글입니다' : comment
        contentUi.setAttribute('readonly', 'readonly')
        contentUi.classList.add('comment__list--content')
        // contentUi.classList.add('comment__list--content')

        tempWrap = document.createElement('div')
        // tempWrap.appendChild(tempP)

        // 더보기 버튼
        const more = document.createElement('button')
        more.classList.add(`comment__list--more`)
        more.innerHTML = '더보기'

        tempWrap.appendChild(contentUi)
        tempWrap.appendChild(more)
        tempWrapper.appendChild(tempWrap)

        dateUi = document.createElement('p')
        dateUi.classList.add('comment__list--date')
        dateUi.innerHTML = date

        let userWrapper

        userWrapper = document.createElement('div')
        userWrapper.classList.add('comment__list--user')

        let userFigUi, userImgUi, userCapUi, userPUi

        userFigUi = document.createElement('figure')
        userFigUi.classList.add('comment__list--user--info')

        userImgUi = document.createElement('img')
        userImgUi.src = userImg
        userImgUi.alt = '프로필 이미지'

        userCapUi = document.createElement('figcaption')
        userCapUi.innerHTML = nickname

        userPUi = document.createElement('p')
        userPUi.innerHTML = userInfo
        if (!isDelete) {
            userFigUi.appendChild(userImgUi)
            userFigUi.appendChild(userCapUi)
            userFigUi.appendChild(userPUi)
            userFigUi.onclick = () => {
                window.location.href = `/profile.html?n=${user_id}`
            }
        }
        userWrapper.appendChild(userFigUi)

        let userPostWrapper, userLikedFig, userLikedImg, userLikedCap, addComment, report, del, mod
        userPostWrapper = document.createElement('div')
        userPostWrapper.classList.add('comment__list--user--post')

        userLikedFig = document.createElement('figure')

        userLikedImg = document.createElement('img')
        userLikedImg.src = `../res/img/icon_like_df.svg`
        userLikedImg.alt = `좋아요 아이콘`

        userLikedCap = document.createElement('figcaption')
        userLikedCap.innerHTML = liked

        userLikedFig.appendChild(userLikedImg)
        userLikedFig.appendChild(userLikedCap)

        if (isDelete) userLikedFig.classList.add('hidden')

        addComment = document.createElement('p')
        // addComment.innerHTML = '댓글달기'
        // userPostWrapper.appendChild(userLikedFig)
        userPostWrapper.appendChild(addComment)
        if (!isMyComment) {
            report = document.createElement('p')
            report.innerHTML = '신고하기'
            userPostWrapper.appendChild(report)
        } else {
            del = document.createElement('p')
            del.innerHTML = `삭제하기`
            del.classList.add('del')

            mod = document.createElement('p')
            mod.innerHTML = `수정하기`
            mod.classList.add('mod')

            userPostWrapper.appendChild(del)
            userPostWrapper.appendChild(mod)
        }
        if (!isDelete) userWrapper.appendChild(userPostWrapper)

        wrapper.appendChild(tempWrapper)
        if (!isDelete) wrapper.appendChild(dateUi)
        wrapper.appendChild(userWrapper)

        return [wrapper, addComment, userLikedImg, report, contentUi, more]
    }

    createAddComment = () => {
        let wrapper, p, textArea, button

        wrapper = document.createElement('div')
        wrapper.classList.add('comment__list--add')

        p = document.createElement('p')
        p.innerHTML = `┕`

        textArea = document.createElement('textarea')

        button = document.createElement('button')
        button.innerHTML = '등록하기'

        wrapper.appendChild(p)
        wrapper.appendChild(textArea)
        wrapper.appendChild(button)

        return [wrapper, button, textArea]
    }

    createModUi = () => {
        let wrapper, cancleBtn, modBtn

        wrapper = document.createElement('div')
        wrapper.classList.add('modDelBtn')

        cancleBtn = document.createElement('button')
        modBtn = document.createElement('button')

        cancleBtn.innerHTML = '취소하기'
        modBtn.innerHTML = '수정하기'

        wrapper.appendChild(cancleBtn)
        wrapper.appendChild(modBtn)

        return [wrapper, cancleBtn, modBtn]
    }
}
