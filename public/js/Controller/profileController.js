import View from '../Core/Mvc/View.js'
import userModels from '../Model/usersModel.js'
import categoryModel from '../Model/categoryModel.js'
import postModel from '../Model/postModel.js'
import utils from '../Core/Singleton/utils.js'
import Singleton from '../Core/Singleton/Singleton.js'
import portfolioItem from '../View/portfolioItem.js'

const typePortfolio = 'portfolio'
const typeBoard = 'board'
const typeBadMouse = 'badmouse'
const typeTip = 'tip'
const typeWorkspace = 'workspace'

export default class mypageController {
    constructor(myInfo, userIdx, isLogin) {
        // console.log(userIdx)
        // myinfo값이 들어오면 내 페이지, 아니면 느그 페이지
        this._isMyPage = myInfo ? true : false
        this._myInfo = myInfo
        // 유저 정보, 서버에서 유저 정보가 구현되면 여기에서 데이터를 넣어 주어야 한다.
        this._Info = userIdx ? userIdx : null

        this._view = new View()
        this._userModel = new userModels()
        this._postModel = new postModel()
        this._singleton = new Singleton()
        this._categoryModel = new categoryModel()
        this._postItem = new portfolioItem()
        this._requestType = 'unitary'

        this._isLogin = isLogin

        this._workspaceIdx
        this._workspaceLimit = 4
        this._workspacePage = 1

        this._portfoiloIdx
        this._portfoiloLimit = 5
        this._portfolioPage = 1
        this.lifeCycel()
    }

    lifeCycel = async () => {
        //404 페이지 보여줘야함
        if (!this._Info) return

        this.getUserInfo().then((e) => {
            if (Object.keys(e).includes('stats')) {
                this._view.getElement('#userInfo').classList.add('hidden')
            }
            utils().setSEO(`${e.profile_nickname} - GAESHOW`, e.profile_nickname, `${e.profile_nickname}님의 데스크 세팅과 작성 정보를 확인하세요!`, e.profile_image_url)
            this.setButton(this._isMyPage, e)
            this.setUserInfo(e)
        })
        this.getCategory().then((e) => {
            this._workspaceIdx = e[0]
            this._portfiloiIdx = e[1]
            // 빈값 예외처리 해야함
            this.getPostData(this._workspaceIdx, this._workspacePage, this._workspaceLimit).then((e) => this.setWorkspace(e))
            this.getPostData(this._portfiloiIdx, this._portfolioPage, this._portfoiloLimit).then((e) => this.setPortfolio(e))
        })
        const activePageTitle = this._view.getElement('#workspaceTitle')
        const bookmarkPageTitle = this._view.getElement('#myPostTitle')
        // 페이지 변경
        const userPostBtn = this._view.getElement(`#userPost`)
        const bookmarkPostBtn = this._view.getElement('#bookmarkPost')
        userPostBtn.onclick = () => {
            if (this._requestType == 'unitary') return
            activePageTitle.innerHTML = '작성한 워크페이스'
            bookmarkPageTitle.innerHTML = '작성한 게시물'
            userPostBtn.classList.add('focus')
            bookmarkPostBtn.classList.remove('focus')
            this._requestType = 'unitary'
            this.getCategory().then((e) => {
                this._workspaceIdx = e[0]
                this._portfiloiIdx = e[1]
                // 빈값 예외처리 해야함
                this.getPostData(this._workspaceIdx, this._workspacePage, this._workspaceLimit).then((e) => this.setWorkspace(e))
                this.getPostData(this._portfiloiIdx, this._portfolioPage, this._portfoiloLimit).then((e) => this.setPortfolio(e))
            })
        }

        if (!this._isMyPage) {
            bookmarkPostBtn.classList.add('hidden')
        } else {
            bookmarkPostBtn.onclick = () => {
                if (this._requestType == 'bookmark') return
                activePageTitle.innerHTML = '북마크 워크페이스'
                bookmarkPageTitle.innerHTML = '북마크 게시물'
                bookmarkPostBtn.classList.add('focus')
                userPostBtn.classList.remove('focus')
                this._requestType = 'bookmark'
                this.getCategory().then((e) => {
                    this._workspaceIdx = e[0]
                    this._portfiloiIdx = e[1]
                    // 빈값 예외처리 해야함
                    this.getPostData(this._workspaceIdx, this._workspacePage, this._workspaceLimit).then((e) => this.setWorkspace(e))
                    this.getPostData(this._portfiloiIdx, this._portfolioPage, this._portfoiloLimit).then((e) => this.setPortfolio(e))
                })
            }
        }
    }
    getUserInfo = async () => {
        const userInfo = await this._userModel.getUserInfo(this._Info, this._isLogin)
        return userInfo
    }
    setUserInfo = async (data) => {
        const { is_information_open, profile_email, profile_image_url, profile_nickname, information, following, follower } = data
        // console.log(data)
        this._view.getElement('#nickname').innerHTML = profile_nickname
        this._view.getElement('#profileImg').src = profile_image_url
        this._view.getElement('#follows').innerHTML = following
        this._view.getElement('#followers').innerHTML = follower
        // 인포 정보 세팅
        if (is_information_open == 1) {
            this._view.getElement('#email').innerHTML = profile_email ? profile_email : '미입력'
            this._view.getElement('#info').innerHTML = information
        } else {
            if (this._isMyPage) {
                // console.log(this._myInfo)
                this._view.getElement('#email').innerHTML = `${this._myInfo.profile_email ? this._myInfo.profile_email : '미입력'} (비공개)`
                const infoArr = []
                if (this._myInfo.job_type) infoArr.push(this._myInfo.job_type)
                if (this._myInfo.experience_years) infoArr.push(this._myInfo.experience_years)
                if (this._myInfo.working_area) infoArr.push(this._myInfo.working_area)
                this._view.getElement('#info').innerHTML = `${infoArr.length > 0 ? infoArr.join(' / ') : ''} (비공개)`
            } else {
                this._view.getElement('#email').innerHTML = '이메일 비공개'
                this._view.getElement('#info').innerHTML = '정보 비공개'
            }
        }
    }

