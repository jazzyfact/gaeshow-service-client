export default class footer {
    constructor(viewRepo) {
        this._view = viewRepo
    }

    createFooter = () => {
        const warapper = this._view.getElement('#footer')
        if (!warapper) {
            console.error(`#footer 가 없습니다. footer.js 확인하기`)
            return
        }

        const section = document.createElement('section')
        section.classList.add('footer__item')

        let article1, article2
        article1 = document.createElement('article')
        article1.classList.add('footer__left')

        article2 = document.createElement('article')
        article2.classList.add('footer__right')

        // 좌측 푸터 정보 입력
        let linkWrap, terms, center, suggetion, privacy, p, p2
        linkWrap = document.createElement('div')
        terms = document.createElement('a')
        terms.innerHTML = `이용약관`
        terms.href = `/policy.html`
        center = document.createElement('a')
        center.innerHTML = `고객센터`
        center.href = `/notice.html`
        suggetion = document.createElement('a')
        suggetion.innerHTML = `의견제안`
        suggetion.addEventListener('click', () => {
            Gitple('open')
        })
        privacy = document.createElement('a')
        privacy.innerHTML = `개인정보처리방침`
        privacy.href = `/privacy.html`

        linkWrap.appendChild(center)
        linkWrap.appendChild(suggetion)
        linkWrap.appendChild(terms)
        linkWrap.appendChild(privacy)

        p = document.createElement('p')
        p.innerHTML = `개쇼는 통신판매중개자로서 거래 당사자가 아니며,<br />입점 판매사가 등록한 상품 정보 및 거래에 대해 책임을 지지 않습니다.`

        article1.appendChild(linkWrap)
        article1.appendChild(p)

        section.appendChild(article1)

        // 우측 푸터 정보 입력
        // t == twitter, f == facebook , i == instagram
        let t_a, t_img, f_a, f_img, i_a, i_img
        t_a = document.createElement('a')
        t_img = document.createElement('img')
        t_img.src = `./res/img/icon_tstory.png`
        t_img.alt = `개쇼 티스토리 아이콘`
        t_a.appendChild(t_img)

        t_img.addEventListener('click', () => {
            // window.location.href =
            window.open(`https://gaeshow.tistory.com/`, '_blank')
        })

        f_a = document.createElement('a')
        f_img = document.createElement('img')
        f_img.src = './res/img/icon_facebook.svg'
        f_img.alt = `개쇼 페이스북`
        f_img.classList.add('invert')
        // f_a.appendChild(f_img)

        i_a = document.createElement('a')
        i_img = document.createElement('img')
        i_img.src = `./res/img/icon_instagram.svg`
        i_img.alt = `개쇼 인스타그램`
        i_img.classList.add('invert')
        i_a.appendChild(i_img)
        i_img.addEventListener('click', () => {
            window.open('https://www.instagram.com/gaeshow.official/', '_blank')
        })

        article2.appendChild(t_a)
        article2.appendChild(f_a)
        article2.appendChild(i_a)

        section.appendChild(article2)

        warapper.appendChild(section)
    }
}
