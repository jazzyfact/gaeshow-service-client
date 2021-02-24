import utils from '../Core/Singleton/utils.js'
import postModel from '../Model/postModel.js'
import commnetModel from '../Model/commentModel.js'
import View from '../Core/Mvc/View.js'
import portfolioitem from '../View/portfolioItem.js'
import comment from '../View/comment.js'
import evaluationModel from '../Model/evaluationModel.js'
import report from '../View/report.js'
import serviceCenterModel from '../Model/serviceCenterModel.js'
import userModel from '../Model/usersModel.js'
import storeModel from '../Model/storeModel.js'
import shareModel from '../Model/shareModel.js'

const typePortfolio = 'portfolio'
const typeBoard = 'board'
const typeBadMouse = 'badmouse'
const typeTip = 'tip'
const typeWorkspace = 'workspace'
export default class postViewController {
    constructor(isLogin, type, myInfo) {
        this._postNo = utils().getParameterByName('n')
        // console.log(this._postNo)
        // 알수 없는 페이지, 404 처리 해야함
        if (!this._postNo) {
            console.error('404 not found')
        }

        this._view = new View()
        this._postModel = new postModel()
        this._commentModel = new commnetModel(this._postNo)
        this._portfolioItem = new portfolioitem()
        this._commentItem = new comment()
        this._evalModel = new evaluationModel()
        this._report = new report()
        this._serviceModel = new serviceCenterModel()
        this._userModel = new userModel()
        this._storeModel = new storeModel()
        this._shareModel = new shareModel()

        this._followingId = 0

        this._categoryId
        this._isDepthTwoCommentOpen = false
        this._isDepthTwoCommentElement
        this._isDepthTwoCommentIdx
        this._type = type
        this._postId
        this._isLogin = isLogin
        if (isLogin) this._myInfo = myInfo
        else this._myInfo = {}
        this._isBookmarked = false
        this._bookmarkId
        this._isLiked = false
        this._likedId
        this._commentPage = 1
        this._commentLimit = 10
        this._commentLikedArr = {} //코멘트 좋아요 키벨류로 관리 키 : 코멘트 idx값 벨류 : rating_id
        this.lifeCycle()
    }

    lifeCycle = async () => {
        // 댓글 등록 이벤트 바인딩
        this._view.getElement('#addCommentBtn').onclick = () => this.addComment()
        // 좋아요 이벤트 바인딩
        this._view.getElement('#likedBtn').onclick = () => this.likeBtnClick()
        // 북마크 이벤트 바인딩
        this._view.getElement('#bookmarkedBtn').onclick = () => this.bookmarkBtnClick()
        // 공유 이벤트 바인딩
        this._view.getElement('#shareBtn').onclick = () => this.sharedBtnClick()
        // 댓글 글자수 제한
        const commentTextArea = this._view.getElement('#addCommentContent')
        commentTextArea.addEventListener('keydown', () => {
            if (commentTextArea.value.length >= 499) {
                utils().snackbar('댓글은 500글자까지 작성 할 수 있습니다.')
                commentTextArea.value = commentTextArea.value.substring(0, 499)
            }
        })
        await Promise.all([this.getPostData(), this.getCommentData()])
            .then((values) => {
                utils().setSEO(`${values[0].title} - GAESHOW`, `${values[0].tags.join(',')}`, `${utils().removeHTMLTag(values[0].content)}`, `${values[0].profile_image_url}`)
                this.setPostData(values[0])
                this.setCommentData(values[1])
                return values[0].user_id
            })
            .then((e) => {
                this.getUserInfo(e).then((data) => this.setUserData(data, e))
                if (this._type == typeWorkspace) {
                    this.getUserWritePost(e).then((data) => this.serUserWritePost(data))
                    // 관련된 상품 검색
                    this.getRelationData().then((e) => {
                        console.log('relation', e)
                    })
                }
                return true
            })
            .catch((e) => {
                console.error(e)
            })
    }