    getCategory = async () => {
        const resData = await this._categoryModel.getPost()
        let workspace, portfolio
        resData.map((e) => {
            if (e.name == '워크스페이스 공유') workspace = e.id
            if (e.name == '전체보기') portfolio = e.id
        })
        // console.log(resData)
        return [workspace, portfolio]
    }
    getPostData = async (idx, page, limit) => {
        const reqData = this._postModel._oriReqData
        reqData.category_id = idx
        reqData.page = page
        reqData.limit = limit
        reqData.type = this._requestType
        reqData.user_id = this._Info
        // console.log(reqData)
        const resData = await this._postModel.getPosts(reqData)
        // console.log(resData)
        return resData
    }
    setWorkspace = (data) => {
        // 총 개수
        const countWrap = this._view.getElement('#workspaceCount')
        const count = data.post_count ? data.post_count : 0
        countWrap.innerHTML = count
        // 아이템 생성
        const wrap = this._view.getElement('#workWrap')
        while (wrap.hasChildNodes()) {
            wrap.removeChild(wrap.firstChild)
        }
        data.posts.map((itemData) => {
            const item = this._postItem.createWorkSpaceListItem(itemData)
            wrap.appendChild(item)
        })
        // 페이징
        this.setPagination(count, this._workspacePage, this._workspaceLimit, typeWorkspace)
    }
    setPortfolio = (data) => {
        // console.log('port', data)
        const countWrap = this._view.getElement('#portfolioCount')
        const count = data.post_count ? data.post_count : 0
        countWrap.innerHTML = count

        const wrap = this._view.getElement('#portfolioWrap')
        while (wrap.hasChildNodes()) {
            wrap.removeChild(wrap.firstChild)
        }
        data.posts.map((itemData) => {
            const item = this._postItem.getItem(itemData, typePortfolio)
            wrap.appendChild(item)
        })
        this.setPagination(count, this._portfolioPage, this._portfoiloLimit, typePortfolio)
    }
    setButton = (isMyPage, e) => {
        // console.log(e)
        if (isMyPage) {
            //내페이지
            const modifyBtn = this._view.getElement('#modifyBtn')
            const logoutBtn = this._view.getElement('#logoutBtn')

            modifyBtn.style.display = 'block'
            logoutBtn.style.display = 'block'

            modifyBtn.onclick = () => this.goEditPage()
            logoutBtn.onclick = () => this.startLogOut()
        } else {
            const followBtn = this._view.getElement('#followBtn')
            if (e.following_id == 0) {
                followBtn.innerHTML = '팔로우'
                followBtn.onclick = async () => {
                    await this._userModel.follow(this._Info).then(() => {
                        this.getUserInfo().then((e) => {
                            this.setButton(this._isMyPage, e)
                            this.setUserInfo(e)
                        })
                    })
                }
            } else {
                followBtn.innerHTML = '팔로우 취소'
                followBtn.onclick = async () => {
                    await this._userModel.unfollow(e.following_id).then(() => {
                        this.getUserInfo().then((e) => {
                            this.setButton(this._isMyPage, e)
                            this.setUserInfo(e)
                        })
                    })
                }
            }
            followBtn.style.display = 'block'
        }
    }

