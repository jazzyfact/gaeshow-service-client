export default class header {
    constructor() {}

    createBanner = () => {
        // 상단 검은 화면 배너 생성
        const section = document.createElement('section')
        section.classList.add('header__item--banner')
        section.innerHTML = `세상에 이런 커뮤니티는 없었다 <bold>개발자들을 위한 모든것 GAESHOW</bold>`
        // 스낵바 아이템 생성
        const snackbar = document.createElement('section')
        const icon = document.createElement('img')
        const text = document.createElement('p')

        snackbar.classList.add('header__item--snackbar')
        snackbar.classList.add('hidden')

        snackbar.id = 'snackbar'
        icon.id = 'snackbarIcon'
        text.id = 'snackbarText'

        snackbar.appendChild(icon)
        snackbar.appendChild(text)

        // 삽입
        const header = document.querySelector('#headerBanner')
        header.appendChild(section)
        header.appendChild(snackbar)
    }
    // isRequireSubView : 서브뷰가 필요한지 판단하는 bool
    // myInfo : on.load.js에서 로그인 검사를 진행한 뒤 로그인이 되어 있으면 로그인 정보를 받아오는데, 그 리턴받은 데이터 null이 아닌경우 로그인이다
    createNav = (isRequireSubView, myInfo) => {
        let main, sub
        main = document.createElement('section')
        main.className = `nav__main`
        sub = document.createElement('section')
        sub.className = `nav__sub`

        let icon, link, search, user
        // 아이콘
        icon = document.createElement('div')
        icon.className = 'nav__item--icon'
        // 아이콘 내부
        let h1, p
        h1 = document.createElement('h1')
        p = document.createElement('img')
        p.src = `../res/img/logo.png`
        p.srcset = `../res/img/logo.png 100w, ../res/img/logo@2x.png 150w ,../res/img/logo@3x.png 200w`
        p.alt = `개쇼 로고 이미지`
        p.onclick = () => (window.location.href = '/')

        icon.appendChild(h1)
        icon.appendChild(p)

        // 네비
        link = document.createElement('section')
        link.className = 'nav__item--link'
        // 네비 아이템
        let storeLink, communityLink, noticeLink
        storeLink = document.createElement('a')
        storeLink.href = '/store.html'
        storeLink.innerHTML = '상품'
        communityLink = document.createElement('a')
        communityLink.href = '/workspaces.html'
        communityLink.innerHTML = '커뮤니티'
        noticeLink = document.createElement('a')
        noticeLink.href = `/notice.html`
        noticeLink.innerHTML = `고객센터`
        // 네비 결합
        link.appendChild(storeLink)
        link.appendChild(communityLink)
        link.appendChild(noticeLink)

        // 검색
        search = document.createElement('section')
        search.className = `nav__item--search`
        // 검색 아이템
        let figure, img, input
        figure = document.createElement('figure')
        img = document.createElement('img')
        img.src = `./res/img/icon_search.svg`
        img.alt = `GAESOHW ICON`
        input = document.createElement('input')
        input.type = `text`
        input.name = `searchText`
        input.id = `navSearchText`
        input.value = ''
        input.placeholder = '검색어를 입력해주세요.'
        figure.appendChild(img)
        //결합
        search.appendChild(figure)
        search.appendChild(input)

        //유저
        user = document.createElement('section')
        user.className = 'nav__item--users'
        let a_fig, alram, content_div, newDiv, h3
        if (!myInfo) {
            // 로그아웃 상태인 경우
            //유저 아이템
            let login, signup
            login = document.createElement('a')
            login.href = '/login.html'
            login.innerHTML = '로그인'
            signup = document.createElement('a')
            signup.href = '/terms.html'
            signup.innerHTML = '회원가입'
            // 결합
            user.appendChild(login)
            user.appendChild(signup)
        } else {
            //로그인 상태인경우
            const { profile_nickname, profile_image_url } = myInfo
            let figure, img, figcaption
            figure = document.createElement('a')
            figure.classList.add('nav__item--users--fig')
            figure.href = '/profile.html'

            img = document.createElement('img')
            img.classList.add('nav__item--users--img')
            // img.src = profile_image_url
            img.src = profile_image_url
            img.alt = `프로필 이미지`

            figcaption = document.createElement('figcaption')
            figcaption.classList.add('nav__item--users--figcap')
            figcaption.innerHTML = profile_nickname

            figure.appendChild(img)
            figure.appendChild(figcaption)

            a_fig = document.createElement('figure')
            a_fig.classList.add('nav__item--users--alramWrap')

            alram = document.createElement('img')
            alram.classList.add('nav__item--users--alram')
            alram.src = '../res/img/icon_bell.svg'

            content_div = document.createElement('div')
            content_div.classList.add('nav__item--users--alramContent')
            content_div.classList.add('hidden')

            newDiv = document.createElement('div')
            newDiv.classList.add('nav__item--users--alramNew')
            newDiv.classList.add('hidden')

            h3 = document.createElement('h3')
            h3.innerHTML = `<b>${profile_nickname}님</b>의 <b>알림 목록</b>입니다.`

            content_div.appendChild(h3)

            a_fig.appendChild(alram)
            a_fig.appendChild(newDiv)
            a_fig.appendChild(content_div)

            user.appendChild(figure)
            user.appendChild(a_fig)
        }
        //  서브 뷰
        let work, pay, boast, share, fuck, tip, recommend
        work = document.createElement('a')
        work.href = '/workspaces.html'
        work.innerHTML = '워크스페이스 공유'
        pay = document.createElement('a')
        pay.href = '/salary.html'
        pay.innerHTML = '연봉보기'
        boast = document.createElement('a')
        boast.href = '/portfolio.html'
        boast.innerHTML = '자기작업물자랑'
        share = document.createElement('a')
        share.href = '/board.html'
        share.innerHTML = '업무얘기공유'
        fuck = document.createElement('a')
        fuck.href = '/badmouse.html'
        fuck.innerHTML = '회사욕하기'
        tip = document.createElement('a')
        tip.href = '/tips.html'
        tip.innerHTML = '프리랜서팁공유'
        recommend = document.createElement('a')
        recommend.href = '/rem.html'
        recommend.innerHTML = 'IDE,언어추천'

        // 모두 합치가.
        const wrapper = document.querySelector('#headerNav')
        // console.log(wrapper)
        main.appendChild(icon)
        main.appendChild(link)
        main.appendChild(search)
        main.appendChild(user)
        wrapper.appendChild(main)
        if (isRequireSubView) {
            sub.appendChild(work)
            sub.appendChild(pay)
            sub.appendChild(boast)
            sub.appendChild(share)
            sub.appendChild(fuck)
            sub.appendChild(tip)
            sub.appendChild(recommend)
            wrapper.appendChild(sub)
            // 포커스 즉, 강조 표시 등록
            switch (window.location.pathname) {
                case '/portfolio.html':
                    boast.classList.add('focus')
                    break
                case '/portfolioview.html':
                    boast.classList.add('focus')
                    break
                case '/portfolio__write.html':
                    boast.classList.add('focus')
                    break
                case '/board.html':
                    share.classList.add('focus')
                    break
                case '/boardview.html':
                    share.classList.add('focus')
                    break
                case '/board__write.html':
                    share.classList.add('focus')
                    break
                case '/badmouse.html':
                    fuck.classList.add('focus')
                    break
                case '/badmouseview.html':
                    fuck.classList.add('focus')
                    break
                case '/badmouse__write.html':
                    fuck.classList.add('focus')
                    break
                case '/tips.html':
                    tip.classList.add('focus')
                    break
                case '/tipsview.html':
                    tip.classList.add('focus')
                    break
                case '/tips__write.html':
                    tip.classList.add('focus')
                    break
                case '/workspace.html':
                    work.classList.add('focus')
                    break
                case '/workspaces.html':
                    work.classList.add('focus')
                    break
                case '/workspace__write.html':
                    work.classList.add('focus')
                    break
                case '/salary.html':
                    pay.classList.add('focus')
                    break
                case '/rem.html':
                    recommend.classList.add('focus')
                    break
                case '/remview.html':
                    recommend.classList.add('focus')
                    break
                default:
                    break
            }
        }

        return [input, img, alram, content_div, newDiv]
    }

    createAlramItem = (data, type) => {
        const item = document.createElement('div')
        item.classList.add('item')

        const titleWrap = document.createElement('div')
        titleWrap.classList.add('item__conWrap')
        titleWrap.classList.add('flex_1')

        const title = document.createElement('h5')
        title.innerHTML = `[${data.type}]`

        const datep = document.createElement('p')
        datep.classList.add('item__conWrap--date')
        datep.innerHTML = data.date

        titleWrap.appendChild(title)
        // titleWrap.appendChild(datep)

        let conWrap, con, date

        conWrap = document.createElement('div')
        con = document.createElement('p')
        date = document.createElement('p')

        conWrap.classList.add('item__conWrap')
        con.classList.add('item__conWrap--con')
        date.classList.add('item__conWrap--date')

        const contentLe = data.content ? data.content : `${data.profile_nickname}님이 팔로우 했습니다.`
        con.innerHTML = `${contentLe}`
        date.innerHTML = data.profile_nickname

        conWrap.appendChild(con)
        conWrap.appendChild(date)

        let close = document.createElement('p')
        close.innerHTML = 'X'
        close.classList.add('item__close')

        item.appendChild(titleWrap)
        item.appendChild(conWrap)
        // item.appendChild(close)

        return [item, close]
    }
}