    getPostData = async () => {
        return await this._postModel.getPostDetail(this._postNo, this._isLogin)
    }
    getCommentData = async () => {
        return await this._commentModel.getComments(this._commentPage, this._commentLimit, this._isLogin)
    }
    getUserInfo = async (userIndex) => {
        const resData = await this._userModel.getUserInfo(userIndex, this._isLogin)
        // console.log(resData)
        return resData
    }
    getRelationData = async () => {
        const reqData = {}
        reqData.fileter = 'view'
        reqData.page = 1
        reqData.limit = 6
        reqData.category_id = this._categoryId
        // console.log('rel req', reqData)
        const resData = await this._storeModel.getList(reqData)
        // console.log(resData)
        return resData
    }
    getUserWritePost = async (userIndex) => {
        const reqData = {}
        reqData.category_id = 5
        reqData.page = 1
        reqData.limit = 4
        reqData.type = 'unitary'
        reqData.user_id = userIndex

        const resData = await this._postModel.getPosts(reqData)
        // console.log(reqData, resData)
        return resData
    }
    serUserWritePost = async (postsData) => {
        const { is_next, post_count, posts } = postsData

        const imgWrap = this._view.getElement('#userWriteImgWrap')
        if (post_count == 0) {
            //게시글 없음
        } else {
            //게시글 존재
            posts.map((e) => {
                // console.log(e)
                const { thumbnail, post_id } = e

                if (post_id != this._postNo) {
                    const item = document.createElement('a')
                    item.href = `/workspace.html?n=${post_id}`
                    const img = document.createElement('img')
                    img.src = thumbnail
                    item.appendChild(img)

                    imgWrap.appendChild(item)
                }
            })
        }
    }
    setUserData = async (userData, userIndex) => {
        // console.log(userData, userIndex)
        // 탈퇴와 같은 이유로 유저 데이터 정상적으로 들어오지 않음
        if (userData.stats) {
            this._view.getElement('#nickname').innerHTML = '탈퇴한 회원'
            this._view.getElement('#profileImg').src = '../res/img/icon_default_img.png'
            if (this._type == typeWorkspace) {
                this._view.getElement('#followBtn').classList.add('hidden')
                this._view.getElement('#follows').innerHTML = 0
                this._view.getElement('#follower').innerHTML = 0
                this._view.getElement(`#userWriteImgWrap`).parentNode.classList.add('hidden')
            }
            return
        }
        // 유저 데이터 정상 들어옴
        const { profile_nickname, profile_image_url, profile_email, information, is_information_open, following, follower, following_id } = userData
        this._followingId = following_id
        this._view.getElement('#nickname').innerHTML = profile_nickname
        this._view.getElement('#profileImg').src = profile_image_url
        // 유저 클릭시 상세 페이지로 이동
        this._view.getElement('#nickname').addEventListener('click', () => {
            window.location.href = `/profile.html?n=${userIndex}`
        })
        this._view.getElement('#profileImg').addEventListener('click', () => {
            window.location.href = `/profile.html?n=${userIndex}`
        })

        if (this._type != typeWorkspace) return
        else {
            const followBtn = this._view.getElement('#followBtn')
            // 내 정보
            // console.log(userIndex, this._myInfo)
            if (userIndex == this._myInfo.user_id) {
                followBtn.classList.add('hidden')
            }
            // 느그 정보
            else {
                if (this._followingId != 0) {
                    followBtn.innerHTML = '팔로우 취소'
                    followBtn.style.backgroundColor = `rgb(50,50,50)`
                    followBtn.style.color = `white`
                } else {
                    followBtn.style.backgroundColor = `rgb(255,255,255)`
                    followBtn.style.color = `black`
                    followBtn.innerHTML = '팔로우'
                }
            }
            // 팔로우 기능 추가
            followBtn.addEventListener('click', async () => {
                if (this._isLogin) {
                    if (this._followingId != 0) {
                        // 팔로우 취소
                        await this._userModel.unfollow(this._followingId)
                        this.getUserInfo(userIndex).then((data) => this.setUserData(data, userIndex))
                    } else {
                        // 팔로우 등록
                        const resData = await this._userModel.follow(userIndex)
                        if (resData.follow_id) {
                            this._followingId = resData.follow_id
                            this.getUserInfo(userIndex).then((data) => this.setUserData(data, userIndex))
                        } else {
                            utils().snackbar('팔로우 등록에 실패 했습니다.')
                        }
                    }
                } else {
                    utils().snackbar('로그인이 필요한 기능입니다.')
                }
            })
        }
        if (is_information_open) {
            this._view.getElement('#writerInfo').innerHTML = information
        } else {
            this._view.getElement('#writerInfo').innerHTML = ''
        }

        this._view.getElement('#follows').innerHTML = following
        this._view.getElement('#follower').innerHTML = follower
    }

