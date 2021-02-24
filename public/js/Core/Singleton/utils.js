export default function utils() {
    return {
        //사용자가 접속한 브라우저가 익스플로러일 경우 스낵바 메세지를 띄워준다
        checkIe(navigator) {
            const agent = navigator.userAgent.toLowerCase()
            if ((navigator.appName == 'Netscape' && agent.indexOf('trident') != -1) || agent.indexOf('msie') != -1) {
                // ie일 경우
                this.snackbar('ie는 최적화가 되어있지 않습니다. 크롬으로 들어와주세요.')
            }
        },

        snackbar(msg, type = 'error') {
            const snackbar = document.querySelector('#snackbar')
            snackbar.classList.remove('hidden')
            const icon = snackbar.querySelector('#snackbarIcon')
            const text = snackbar.querySelector('#snackbarText')

            text.innerHTML = msg
            if (type == 'error') {
                icon.src = '../res/img/icon_bell.svg'
                icon.classList.add('errorIcon')
                text.classList.add('errorText')
            }

            setTimeout(function () {
                snackbar.classList.add('hidden')
            }, 3000)
        },
        emailChecker(email) {
            var regex = /([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/
            return email != '' && email != 'undefined' && regex.test(email)
        },

        passWordChecker(pw) {
            const regex = /^(?=.*[a-zA-Z])((?=.*\d)|(?=.*\W)).{8,20}$/
            return pw != '' && pw != 'undefined' && regex.test(pw)
        },
        nicknameChecker(nick) {
            const regex = /^.{1,10}$/
            return nick != '' && nick != 'undefined' && regex.test(nick)
        }, // 파라미터 얻기
        getParameterByName(name) {
            name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]')
            var regex = new RegExp('[\\?&]' + name + '=([^&#]*)'),
                results = regex.exec(location.search)
            return results == null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '))
        },
        removeHTMLTag(string) {
            return string.replace(/<[^>]*>?/gm, '')
        },
        copyUrl() {
            const url = window.location.href
            const div = document.createElement('input')
            div.type = 'text'
            document.body.appendChild(div)
            div.value = url
            div.select()
            document.execCommand('copy')
            document.body.removeChild(div)
            return url
        },
        moveTo(element) {
            const movedLocation = element.offsetTop - 20
            window.scrollTo({ top: movedLocation, behavior: 'smooth' })
        },
        setPreSEO(title) {
            const head = document.getElementsByTagName('head')[0]

            // 필요한 태그들 생성

            // 파비콘
            let favicon = document.createElement('link')
            favicon.rel = 'shortcut icon'
            favicon.href = '/res/img/favicon-32x32.png'
            favicon.type = 'image/x-icon'

            // 기본
            let d_title, m_title, canocial

            d_title = document.createElement('title')
            d_title.innerHTML = title

            m_title = document.createElement('meta')
            m_title.name = 'title'
            m_title.content = title

            canocial = document.createElement('link')
            canocial.rel = 'canonical'
            canocial.href = location.href

            // og
            let og_type, og_site_name, og_title, og_section

            og_type = document.createElement('meta')
            og_type.name = 'og:type'
            og_type.content = 'website'

            og_site_name = document.createElement('meta')
            og_site_name.name = 'og:site_name'
            og_site_name.content = 'GAESHOW'

            og_title = document.createElement('meta')
            og_title.name = 'og:title'
            og_title.content = title

            og_section = document.createElement('meta')
            og_section.name = 'article:section'
            og_section.content = 'IT 인터넷'

            //twitter
            let t_card, t_site, t_title

            t_card = document.createElement('meta')
            t_card.name = 'twitter:card'
            t_card.content = 'summary_large_image'

            t_site = document.createElement('meta')
            t_site.name = 'twitter:site'
            t_site.content = '@GAESHOW'

            t_title = document.createElement('meta')
            t_title.name = 'twitter:title'
            t_title.content = title

            // 넣기
            head.appendChild(favicon)

            head.appendChild(d_title)
            head.appendChild(m_title)
            head.appendChild(canocial)

            head.appendChild(og_type)
            head.appendChild(og_site_name)
            head.appendChild(og_title)
            head.appendChild(og_section)

            head.appendChild(t_card)
            head.appendChild(t_site)
            head.appendChild(t_title)
        },
        setSEO(title, keyword, des, img) {
            const head = document.getElementsByTagName('head')[0]

            // 필요한 태그들 생성

            // 파비콘
            let favicon = document.createElement('link')
            favicon.rel = 'shortcut icon'
            favicon.href = '/res/img/favicon-32x32.png'
            favicon.type = 'image/x-icon'
            favicon.setAttribute('t', 't')

            // 기본
            let d_title, m_title, m_keywords, m_description, canocial

            d_title = document.createElement('title')
            d_title.innerHTML = title
            d_title.setAttribute('t', 't')

            m_title = document.createElement('meta')
            m_title.name = 'title'
            m_title.content = title
            m_title.setAttribute('t', 't')

            m_keywords = document.createElement('meta')
            m_keywords.name = 'keywords'
            m_keywords.content = `개쇼,개발자 쇼핑몰,개발자,개발자 필수탬,개발자 추천,${keyword}`
            m_keywords.setAttribute('t', 't')

            m_description = document.createElement('meta')
            m_description.name = 'description'
            m_description.content = des
            m_description.setAttribute('t', 't')

            canocial = document.createElement('link')
            canocial.rel = 'canonical'
            canocial.href = location.href
            canocial.setAttribute('t', 't')

            // og
            let og_type, og_site_name, og_title, og_description, og_image, og_section

            og_type = document.createElement('meta')
            og_type.name = 'og:type'
            og_type.content = 'website'
            og_type.setAttribute('t', 't')

            og_site_name = document.createElement('meta')
            og_site_name.name = 'og:site_name'
            og_site_name.content = 'GAESHOW'
            og_site_name.setAttribute('t', 't')

            og_title = document.createElement('meta')
            og_title.name = 'og:title'
            og_title.content = title
            og_title.setAttribute('t', 't')

            og_description = document.createElement('meta')
            og_description.name = 'og:description'
            og_description.content = des
            og_description.setAttribute('t', 't')

            og_image = document.createElement('meta')
            og_image.name = 'og:image'
            og_image.setAttribute('t', 't')
            if (img) {
                og_image.content = img
            } else {
                og_image.content = 'http://gaeshow.co.kr/res/img/icon_default_img.svg'
            }

            og_section = document.createElement('meta')
            og_section.name = 'article:section'
            og_section.content = 'IT 인터넷'
            og_section.setAttribute('t', 't')

            //twitter
            let t_card, t_site, t_title, t_description, t_image

            t_card = document.createElement('meta')
            t_card.name = 'twitter:card'
            t_card.content = 'summary_large_image'
            t_card.setAttribute('t', 't')

            t_site = document.createElement('meta')
            t_site.name = 'twitter:site'
            t_site.content = '@GAESHOW'
            t_site.setAttribute('t', 't')

            t_title = document.createElement('meta')
            t_title.name = 'twitter:title'
            t_title.content = title
            t_title.setAttribute('t', 't')

            t_description = document.createElement('meta')
            t_description.name = 'twitter:description'
            t_description.content = des
            t_description.setAttribute('t', 't')

            t_image = document.createElement('meta')
            t_image.name = 'twitter:image'
            t_image.setAttribute('t', 't')
            if (img) {
                t_image.content = img
            } else {
                t_image.content = 'http://gaeshow.co.kr/res/img/icon_default_img.svg'
            }

            // 넣기
            head.appendChild(favicon)

            head.appendChild(d_title)
            head.appendChild(m_title)
            head.appendChild(m_keywords)
            head.appendChild(m_description)
            head.appendChild(canocial)

            head.appendChild(og_type)
            head.appendChild(og_site_name)
            head.appendChild(og_title)
            head.appendChild(og_description)
            head.appendChild(og_image)
            head.appendChild(og_section)

            head.appendChild(t_card)
            head.appendChild(t_site)
            head.appendChild(t_title)
            head.appendChild(t_description)
            head.appendChild(t_image)
        },
        removeSEO() {
            const head = document.getElementsByTagName('head')[0]

            for (let i = 0; i < head.childNodes.length; i++) {
                const node = head.childNodes[i]
                try {
                    if (node.getAttribute('t')) {
                        head.removeChild(head.childNodes[i])
                    }
                } catch (e) {}
            }
            for (let i = 0; i < head.childNodes.length; i++) {
                const node = head.childNodes[i]
                try {
                    if (node.getAttribute('t')) {
                        head.removeChild(head.childNodes[i])
                    }
                } catch (e) {}
            }
        }
    }
}
