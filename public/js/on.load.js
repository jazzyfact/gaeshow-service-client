import Singleton from './Core/Singleton/Singleton.js'
import recentItem from './View/recentItem.js'
import View from './Core/Mvc/View.js'
import header from './View/header.js'
import usersModel from './Model/usersModel.js'
import utils from './Core/Singleton/utils.js'
import footer from './View/footer.js'
import alram from './Model/alram.js'
import categoryModel from './Model/categoryModel.js'

const _view = new View()
const headerRepo = new header()
const footerRepo = new footer(_view)
const _singleTon = new Singleton()
const _usersModel = new usersModel()
const _alramModel = new alram()
const _categoryModel = new categoryModel()

// 글로벌하게 쓰이는 나의 정보
let myInfo

let categoryInfo
let storeCategoryInfo

const createRecentItem = () => {
    const recentRepo = new recentItem()
    const recentData = _singleTon.getCookie('recent')
    if (recentData) {
        const recentList = JSON.parse(recentData)
        recentList.reverse()
        recentList.map((e, i) => {
            if (i > 2) return
            recentRepo.setSectionItem(e.image_url, e.name, `₩ ${e.price}`, e.product_id)
        })
        const parent = _view.getElement('.sidebar__right', document)
        const repo = recentRepo.getElement()
        _view.appendElementFromParent(parent, repo)
        // 앱스토어, 구글 플레이스토어 아이템 추가
        const div1 = document.createElement('img')
        div1.src = `../res/img/icon_playstore.png`
        const div2 = document.createElement('img')
        div2.src = `../res/img/icon_appstore.png`
        repo.appendChild(div1)
        repo.appendChild(div2)
    }
}