    setPostData = async (data) => {
        if (!data) return
        this._categoryId = data.category_id
        // console.log(data)
        // 내 글인지 판단
        const customBtn = this._view.getElement('#custom')
        if (data.user_id == this._myInfo.user_id) {
            customBtn.innerHTML = `수정하기`
            customBtn.onclick = () => this.modBtnClick(this._postNo)
            const deleteBtn = document.createElement('p')
            deleteBtn.innerHTML = '삭제하기'
            this._view.getElement('#customWrap').appendChild(deleteBtn)
            deleteBtn.onclick = () => this.postDel(this._postNo)
        } else {
            customBtn.onclick = () => this.reportBtnClick(1, this._postNo, data.content)
        }
        // 제목, 날짜, 조회수, 공유횟수 입력 , 좋아요, 북마크 개수
        const { post_id, title, date, view_count, share_count, liked, bookmark_id, bookmark_count, rating_id, thumbnail } = data
        this._postId = post_id

        this._view.getElement('#title').innerHTML = title
        this._view.getElement('#date').innerHTML = date
        this._view.getElement('#viewCount').innerHTML = view_count
        this._view.getElement('#sharedCount').innerHTML = share_count
        this._view.getElement('#liked').innerHTML = liked
        this._view.getElement('#bookmarked').innerHTML = bookmark_count
        // 북마크 했는지, 좋아요 했는지 판단
        if (bookmark_id != 0) {
            this._view.getElement('#bookmarkedImg').src = `../res/img/icon_bookmark.svg`
            this._isBookmarked = true
            this._bookmarkId = bookmark_id
        }
        if (rating_id != 0) {
            this._view.getElement('#likedImg').src = `../res/img/icon_like.svg`
            this._isLiked = true
            this._likedId = rating_id
        }

        // 워크스페이스 에서만 작동하는 썸네일 등록
        if (this._type == typeWorkspace) {
            const thumbView = this._view.getElement('#selectedImg')
            thumbView.src = thumbnail
            thumbView.alt = `개쇼 워크스페이스 이미지`
        }

        // 포스트 내용
        const { content } = data
        // 퀼 적용
        // 퀼 생성
        this._quill = new Quill('#content', {
            modules: {
                toolbar: false
            },
            theme: 'snow',
            height: '30rem',
            readOnly: true
        })
        // this._view.getElement('#content').innerHTML = content
        const contentView = this._view.getElement('.ql-editor')
        contentView.innerHTML = content
        // 태그
        const { tags } = data
        const tagsWrapper = this._view.getElement('#tagsWrapper')
        const imgView = this._view.getElement('#imgView')
        let classtype
        if (this._type == typeBoard) classtype = `red--bg`
        if (this._type == typeBadMouse) classtype = `yellow--bg`
        if (this._type == typeTip) classtype = `orange--bg`
        if (this._type == typeWorkspace) classtype = `gray--border`

        // 맵을 사용해서 통신을 진행해야해서 이런식으로 코드 진행.
        await Promise.all(
            tags.map((item) => {
                const temp = this._portfolioItem.createTagItem(item, classtype)
                tagsWrapper.appendChild(temp)
                //  워크스페이스 태그 작업
                if (this._type == typeWorkspace) {
                    // console.log(item)
                    let temp2
                    if (item.type == 'added') {
                        temp2 = this._portfolioItem.createWorkspaceViewPhotoItemTypeAdded(item)
                        imgView.appendChild(temp2[0])
                        temp.onmouseenter = () => {
                            temp2[1].classList.remove('hidden')
                        }
                        temp.onmouseleave = () => {
                            temp2[1].classList.add('hidden')
                        }
                    } else {
                        const { product_id } = item
                        this._storeModel.getProductDetailData(product_id).then((e) => {
                            // console.log(e)
                            temp2 = this._portfolioItem.createWorkspaceViewPhotoItemTypeExisting(item, e)
                            imgView.appendChild(temp2[0])
                            temp.onmouseenter = () => {
                                temp2[1].classList.remove('hidden')
                            }
                            temp.onmouseleave = () => {
                                temp2[1].classList.add('hidden')
                            }
                        })
                    }
                }

                return true
            })
        )
    }
    setCommentData = (data) => {
        if (!data) return
        // console.log(data)
        const commentListWrapper = this._view.getElement(`#commentList`)
        const { comment_count, comments, is_next } = data
        this._view.getElement('#commentCount').innerHTML = comment_count
        console.log('댓글 개수', comment_count)
        // 댓글 생성
        comments.map((item) => {
            // console.log('댓글', item)
            const { comment_id, content, date, experience_years, job_field, job_type, profile_nickname, profile_image_url, user_id, liked } = item
            const isMyComment = this._myInfo.user_id == user_id ? true : false
            let tempArr = []
            if (job_type) tempArr.push(job_type)
            if (job_field) tempArr.push(job_field)
            if (experience_years) tempArr.push(experience_years)

            let userInfo
            if (tempArr.length > 0) userInfo = `${tempArr.join(' / ')}`
            else userInfo = ``
            const commentItem = this._commentItem.createComment(content, date, profile_image_url, profile_nickname, userInfo, liked, comment_id, isMyComment, null, user_id)
            // console.log(commentItem)
            // 댓글 등록 버튼
            commentItem[1].onclick = () => this.createCommentDepthUi(commentItem)
            commentListWrapper.appendChild(commentItem[0])
            commentItem[4].style.height = `${commentItem[4].scrollHeight}px`
            commentItem[5].classList.add('hidden')
            // 좋아요 관리
            if (item.rating_id != 0 && item.rating_id) {
                this._commentLikedArr[`${item.comment_id}`] = item.rating_id
                commentItem[2].src = `../res/img/icon_like.svg`
            }
            commentItem[2].parentNode.onclick = () => this.likeBtnClickComment(this._commentLikedArr[`${comment_id}`], comment_id, commentItem[2])
            // 수정 삭제 관리
            if (user_id == this._myInfo.user_id && this._myInfo.user_id) {
                const delBtn = this._view.getElement('.del', commentItem[0])
                const modBtn = this._view.getElement('.mod', commentItem[0])

                if (delBtn) delBtn.onclick = () => this.commentDeleteClick(comment_id, commentItem[0])
                if (modBtn) modBtn.onclick = () => this.commentModClick(comment_id, commentItem[0])
            } else {
                // 삭제된 댓글 대비
                if (commentItem[3]) {
                    commentItem[3].onclick = () => this.reportBtnClick(2, comment_id, null)
                }
            }
            // 대 댓글
            const parentIdx = comment_id
            const { comments } = item
            if (comments) {
                comments.map((items) => {
                    // console.log('대댓글', items)
                    const { comment_id, content, date, experience_years, job_field, job_type, profile_nickname, profile_image_url, user_id, liked } = items
                    const isMyComment = this._myInfo.user_id == user_id ? true : false
                    // 인포 정보 파싱
                    let tempArr = []
                    if (job_type) tempArr.push(job_type)
                    if (job_field) tempArr.push(job_field)
                    if (experience_years) tempArr.push(experience_years)

                    let userInfo
                    if (tempArr.length > 0) userInfo = `${tempArr.join(' / ')}`
                    else userInfo = ``
                    const commentItem = this._commentItem.createCommentDepth(content, date, profile_image_url, profile_nickname, userInfo, liked, parentIdx, comment_id, isMyComment, user_id)
                    // 등록하기 버튼
                    commentItem[1].onclick = () => this.createCommentDepthUi(commentItem)
                    commentListWrapper.appendChild(commentItem[0])
                    commentItem[4].style.height = `${commentItem[4].scrollHeight}px`
                    commentItem[5].classList.add('hidden')
                    // 좋아요 관리
                    if (items.rating_id != 0 && items.rating_id) {
                        // console.log('대댓글 rating', items.rating_id, items.comment_id)
                        this._commentLikedArr[`${items.comment_id}`] = items.rating_id
                        commentItem[2].src = `../res/img/icon_like.svg`
                    }
                    commentItem[2].parentNode.onclick = () => this.likeBtnClickComment(this._commentLikedArr[`${comment_id}`], comment_id, commentItem[2])
                    // 수정 삭제 관리
                    if (user_id == this._myInfo.user_id) {
                        const delBtn = this._view.getElement('.del', commentItem[0])
                        const modBtn = this._view.getElement('.mod', commentItem[0])

                        delBtn.onclick = () => this.commentDeleteClick(comment_id, commentItem[0])
                        modBtn.onclick = () => this.commentModClick(comment_id, commentItem[0])
                    } else {
                        commentItem[3].onclick = () => this.reportBtnClick(2, comment_id, null)
                    }
                })
            }
        })
    }
    // 댓글 추가 (0뎁스 댓글)
    addComment = async () => {
        if (!this._isLogin) {
            utils().snackbar('로그인이 필요한 서비스입니다.')
            return
        }

        const content = this._view.getElement('#addCommentContent').value
        if (!content) {
            utils().snackbar('댓글을 입력해주세요.')
            return
        }

        const resData = await this._commentModel.addComment(content)
        // console.log(resData)
        // 댓글 클라에서 추가 해 줘야함
        if (resData.comment_id) {
            const { experience_years, job_field, job_type, profile_nickname, profile_image_url, user_id } = this._myInfo
            let tempArr = []
            if (job_type) tempArr.push(job_type)
            if (job_field) tempArr.push(job_field)
            if (experience_years) tempArr.push(`${experience_years}년차`)

            let userInfo
            if (tempArr.length > 0) userInfo = `${tempArr.join(' / ')}`
            else userInfo = ``
            const commentItem = this._commentItem.createComment(content, '방금전', profile_image_url, profile_nickname, userInfo, 0, resData.comment_id, true)
            commentItem[1].onclick = () => this.createCommentDepthUi(commentItem)
            this._view.getElement(`#commentList`).appendChild(commentItem[0])
            this._view.getElement('#addCommentContent').value = ``
            commentItem[4].style.height = `${commentItem[4].scrollHeight}px`
            commentItem[5].classList.add('hidden')

            commentItem[2].parentNode.onclick = () => this.likeBtnClickComment(this._commentLikedArr[`${resData.comment_id}`], resData.comment_id, commentItem[2])
            // 수정 삭제 관리
            const delBtn = this._view.getElement('.del', commentItem[0])
            const modBtn = this._view.getElement('.mod', commentItem[0])

            delBtn.onclick = () => this.commentDeleteClick(resData.comment_id, commentItem[0])
            modBtn.onclick = () => this.commentModClick(resData.comment_id, commentItem[0])

            this._view.getElement('#commentCount').innerHTML = `${parseInt(this._view.getElement('#commentCount').innerHTML) + 1}`
        }
    }