    goEditPage = () => {
        window.location.href = '/mypage__edit.html'
    }

    startLogOut = async () => {
        await this._userModel.logoutUser()
        this._singleton.deleteCookie('accessToken')
        window.location.href = '/'
    }
    setPagination = async (allCount, nowPage, limit, type) => {
        let pageWrapper
        if (type == typeWorkspace) {
            pageWrapper = this._view.getElement('#workPage')
            while (pageWrapper.hasChildNodes()) {
                pageWrapper.removeChild(pageWrapper.firstChild)
            }
        } else {
            pageWrapper = this._view.getElement('#portfolioPage')
            while (pageWrapper.hasChildNodes()) {
                pageWrapper.removeChild(pageWrapper.firstChild)
            }
        }
        if (allCount <= limit) return
        const paginationView = await import('../View/pagination.js')
        let paginationRepo = new paginationView.default(allCount, nowPage, limit, type)
        const paginationItem = paginationRepo.createPagenationMyProfile()

        while (pageWrapper.hasChildNodes()) {
            pageWrapper.removeChild(pageWrapper.firstChild)
        }
        pageWrapper.appendChild(paginationItem[0])
        // console.log(paginationItem)
        // 페이지네이션 아이템 이벤트 등록
        const prevBtnClick = (type) => {
            if (type == typeWorkspace) {
                this._workspacePage = this._workspacePage - 5 > 0 ? this._workspacePage - 5 : 1
            } else {
                this._portfolioPage = this._portfolioPage - 5 > 0 ? this._portfolioPage - 5 : 1
            }
            this.resetItems(type)
        }
        const nextBtnClick = (type) => {
            if (type == typeWorkspace) {
                this._workspacePage = this._workspacePage + 5 > 0 ? this._workspacePage + 5 : 1
            } else {
                this._portfolioPage = this._portfolioPage + 5 > 0 ? this._portfolioPage + 5 : 1
            }
            this.resetItems(type)
        }
        const pageSelect = (page, type) => {
            if (type == typeWorkspace) {
                this._workspacePage = page
            } else {
                this._portfolioPage = page
            }
            this.resetItems(type)
        }
        if (paginationItem[1]) paginationItem[1].onclick = () => prevBtnClick(type == typeWorkspace ? typeWorkspace : typePortfolio)
        if (paginationItem[3]) paginationItem[3].onclick = () => nextBtnClick(type == typeWorkspace ? typeWorkspace : typePortfolio)
        paginationItem[2].map((e) => {
            e.onclick = () => {
                pageSelect(e.getAttribute('idx'), type == typeWorkspace ? typeWorkspace : typePortfolio)
            }
        })
    }
    resetItems = (type) => {
        if (type == typeWorkspace) {
            const wrap = this._view.getElement('#workWrap')
            while (wrap.hasChildNodes()) {
                wrap.removeChild(wrap.firstChild)
            }

            this.getPostData(this._workspaceIdx, this._workspacePage, this._workspaceLimit).then((e) => this.setWorkspace(e))
        }
        if (type == typePortfolio) {
            const wrap = this._view.getElement('#portfolioWrap')
            while (wrap.hasChildNodes()) {
                wrap.removeChild(wrap.firstChild)
            }
            this.getPostData(this._portfiloiIdx, this._portfolioPage, this._portfoiloLimit).then((e) => this.setPortfolio(e))
        }
    }
}