const lifeCycle = async () => {
    const pathname = window.location.pathname
    const location = window.location.search
    let pathData
    if (location) pathData = `${pathname}${location}`
    else pathData = pathname
    // 이전 경로 저장
    let pathList = []
    const pathListData = _singleTon.getCookie('paths')
    if (pathListData) {
        const data = JSON.parse(pathListData)
        pathList = data
    }
    // 중복 제거
    const pathIndex = pathList.findIndex((e) => e == encodeURI(pathData))
    if (pathIndex > -1) {
        pathList.splice(pathIndex, 1)
    }
    pathList.push(encodeURI(pathData))
    const strData = JSON.stringify(pathList)
    _singleTon.setCookie('paths', strData, 7)

    // 네비게이션에 하단 추가 네베게이션이 들어가는 html리스트
    const subMatch = [
        '/portfolio.html',
        '/portfolioview.html',
        '/portfolio__write.html',
        '/board.html',
        '/boardview.html',
        '/board__write.html',
        '/badmouse.html',
        '/badmouseview.html',
        '/badmouse__write.html',
        '/tips.html',
        '/tipsview.html',
        '/tips__write.html',
        '/workspace.html',
        '/workspaces.html',
        '/workspace__write.html',
        `/salary.html`,
        '/rem.html',
        '/remview.html'
    ]
    // 로그인 비로그인 체크
    // 로그인은 acesstoken이 있는지 없는지로 체크함.
    const acessToken = _singleTon.getCookie('accessToken')
    let isLogin = false
    if (acessToken) {
        // 로그인 되면 accessToken을 사용해서 유저 정보를 얻음.
        const resData = await _usersModel.myInfo()
        console.log(resData)
        // return
        if (resData.user_id) myInfo = resData
        else {
            // console.log(acessToken)
            // return
            _singleTon.deleteCookie('accessToken')
            // utils().snackbar('로그인이 만료 되었습니다.')
        }
        if (resData.user_id) isLogin = true
        // 문의하기 로그인
        // console.log(resData)
        if (window.Gitple) {
            const loginUser = {
                id: resData.user_id, // 상담고객 식별 ID
                name: resData.profile_nickname,
                email: resData.profile_email,
                meta: {
                    // Company: 'Gitple',
                    // Link: '<a href="https://gitple.io/" target="_blank">내부정보</a>',
                    // 고객정보: '<a href="https://myService/api/customer?id=12345" target="_blank">고객정보</a>',
                    // 이슈생성: '<a href="https://github.com/gitple/cs/issues/new?title=이슈제목&body=고객이슈내용" target="_blank">이슈생성</a>'
                }
            }

            window.Gitple('boot', loginUser)
        }
    } else {
        // 문의하기 비 로그인
        Gitple('boot')
    }

    // 헤더 컨트롤, 서브 뷰가 필요하면 true, 필요 없으면 false로 한다.
    if (pathname != '/naverlogin.html') {
        headerRepo.createBanner()
        const items = headerRepo.createNav(subMatch.includes(pathname) ? true : false, myInfo)
        // items[0] input, items[1] searchIcon
        items[0].onkeydown = (e) => {
            if (e.code == 'Enter') {
                const inputText = items[0].value
                if (!inputText || inputText == '') return
                window.location.href = `/result.html?s=${inputText}`
            }
        }
        items[1].onclick = () => {
            const inputText = items[0].value
            if (!inputText || inputText == '') return
            window.location.href = `/result.html?s=${inputText}`
        }

        if (isLogin) {
            items[2].onclick = () => {
                if (items[3].classList[1] == 'hidden') {
                    items[3].classList.remove('hidden')
                } else {
                    items[3].classList.add('hidden')
                }
            }

            // 알람 통신 진행
            const reqData = {}
            reqData.page = 1
            reqData.limit = 40
            _categoryModel
                .getPost()
                .then((categoryData) => (categoryInfo = categoryData))
                .then(() => _categoryModel.getStore({ type: 'store' }))
                .then((storeCategoryData) => (storeCategoryInfo = storeCategoryData))
                .then(() => _alramModel.getAlram(reqData))
                .then((e) => {
                    console.log(e)
                    const { notification_count, unread_count, is_next, notifications } = e
                    if (unread_count != 0) {
                        items[4].classList.remove('hidden')
                    } else {
                        items[4].classList.add('hidden')
                    }
                    // 정렬
                    notifications.sort((a, b) => {
                        return a.is_read < b.is_read ? -1 : a.is_read > b.is_read ? 1 : 0
                    })

                    notifications.map((e) => {
                        const { id, type_num, unique_id, is_read, post_category_id, product_category_id } = e

                        let tempitem
                        if (type_num == 1) {
                            // 카테고리 정보를 통해서 얻어옴
                            const findCategoryId = categoryInfo.findIndex((e) => e.id == post_category_id)
                            tempitem = headerRepo.createAlramItem(e, 'community')
                            if (tempitem.length < 1) return
                            items[3].appendChild(tempitem[0])
                            // 커뮤니티
                            tempitem[0].onclick = () => {
                                // 알람 읽음 처리
                                _alramModel.readAlram(id).then((e) => {
                                    switch (categoryInfo[findCategoryId].id) {
                                        // 전체
                                        case 1:
                                            break
                                        // 업무 얘기 공유
                                        case 2:
                                            window.location.href = `/boardview.html?n=${unique_id}`
                                            break
                                        // 회사 욕 하기
                                        case 3:
                                            window.location.href = `/badmouseview.html?n=${unique_id}`
                                            break
                                        // 프리랜서 팁 공유
                                        case 4:
                                            window.location.href = `/tipsview.html?n=${unique_id}`
                                            break
                                        // 워크스페이스 공유
                                        case 5:
                                            window.location.href = `/workspace.html?n=${unique_id}`
                                            break
                                        // 개발자 연봉 보기
                                        case 6:
                                            break
                                        // IDE, 언어 추천
                                        case 7:
                                            break
                                        // 자기 작업물 자랑
                                        case 8:
                                            window.location.href = `/portfolioview.html?n=${unique_id}`
                                            break
                                    }
                                })
                            }
                        } else if (type_num == 6) {
                            // 스토어
                            const findCategoryId = storeCategoryInfo.findIndex((e) => e.id == product_category_id)
                            tempitem = headerRepo.createAlramItem(e, 'store')
                            items[3].appendChild(tempitem[0])

                            tempitem[0].onclick = () => {
                                _alramModel.readAlram(id).then((e) => {
                                    window.location.href = `/product.html?i=${e.unique_id}`
                                })
                            }
                        } else {
                            // 팔로우
                            tempitem = headerRepo.createAlramItem(e, 'follow')
                            items[3].appendChild(tempitem[0])
                            tempitem[0].onclick = () => {
                                _alramModel.readAlram(id)
                                tempitem[0].style.backgroundColor = 'white'
                            }
                        }
                        if (is_read == 0) {
                            if (tempitem && tempitem.length > 0) {
                                tempitem[0].style.backgroundColor = 'rgba(0,0,0,0.1)'
                            }
                        }
                    })
                })
        }
    }
    // 푸터 컨트롤
    footerRepo.createFooter()

    // const singleton = new Singleton()
    switch (pathname) {
        case '/':
            utils().setPreSEO('GAESHOW')
            const indexController = await import('./Controller/indexController.js')
            new indexController.default()
            createRecentItem()
            break
        case '/policy.html':
            utils().setPreSEO('개쇼 서비스 이용약관 - GAESHOW')
            break
        case '/privacy.html':
            utils().setPreSEO('개쇼 개인정보 처리 방침 - GAESHOW')
            break
        case '/terms.html':
            utils().setPreSEO('개쇼 약관 동의 - GAESHOW')
            if (isLogin) {
                window.location.href = '/'
                return
            }
            const termsController = await import('./Controller/termsController.js')
            new termsController.default()
            break
        case '/signup.html':
            utils().setPreSEO('회원가입 - GAESHOW')
            if (isLogin) {
                window.location.href = '/'
                return
            }
            const signupController = await import('./Controller/signupController.js')
            new signupController.default()
            break
        case '/login.html':
            utils().setPreSEO('로그인 - GAESHOW')
            if (isLogin) {
                window.location.href = '/'
                return
            }
            const loginContoller = await import('./Controller/loginController.js')
            new loginContoller.default()
            break

        case '/store.html':
            // SEO -> controller
            const storeContoller = await import('./Controller/storeListController.js')
            new storeContoller.default()
            createRecentItem()
            break
        case '/product.html':
            // SEO -> controller
            const productController = await import('./Controller/productController.js')
            new productController.default(myInfo)
            createRecentItem()
            break
        case '/portfolio.html':
            utils().setPreSEO('자기작업물자랑 - GAESHOW')
            const portfolioController = await import(`./Controller/postController.js`)
            new portfolioController.default(isLogin, 'portfolio')
            break
        case '/portfolioview.html':
            // SEO -> controller
            const portfolioviewContorller = await import(`./Controller/postViewController.js`)
            new portfolioviewContorller.default(isLogin, 'portfolio', myInfo)
            break
        case '/portfolio__write.html':
            utils().setPreSEO('글 작성 - GAESHOW')
            if (!isLogin) {
                window.location.href = '/'
                return
            }
            const writeController = await import(`./Controller/postWriteController.js`)
            new writeController.default(isLogin, 'portfolio', myInfo)
            break
        case '/board.html':
            utils().setPreSEO('업무얘기공유 - GAESHOW')
            const postController = await import(`./Controller/postController.js`)
            new postController.default(isLogin, 'board')
            break
        case '/board__write.html':
            utils().setPreSEO('글 작성 - GAESHOW')
            const writeContorller = await import(`./Controller/postWriteController.js`)
            new writeContorller.default(isLogin, 'board', myInfo)
            break
        case '/boardview.html':
            // SEO -> controller
            const boardController = await import(`./Controller/postViewController.js`)
            new boardController.default(isLogin, 'board', myInfo)
            break
        case '/badmouse.html':
            utils().setPreSEO('회사욕하기 - GAESHOW')
            const badController = await import(`./Controller/postController.js`)
            new badController.default(isLogin, 'badmouse')
            break
        case '/badmouse__write.html':
            utils().setPreSEO('글 작성 - GAESHOW')
            const badWriteContorller = await import(`./Controller/postWriteController.js`)
            new badWriteContorller.default(isLogin, 'badmouse', myInfo)
            break
        case '/badmouseview.html':
            // SEO -> controller
            const badViewController = await import(`./Controller/postViewController.js`)
            new badViewController.default(isLogin, 'badmouse', myInfo)
            break
        case '/tips.html':
            utils().setPreSEO('프리랜서팁공유 - GAESHOW')
            const tipController = await import(`./Controller/postController.js`)
            new tipController.default(isLogin, 'tip')
            break
        case '/tips__write.html':
            utils().setPreSEO('글 작성 - GAESHOW')
            const tipWriteContorller = await import(`./Controller/postWriteController.js`)
            new tipWriteContorller.default(isLogin, 'tip', myInfo)
            break
        case '/tipsview.html':
            // SEO -> controller
            const tipViewController = await import(`./Controller/postViewController.js`)
            new tipViewController.default(isLogin, 'tip', myInfo)
            break
        case `/profile.html`:
            // SEO -> controller
            // 요청하는 유저 인덱스를 찾아서 내 페이지인지 구분
            const idx = utils().getParameterByName('n')
            const profileController = await import(`./Controller/profileController.js`)
            if (!idx && isLogin) {
                // 로그인 상태에서 idx 없을때
                new profileController.default(myInfo, myInfo.user_id, isLogin)
            } else if (!idx && !isLogin) {
                // 비로그인 상태에서 idx 없을때
                new profileController.default(null, null, isLogin)
            } else {
                // 일반 접근
                new profileController.default(null, idx, isLogin)
            }
            break
        case `/mypage__edit.html`:
            utils().setPreSEO('내정보 수정 - GAESHOW')
            if (!isLogin) {
                window.location.href = '/'
                return
            }

            const mypageController = await import(`./Controller/mypageController.js`)
            new mypageController.default(myInfo)

            break
        case `/rem.html`:
            utils().setPreSEO('언어,IDE추천 - GAESHOW')
            const ide = await import(`./Controller/ideController.js`)
            new ide.default()
            break

        case `/remview.html`:
            // SEO -> controller
            const ideview = await import(`./Controller/ideViewController.js`)
            new ideview.default(myInfo)
            break
        case `/workspaces.html`:
            utils().setPreSEO('워크스페이스 - GAESHOW')
            const workspacesController = await import(`./Controller/workspaceListController.js`)
            new workspacesController.default(isLogin)
            break
        case `/workspace.html`:
            // SEO -> controller
            const workspaceController = await import(`./Controller/postViewController.js`)
            new workspaceController.default(isLogin, 'workspace', myInfo)
            break
        case `/workspace__write.html`:
            utils().setPreSEO('글 작성 - GAESHOW')
            const workWrite = await import(`./Controller/postWriteController.js`)
            new workWrite.default(isLogin, 'workspace', myInfo)
            break
        case `/salary.html`:
            const salaryController = await import(`./Controller/salaryController.js`)
            new salaryController.default(isLogin)
            break
        case '/naverlogin.html':
            const callback = await import('./Controller/naverLoginCallback.js')
            new callback.default()
            break
        // 공지사항
        case `/notice.html`:
            utils().setPreSEO('공지사항 - GAESHOW')
            const notice = await import('./Controller/serviceCenterController.js')
            new notice.default(_view, utils(), 'notice')
            break
        case `/faq.html`:
            utils().setPreSEO('자주하는질문 - GAESHOW')
            const faq = await import('./Controller/serviceCenterController.js')
            new faq.default(_view, utils(), 'faq')
            break
        case `/question.html`:
            utils().setPreSEO('문의하기 - GAESHOW')
            if (!isLogin) {
                console.log('로그인 풀림')
                // window.location.href = `/login.html`
                return
            }
            const question = await import(`./Controller/serviceCenterController.js`)
            new question.default(_view, utils(), 'question')
            break
        case `/question__write.html`:
            utils().setPreSEO('글 작성 - GAESHOW')
            if (!isLogin) {
                window.location.href = `/login.html`
                return
            }
            const questionWriteController = await import(`./Controller/questionWriteController.js`)
            new questionWriteController.default(_view, utils())
            break
        case `/questionview.html`:
            if (!isLogin) {
                window.location.href = `/login.html`
                return
            }
            const questionViewController = await import(`./Controller/questionViewController.js`)
            new questionViewController.default(_view, utils())
            break
        case `/report.html`:
            utils().setPreSEO('신고목록 - GAESHOW')
            if (!isLogin) {
                window.location.href = `/login.html`
                return
            }
            const report = await import(`./Controller/serviceCenterController.js`)
            new report.default(_view, utils(), 'report', myInfo)
            break
        case `/result.html`:
            const resultContoller = await import(`./Controller/resultController.js`)
            new resultContoller.default()
            break
    }
}

lifeCycle()