    // 대댓글 추가 ui 생성
    createCommentDepthUi = async (element) => {
        const parent = element[0]
        const btn = element[1]
        const nowClickedIdx = element[0].getAttribute('idx')
        // 동일한 버튼 클릭시 댓글 닫기
        if (this._isDepthTwoCommentIdx == nowClickedIdx && this._isDepthTwoCommentOpen) {
            btn.innerHTML = `댓글달기`
            // 대 댓글 등록 ui 삭제
            this._isDepthTwoCommentElement.parentNode.removeChild(this._isDepthTwoCommentElement)
            // 초기화 작업
            this._isDepthTwoCommentOpen = false
            this._isDepthTwoCommentIdx = null

            return
        }
        // 이미 다른 댓글 달기가 열려 있을 경우 지워주고 새로운 것 오픈
        if (this._isDepthTwoCommentOpen) {
            // 등록된 idx로 엘레먼트 찾기
            const preCommentUi = this._view.getElement(`[idx="${this._isDepthTwoCommentIdx}"]`)
            // 버튼 찾기
            const preBtn = this._view.getElement(`#commentAdd`, preCommentUi)
            preBtn.innerHTML = '댓글달기'
            this._isDepthTwoCommentElement.parentNode.removeChild(this._isDepthTwoCommentElement)
            // 초기화 작업
            this._isDepthTwoCommentOpen = false
            this._isDepthTwoCommentIdx = null
        }

        btn.innerHTML = `댓글닫기`

        const createUi = this._commentItem.createAddComment()

        const next = parent.nextSibling

        if (next) {
            parent.parentNode.insertBefore(createUi[0], next)
        } else {
            parent.parentNode.appendChild(createUi[0])
        }

        // 등록 이벤트 추가
        createUi[1].onclick = () => this.addCommentDepth(parent.getAttribute('idx'), createUi[2].value, parent, createUi[0])

        this._isDepthTwoCommentOpen = true
        this._isDepthTwoCommentElement = createUi[0]
        this._isDepthTwoCommentIdx = parent.getAttribute('idx')
    }

    addCommentDepth = async (idx, content, parent, addView) => {
        if (!this._isLogin) {
            utils().snackbar('로그인이 필요한 서비스입니다.')
            return
        }
        if (!content) {
            utils().snackbar('댓글을 입력해주세요.')
            return
        }

        const resData = await this._commentModel.addCommentDepth(idx, content)
        // 댓글 클라에서 추가 해 줘야함
        // console.log(resData)
        if (resData.comment_id) {
            const { experience_years, job_field, job_type, profile_nickname, profile_image_url, user_id } = this._myInfo
            // 인포 정보 파싱
            let tempArr = []
            if (job_type) tempArr.push(job_type)
            if (job_field) tempArr.push(job_field)
            if (experience_years) tempArr.push(`${experience_years}년차`)

            let userInfo
            if (tempArr.length > 0) userInfo = `${tempArr.join(' / ')}`
            else userInfo = ``
            const commentItem = this._commentItem.createCommentDepth(content, `방금전`, profile_image_url, profile_nickname, userInfo, 0, idx, resData.comment_id, true)

            // 등록하기 버튼
            commentItem[1].onclick = () => this.createCommentDepthUi(commentItem)

            commentItem[2].parentNode.onclick = () => this.likeBtnClickComment(this._commentLikedArr[`${resData.comment_id}`], resData.comment_id, commentItem[2])
            // 수정 삭제 관리
            const delBtn = this._view.getElement('.del', commentItem[0])
            const modBtn = this._view.getElement('.mod', commentItem[0])

            delBtn.onclick = () => this.commentDeleteClick(resData.comment_id, commentItem[0])
            modBtn.onclick = () => this.commentModClick(resData.comment_id, commentItem[0])

            const next = parent.nextSibling
            if (next) {
                parent.parentNode.insertBefore(commentItem[0], next)
            } else {
                parent.parentNode.appendChild(commentItem[0])
            }
            commentItem[4].style.height = `${commentItem[4].scrollHeight}px`
            commentItem[5].classList.add('hidden')

            addView.parentNode.removeChild(addView)

            // 등록 성공
            this._isDepthTwoCommentOpen = false
            const preBtn = this._view.getElement(`#commentAdd`, parent)
            preBtn.innerHTML = '댓글달기'

            this._view.getElement('#commentCount').innerHTML = `${parseInt(this._view.getElement('#commentCount').innerHTML) + 1}`
        }
    }

    likeBtnClick = async () => {
        if (!this._isLogin) {
            utils().snackbar('로그인이 필요한 서비스입니다.')
            return
        }
        const reqData = {}
        reqData.rating = 1
        reqData.type = 'post'
        reqData.unique_id = this._postNo
        const likeImg = this._view.getElement('#likedImg')
        const likeCount = this._view.getElement('#liked')
        if (!this._isLiked) {
            const resData = await this._evalModel.putLike(reqData)
            if (resData.rating_id) {
                this._isLiked = true
                this._likedId = resData.rating_id
                likeImg.src = '../res/img/icon_like.svg'
                likeCount.innerHTML = parseInt(likeCount.innerHTML) + 1
            }
        } else {
            const resData = await this._evalModel.delLike(this._likedId)
            if (resData) {
                this._isLiked = false
                this._likedId = null
                likeImg.src = '../res/img/icon_like_df.svg'
                likeCount.innerHTML = parseInt(likeCount.innerHTML) - 1
            }
        }
    }
    likeBtnClickComment = async (isLike, commentIdx, imgElement) => {
        if (!this._isLogin) {
            utils().snackbar('로그인이 필요한 서비스입니다.')
            return
        }
        const reqData = {}
        reqData.rating = 1
        reqData.type = 'comment'
        reqData.unique_id = commentIdx

        const commentTextElement = this._view.getElementsByTagName('figcaption', imgElement.parentNode)[0]

        if (!isLike) {
            // 좋아요
            const resData = await this._evalModel.putLike(reqData)
            if (resData.rating_id) {
                imgElement.src = '../res/img/icon_like.svg'
                commentTextElement.innerHTML = parseInt(commentTextElement.innerHTML) + 1
                this._commentLikedArr[`${commentIdx}`] = resData.rating_id
            }
        } else {
            // 좋아요 취소
            const resData = await this._evalModel.delLike(this._commentLikedArr[`${commentIdx}`])
            if (resData) {
                imgElement.src = '../res/img/icon_like_df.svg'
                commentTextElement.innerHTML = parseInt(commentTextElement.innerHTML) - 1
                delete this._commentLikedArr[`${commentIdx}`]
            }
        }
    }
    commentDeleteClick = async (commentIdx, wrapper) => {
        const check = confirm('댓글을 삭제하시겠습니까?')
        if (check) {
            const resData = await this._commentModel.delComment(commentIdx)
            if (resData.stats == 'ok') {
                // 삭제 성공
                // 삭제된 데이터로 아이템 바꿔주기
                const fig = this._view.getElement('.comment__list--user--info', wrapper)
                while (fig.hasChildNodes()) {
                    fig.removeChild(fig.firstChild)
                }
                const date = this._view.getElement('.comment__list--date', wrapper)
                date.parentNode.removeChild(date)

                const content = this._view.getElement('.comment__list--content', wrapper)
                content.value = `삭제된 댓글입니다.`

                const postWrap = this._view.getElement('.comment__list--user--post', wrapper)
                this._view.getElementsByTagName('figure', postWrap)[0].classList.add('hidden')

                //삭제 수정 버튼 없에기
                const del = this._view.getElement('.del', wrapper)
                const mod = this._view.getElement('.mod', wrapper)
                del.classList.add('hidden')
                mod.classList.add('hidden')
            }
        }
    }
    commentModClick = async (commentIdx, wrapper) => {
        // 댓글 수정
        // 수정 클릭시 textarea readonlt 속성 없에기
        let textarea = this._view.getElementsByTagName('textarea', wrapper)[0]
        // 수정 삭제 버튼
        const modDelBtn = this._commentItem.createModUi()
        // 원본 텍스트
        const oriText = textarea.value

        const autoResize = (obj) => {
            obj.style.height = '1px'
            obj.style.height = 12 + obj.scrollHeight + 'px'
        }

        const cancle = () => {
            // 댓글 수정 취소
            // 수정 취소 버튼 삭제
            modDelBtn[0].parentNode.removeChild(modDelBtn[0])
            // text readonly
            textarea.setAttribute('readonly', 'readonly')
            // 스타일 변경
            textarea.value = oriText
            textarea.style.border = 'none'
        }
        const modify = async (idx) => {
            // 수정 시작
            const resData = await this._commentModel.modComment(idx, textarea.value)
            // console.log(resData)
            if (resData.stats == 'ok') {
                modDelBtn[0].parentNode.removeChild(modDelBtn[0])
                // text readonly
                textarea.setAttribute('readonly', 'readonly')
                // 스타일 변경
                textarea.style.border = 'none'
            }
        }
        // 수정 가능하도록 readonly 속성 제거
        if (textarea) {
            textarea.removeAttribute('readonly')
            // 텍스트 아레아 포커싱
            textarea.focus()
            // 리사이즈
            textarea.onkeyup = () => autoResize(textarea)
            // 본 js를 다양한 html에서 쓰기 때문에 여기에서 css 속성값을 변경
            textarea.style.border = '1px solid gray'
            // 수정 삭제 버튼 넣어주기
            modDelBtn[0].style.display = 'flex'
            modDelBtn[0].style.justifyContent = 'flex-end'
            modDelBtn[1].style.backgroundColor = 'rgba(255, 107, 97,0.7)'
            modDelBtn[1].style.color = 'white'
            modDelBtn[2].style.backgroundColor = 'rgb(0, 77, 153,0.7)'
            modDelBtn[2].style.color = 'white'
            console.log(wrapper)
            textarea.parentNode.appendChild(modDelBtn[0])
            // if (textarea.nextSibling) wrapper.insertBefore(modDelBtn[0], textarea.nextSibling)
            // else textarea.parentNode.appendChild(modDelBtn[0])

            // 클릭 이벤트 달아주기
            modDelBtn[1].onclick = () => cancle()
            modDelBtn[2].onclick = () => modify(commentIdx)
        }
    }
    bookmarkBtnClick = async () => {
        if (!this._isLogin) {
            utils().snackbar('로그인이 필요한 서비스입니다.')
            return
        }
        const bookmarkImg = this._view.getElement('#bookmarkedImg')
        const bookmarkCount = this._view.getElement('#bookmarked')
        if (!this._isBookmarked) {
            const resData = await this._evalModel.putBookmark('post', this._postNo)
            if (resData.bookmark_id) {
                this._bookmarkId = resData.bookmark_id
                this._isBookmarked = true
                bookmarkImg.src = '../res/img/icon_bookmark.svg'
                bookmarkCount.innerHTML = parseInt(bookmarkCount.innerHTML) + 1
            }
        } else {
            const resData = await this._evalModel.delBookmark(this._bookmarkId)
            if (resData) {
                this._bookmarkId = null
                this._isBookmarked = false
                bookmarkImg.src = '../res/img/icon_bookmark_df.svg'
                bookmarkCount.innerHTML = parseInt(bookmarkCount.innerHTML) - 1
            }
        }
    }

    modBtnClick = async (idx) => {
        if (this._type == typePortfolio) window.location.href = `/portfolio__write.html?p=${idx}`
        if (this._type == typeBoard) window.location.href = `/board__write.html?p=${idx}`
        if (this._type == typeBadMouse) window.location.href = `/badmouse__write.html?p=${idx}`
        if (this._type == typeTip) window.location.href = `/tips__write.html?p=${idx}`
        if (this._type == typeWorkspace) window.location.href = `/workspace__write.html?p=${idx}`
    }
    postDel = async (idx) => {
        const dialog = window.confirm(`정말로 삭제하시겠습니까?`)
        if (dialog) {
            const resData = await this._postModel.delPost(idx)
            if (resData.stats == 'ok') {
                if (this._type == typePortfolio) window.location.href = `/portfolio.html`
                if (this._type == typeBoard) window.location.href = `/board.html`
                if (this._type == typeBadMouse) window.location.href = `/badmouse.html`
                if (this._type == typeTip) window.location.href = `/tips.html`
                if (this._type == typeWorkspace) window.location.href = `/workspaces.html`
            } else {
                utils().snackbar('게시물 삭제를 실패 하였습니다. 잠시 뒤 다시 시도해 주세요')
            }
        }
    }

    reportBtnClick = (type, postId, content) => {
        if (!this._isLogin) {
            utils().snackbar('로그인이 필요한 서비스 입니다.')
            return
        }
        const modal = this._report.createReportView()
        document.body.appendChild(modal[0])

        // 취소 클릭
        modal[4].onclick = () => {
            document.body.removeChild(modal[0])
        }
        // 신고 보내기 클릭
        modal[3].onclick = async () => {
            if (modal[1].value == 0) {
                utils().snackbar('신고 사유를 선택해주세요')
                return
            }

            const reqData = {}
            reqData.category_id = 4
            reqData.type = type
            reqData.reason = parseInt(modal[1].value)
            reqData.content = modal[2].value ? modal[2].value : '신고 상세 내용 미작성'
            reqData.unique_id = postId
            console.log(reqData)
            const resData = await this._serviceModel.putReport(reqData)
            if (!resData) {
                utils().snackbar('신고하기 실패<br />잠시 뒤 다시 시도해주세요')
                return
            } else {
                utils().snackbar('신고가 접수 되었습니다.<br />처리까지는 최대 1~3일까지 걸릴 수 있습니다.')
                document.body.removeChild(modal[0])
            }
        }
    }

    sharedBtnClick = () => {
        const url = utils().copyUrl()
        this._shareModel.addShare(this._isLogin, this._postNo, 'post')
        utils().snackbar(`${url}이 복사되었습니다.`)
    }
}
