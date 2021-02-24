import categoryModel from '../Model/categoryModel.js'
import storeModel from '../Model/storeModel.js'
import storeItem from '../View/storeItem.js'
import utils from '../Core/Singleton/utils.js'
import View from '../Core/Mvc/View.js'
import pagination from '../View/pagination.js'
import Singleton from '../Core/Singleton/Singleton.js'
import evaluationModel from '../Model/evaluationModel.js'
import comment from '../View/comment.js'
import report from '../View/report.js'
import serviceModel from '../Model/serviceCenterModel.js'
import shareModel from '../Model/shareModel.js'

export default class productController {
    constructor(myInfo) {
        this._myInfo = myInfo
        this._pageIdx = utils().getParameterByName('i') ? utils().getParameterByName('i') : -1

        if (this._pageIdx == -1) {
            // 아이템 존재하지 않음
        }

        this._view = new View()
        this._storeModel = new storeModel()
        this._storeItem = new storeItem()
        this._cateModel = new categoryModel()
        this._singleTon = new Singleton()
        this._evaluationModel = new evaluationModel()
        this._commentItem = new comment()
        this._report = new report()
        this._serviceModel = new serviceModel()
        this._shareModel = new shareModel()
        // 댓글 목록
        this._typeExpect = 'expectation_of_product'
        this._expectPage = 1
        this._expectLimit = 4
        this._expectCommentAddRating = -1

        this._typeComment = 'comment_of_product'
        this._commentPage = 1
        this._commentLimit = 5
        this._commentAddRating = -1
        this._commentTags = []
        this._commentAttaches = []
        this._commentStarList = []

        this._typeQna = 'qna_of_product'
        this._qnaPage = 1
        this._qnaLimit = 5

        // 상품 정보
        this._titleImg
        this._productName
        this._productPrice
        this._selectdLargeImgIndex

        // 스크롤 디텍터에서 사용하는 각 페이지를 최초 로드 했는지
        this._isReviewLoad = false
        this._QnaLoad = false

        this._reviewLoadPosition = this._view.getElement('#contentWrap').offsetTop - this._view.getElement('#contentWrap').offsetHeight / 0.8
        this._QnaLoadPosition = this._view.getElement('#reviewWrap').offsetTop - this._view.getElement('#reviewWrap').offsetHeight / 0.7

        this._categoryWrap = this._view.getElement('#categoryWrap')
        this._categoryWrapOriWidth = this._categoryWrap.offsetWidth
        this._categoryWrapOriTop = this._categoryWrap.offsetTop
        this.lifeCycle()
    }

    lifeCycle = async () => {
        Promise.all([this.getCategory(), this.getPageData()]).then((e) => {
            // console.log(e[1])
            utils().setSEO(`${e[1].name} - GAESHOW`, `${e[1].brand_name},${e[1].name}`, `${e[1].name}에 대한 사용자들의 기대평과 실 사용 후기를 확인하세요!`, e[1].product_images.url)
            this.setPageData(e)
            this.saveRecentProduct(e[1])
        })
        this.getExpectCommentData().then((e) => this.setExpectationCommentData(e))
        this.getDataLap().then((e) => this.setDataLap(e))
        window.addEventListener('scroll', () => this.scrollDetector())

        // 내부 카테고리 클릭 이벤트
        const exBtn = this._view.getElement('#explainBtn')
        const reviewBtn = this._view.getElement('#reviewBtn')
        const qnaBtn = this._view.getElement('#qnaBtn')
        const together = this._view.getElement('#togetherBtn')

        const categoryBtnList = [exBtn, reviewBtn, qnaBtn, together]
        exBtn.onclick = () => this.categoryFocus(categoryBtnList, exBtn)
        reviewBtn.onclick = () => this.categoryFocus(categoryBtnList, reviewBtn)
        qnaBtn.onclick = () => this.categoryFocus(categoryBtnList, qnaBtn)
        together.onclick = () => this.categoryFocus(categoryBtnList, together)

        this._view.getElement('#shareBtn').onclick = () => this.sharedBtnClick()
        if (this._myInfo) {
            this._view.getElement('#expectAddBtn').onclick = () => this.expectCommentAddClick(this._typeExpect)
            this._view.getElement('#qnaAddBtn').onclick = () => this.expectCommentAddClick(this._typeQna)
        } else {
            this._view.getElement('#expectAddBtn').onclick = () => {
                utils().snackbar('로그인이 필요한 서비스 입니다.')
            }
            this._view.getElement('#qnaAddBtn').onclick = () => {
                utils().snackbar('로그인이 필요한 서비스 입니다.')
            }
        }

        // 댓글 글자수 제한
        const commentTextArea = this._view.getElement('#commentTextArea')
        commentTextArea.addEventListener('keydown', () => {
            if (commentTextArea.value.length >= 499) {
                utils().snackbar('댓글은 500글자까지 작성 할 수 있습니다.')
                commentTextArea.value = commentTextArea.value.substring(0, 499)
            }
        })
    }
    categoryFocus = (list, e) => {
        let focusIndex = -1
        list.map((element, i) => {
            if (element == e) focusIndex = i
            element.classList.remove('focus')
        })
        list[focusIndex].classList.add('focus')
        switch (focusIndex) {
            case 0:
                utils().moveTo(this._view.getElement('#contentHeader'))
                break
            case 1:
                utils().moveTo(this._view.getElement('#reviewHeader'))
                break
            case 2:
                utils().moveTo(this._view.getElement('#qnaHeader'))
                break
            case 3:
                utils().moveTo(this._view.getElement('#togetherHeader'))
                break
            default:
                break
        }
    }
    scrollDetector = async () => {
        const scrollTop = document.documentElement.scrollTop
        if (this._reviewLoadPosition < scrollTop && !this._isReviewLoad) {
            this._isReviewLoad = true
            this.setReviewAddEvent()
            this.getReviews()
                .then((e) => this.setExpectationData(e))
                .then((e) => this.getReviewsComment().then((e) => this.setReviewCommentData(e)))
        }
        if (this._QnaLoadPosition < scrollTop && !this._QnaLoad) {
            this._QnaLoad = true
            // 서버 댓글 주면 작업 해야함
            this.getQnaComment().then((e) => this.setQnaCommentData(e))
        }
        // 상단 카테고리 메뉴 고정하기
        if (scrollTop > this._categoryWrapOriTop) {
            this._categoryWrap.className = 'large__header--fixed'
            this._categoryWrap.style.width = `${this._categoryWrapOriWidth}px`
        } else {
            this._categoryWrap.className = 'large__header'
        }

        // console.log(scrollTop, this._reviewCommentLoadPosition)
    }
    saveRecentProduct = (e) => {
        const { category_id, product_id, name, price } = e
        let oriList = []
        const saveData = {}
        saveData.category_id = category_id
        saveData.product_id = product_id
        saveData.price = price
        saveData.name = name
        let image
        e.product_images.filter((e) => {
            if (e.type == 'thumbnail') image = e.url
        })

        saveData.image_url = image

        const getRecentItems = this._singleTon.getCookie('recent')
        if (!getRecentItems) {
            oriList.push(saveData)
            this._singleTon.setCookie('recent', JSON.stringify(oriList), 7)
        } else {
            oriList = JSON.parse(getRecentItems)
            const findIndex = oriList.findIndex((e) => {
                return e.product_id == saveData.product_id
            })
            if (findIndex < 0) oriList.push(saveData)
            else {
                oriList.splice(findIndex, 1)
                oriList.push(saveData)
            }
            this._singleTon.deleteCookie('recent')
            this._singleTon.setCookie('recent', JSON.stringify(oriList), 7)
        }
    }
    getCategory = async () => {
        const reqData = { type: 'store' }

        const resData = await this._cateModel.getStore(reqData)
        return resData
    }
    getPageData = async () => {
        const resData = await this._storeModel.getProductDetailData(this._pageIdx)
        return resData
    }
    getReviews = async () => {
        const resData = await this._storeModel.getReviewData(this._pageIdx)
        return resData
    }
    getExpectCommentData = async () => {
        const reqData = {}
        reqData.type = this._typeExpect
        reqData.page = this._expectPage
        reqData.limit = this._expectLimit
        const resData = await this._storeModel.getCommentData(reqData, this._pageIdx, this._myInfo)
        return resData
    }
    getReviewsComment = async () => {
        const reqData = {}
        reqData.type = this._typeComment
        reqData.page = this._commentPage
        reqData.limit = this._commentLimit
        const resData = await this._storeModel.getCommentData(reqData, this._pageIdx, this._myInfo)
        return resData
    }
    getQnaComment = async () => {
        const reqData = {}
        reqData.type = this._typeQna
        reqData.page = this._qnaPage
        reqData.limit = this._qnaLimit
        const resData = await this._storeModel.getCommentData(reqData, this._pageIdx, this._myInfo)
        // console.log(resData)
        return resData
    }
    getDataLap = async () => {
        const resData = await this._storeModel.getDataLap(this._pageIdx)
        return resData
    }
    setPageData = (data) => {
        // console.log(data)
        this._cateArr = data[0]
        const { product_id, category_id, name, brand_name, content, share_count, release_date, product_images, view_count, average_score, expectation_count, price, qna_count, review_count } = data[1]

        // console.log(product_images)
        // 카테고리 정보 파싱
        this._cateArr.map((e) => {
            if (e.id == category_id) {
                this._view.getElement('#categoryName').innerHTML = `${e.name}`
                return
            }
        })

        // 상품 정보 파싱
        const titleImg = this._view.getElement('#titleImg')
        const naviImgWrap = this._view.getElement('#naviImgWrap')
        const titleName = this._view.getElement('#titleName')
        const viewCount = this._view.getElement('#viewCount')
        const priceWrap = this._view.getElement('#price')
        const sharedCount = this._view.getElement('#sharedCount')
        const qnaCount = this._view.getElement('#qnaCount')
        const averageScore = this._view.getElement('#averageScore')
        const reviewCount = this._view.getElement('#reviewCount')
        const exAver = this._view.getElement('#exAver')
        const contentTextarea = this._view.getElement('#content')

        // 이미지 데이터 파싱
        const bigImaArr = product_images.filter((e) => e.type == 'top_view')
        const smallImaArr = product_images.filter((e) => e.type == 'navi_view')

        if (bigImaArr[0]) {
            titleImg.src = bigImaArr[0].url
            titleImg.alt = `개쇼 ${name}`
        } else {
            titleImg.src = `../res/img/icon_default_img.png`
        }

        // 네비 이미지들 파싱
        smallImaArr.map((e, i) => {
            const tempImg = document.createElement('img')
            tempImg.src = e.url
            tempImg.alt = `개쇼 ${name}`
            tempImg.onmouseover = () => (titleImg.src = bigImaArr[i].url)
            naviImgWrap.appendChild(tempImg)
        })

        titleName.innerHTML = name
        viewCount.innerHTML = view_count
        contentTextarea.value = content
        priceWrap.innerHTML = `₩ ${price ? price : 0}`
        sharedCount.innerHTML = share_count
        qnaCount.innerHTML = qna_count ? qna_count : 0
        averageScore.innerHTML = average_score ? average_score : 0.0
        reviewCount.innerHTML = review_count ? review_count : 0
        exAver.innerHTML = expectation_count ? expectation_count : 0

        // 댓글 등록시 필요한 정보 파싱
        this._productName = name
        this._productPrice = price
        if (smallImaArr[0]) {
            this._titleImg = smallImaArr[0].url
        } else {
            this._titleImg = `../res/img/icon_default_img.png`
        }
    }
    setExpectationData = (data) => {
        console.log(`expectation`, data)
        const { all_average_score, average_score_ratio, compare, expectation_average_score } = data

        const expactationCount = this._view.getElement('#expectationCount')
        const averageScoreCount = this._view.getElement('#averageScoreCount')
        const expactationRate = this._view.getElement('#expectationRate')
        const averageScoreRate = this._view.getElement('#averageScoreRate')
        const compareWrap = this._view.getElement('#compareWrap')

        expactationCount.innerHTML = `(${expectation_average_score.count}개)`
        averageScoreCount.innerHTML = `(${all_average_score.count}개)`
        expactationRate.innerHTML = expectation_average_score.average_score ? expectation_average_score.average_score : `0.0`
        averageScoreRate.innerHTML = all_average_score.average_score ? all_average_score.average_score : `0.0`

        // 별칠하기
        const exStarWrap = this._view.getElement('#exStarWrap')
        const reviewStarWrap = this._view.getElement('#reviewStarWrap')
        for (let i = 0; i < 5; i++) {
            const star = document.createElement('p')
            if (i < expectation_average_score.average_score) {
                star.innerHTML = '★'
                star.classList.add('pink')
            } else {
                star.innerHTML = '☆'
            }
            exStarWrap.appendChild(star)

            const star2 = document.createElement('p')
            if (i < all_average_score.average_score) {
                star2.innerHTML = '★'
                star2.classList.add('yellow--light')
            } else {
                star2.innerHTML = '☆'
            }
            reviewStarWrap.appendChild(star2)
        }

        const compareItem = this._storeItem.createCompareItem(compare)
        compareWrap.appendChild(compareItem)
        //평점 비율
        if (average_score_ratio.length > 0) {
            average_score_ratio.map((e) => {
                const parentEle = this._view.getElement(`#avg${e.average_score}`)
                const percentWrap = this._view.getElement('#avgPercent', parentEle)
                const fillWrap = this._view.getElement('.fill', parentEle)

                percentWrap.innerHTML = `${parseInt(e.rate)}%`
                fillWrap.style.width = `${parseInt(e.rate)}%`
            })
        }
    }
    setExpectationCommentData = (data) => {
        if (!data) return
        const { comment_count, is_next, comments } = data
        // console.log('expect', data)
        const expectWrap = this._view.getElement('#expectWrap')
        while (expectWrap.hasChildNodes()) {
            expectWrap.removeChild(expectWrap.firstChild)
        }

        if (comment_count == 0) {
            for (let i = 0; i < 5; i++) {
                const item = this._storeItem.createEmptyExpectItem()
                expectWrap.appendChild(item)
            }
            const top = this._storeItem.createEmptyExpectItemTop()
            expectWrap.appendChild(top)
        } else {
            // console.log(comments)
            comments.map((e) => {
                let isMyComment
                if (this._myInfo) isMyComment = this._myInfo['user_id'] == e['user_id'] ? true : false
                else isMyComment = false

                const item = this._storeItem.createExpectItem(e, isMyComment)
                let isOpen = false
                expectWrap.appendChild(item[0])
                if (item[4].getBoundingClientRect().height > 41) {
                    item[4].classList.add('ellipsis')
                    console.log(item[4])
                    item[5].onclick = () => {
                        if (!isOpen) {
                            item[4].classList.remove('ellipsis')
                            isOpen = true
                            item[5].innerHTML = `접기`
                        } else {
                            item[4].classList.add('ellipsis')
                            isOpen = false
                            item[5].innerHTML = `더보기`
                        }
                    }
                } else {
                    item[5].classList.add('hidden')
                }
                // 내 글일경우 수정 삭제
                if (isMyComment) {
                    item[1].onclick = () => this.expectCommentAddClick(this._typeExpect, 'edit', e)
                    item[2].onclick = () => this.commentDel(this._typeExpect, e.id)
                } else {
                    // 내글이 아닐경우 신고
                    item[3].onclick = () => this.reportBtnClick(7, e.id)
                }
            })

            this.setPagination(this._typeExpect, comment_count, this._expectPage, this._expectLimit, 5)
        }
    }
    setReviewCommentData = (data) => {
        const { comment_count, is_next, comments } = data
        console.log('review', data)
        const reviewWrap = this._view.getElement('#reviewWrap')
        while (reviewWrap.hasChildNodes()) {
            reviewWrap.removeChild(reviewWrap.firstChild)
        }

        if (comment_count == 0) {
            // 빈값 일때에는 아무것도 표시하지 않는다
            this._view.getElement('#reviewPagination').classList.add('hidden')
        } else {
            // 데이터
            comments.map((itemData) => {
                // console.log(itemData)
                let isMy = false
                if (this._myInfo) {
                    if (this._myInfo.user_id == itemData.user_id) isMy = true
                }
                const item = this._storeItem.createReviewItem(isMy, itemData)
                reviewWrap.appendChild(item[0])
                // 댓글 길이 제한
                if (item[10].getBoundingClientRect().height > 90) {
                    item[10].classList.add('ellipsis')
                    let isOpen = false
                    item[9].onclick = () => {
                        if (!isOpen) {
                            item[10].classList.remove('ellipsis')
                            isOpen = !isOpen
                            item[9].innerHTML = `접기`
                        } else {
                            item[10].classList.add('ellipsis')
                            isOpen = !isOpen
                            item[9].innerHTML = `더보기`
                        }
                    }
                } else {
                    item[9].classList.add('hidden')
                }
                if (item[11].getBoundingClientRect().height > 90) {
                    item[11].classList.add('ellipsis')
                    let isOpen = false
                    item[12].onclick = () => {
                        if (!isOpen) {
                            item[11].classList.remove('ellipsis')
                            isOpen = !isOpen
                            item[12].innerHTML = `접기`
                        } else {
                            item[11].classList.add('ellipsis')
                            isOpen = !isOpen
                            item[12].innerHTML = `더보기`
                        }
                    }
                } else {
                    item[12].classList.add('hidden')
                }

                // 구매전 기대평 길이 제한
                // console.log(itemData)
                // 내가 좋아요 클릭한거 수정

                if (itemData.rating_id && itemData.rating_id != 0) {
                    item[7].parentNode.setAttribute('idx', itemData.rating_id)
                } else {
                    item[7].parentNode.setAttribute('idx', 0)
                }
                // 좋아요
                item[6].onclick = () => this.commnetLike(itemData.id, null, item[7], item[8])
                // 수정 삭제
                if (isMy) {
                    //수정
                    item[3].onclick = () => this.reviewCommentMod(itemData)
                    // 삭제
                    item[4].onclick = () => this.commentDel(this._typeComment, itemData.id)
                } else {
                    item[5].onclick = () => this.reportBtnClick(7, itemData.id)
                }

                // 이미지 클릭할 떄 큰 화면으로 보는 처리 진행
                const imageItems = this._view.getElementsByTagName('img', item[1])

                for (let i = 0; i < imageItems.length; i++) {
                    const imgDiv = imageItems[i]
                    imgDiv.onclick = () => this.viewLargeImg(i, item[2])
                }
            })

            // 페이지네이션
            if (comment_count > this._commentLimit) {
                this.setPagination(this._typeComment, comment_count, this._commentPage, this._commentLimit, 10)
            }
        }
    }
    setQnaCommentData = (data) => {
        const { comment_count, is_next, comments } = data
        // console.log('qna', data)
        const wrap = this._view.getElement('#reviewCommentWrap')
        while (wrap.hasChildNodes()) {
            wrap.removeChild(wrap.firstChild)
        }
        this._view.getElement('#qnaCommentCount').innerHTML = comment_count
        if (comment_count == 0) {
            // 없을때
            const nonTitle = document.createElement('h2')
            nonTitle.innerHTML = 'Q&A가 존재하지 않습니다.'
            nonTitle.classList.add('large__qna--non')
            wrap.appendChild(nonTitle)
        } else {
            this.setPagination(this._typeQna, comment_count, this._qnaPage, this._qnaLimit, 5)
            // 있을때
            comments.map((item) => {
                // console.log(item)
                let isMy = false
                if (this._myInfo) {
                    if (item.user_id == this._myInfo.user_id) isMy = true
                }
                const { content, date, profile_image_url, profile_nickname, job_field, job_type, experience_years, comment_id, comments, liked } = item
                const parentId = comment_id
                const tempArr = []
                if (job_field) tempArr.push(tempArr)
                if (job_type) tempArr.push(job_type)
                if (experience_years) tempArr.push(experience_years)
                const infoText = tempArr.length > 0 ? `( ${tempArr.join(' / ')} )` : ''
                const temp = this._commentItem.createComment(content, date, profile_image_url, profile_nickname, infoText, liked, comment_id, isMy, this._productName)
                wrap.appendChild(temp[0])
                // 길이 조절
                temp[4].style.height = `${temp[4].scrollHeight}px`
                if (temp[4].getBoundingClientRect().height > 90) {
                    temp[4].classList.add('ellipsis')
                    let isOpen = false
                    temp[5].onclick = () => {
                        if (!isOpen) {
                            temp[4].classList.remove('ellipsis')
                            temp[5].innerHTML = `접기`
                        } else {
                            temp[4].classList.add('ellipsis')
                            temp[5].innerHTML = `더보기`
                        }
                        isOpen = !isOpen
                    }
                } else {
                    temp[5].classList.add('hidden')
                }

                // 댓글 등록 버튼
                temp[1].onclick = () => this.createCommentDepthUi(temp)

                // 삭제 , 수정
                if (isMy) {
                    const delBtn = this._view.getElement('.del', temp[0])
                    const modBtn = this._view.getElement('.mod', temp[0])

                    modBtn.onclick = () => this.expectCommentAddClick(this._typeQna, true, item)
                    delBtn.onclick = () => this.commentDel(this._typeQna, item.comment_id)
                } else {
                    //신고하기
                    temp[3].onclick = () => this.reportBtnClick(8, comment_id)
                }

                // 대 댓글
                if (comments) {
                    comments.map((e) => {
                        let isMy = false
                        if (this._myInfo) {
                            if (e.user_id == this._myInfo.user_id) isMy = true
                        }
                        const { content, date, profile_image_url, profile_nickname, job_field, job_type, experience_years, comment_id, liked } = e
                        const tempArr = []
                        if (job_field) tempArr.push(tempArr)
                        if (job_type) tempArr.push(job_type)
                        if (experience_years) tempArr.push(experience_years)
                        const infoText = tempArr.length > 0 ? `( ${tempArr.join(' / ')} )` : ''
                        const tempItem = this._commentItem.createCommentDepth(content, date, profile_image_url, profile_nickname, infoText, liked, parentId, comment_id, isMy)
                        wrap.appendChild(tempItem[0])
                        // 길이 조절
                        // tempItem[4].parentNode.style.height = `${tempItem[4].scrollHeight}px`
                        tempItem[4].style.height = `${tempItem[4].scrollHeight}px`

                        if (tempItem[4].getBoundingClientRect().height > 90) {
                            tempItem[4].classList.add('ellipsis')
                            let isOpen = false
                            tempItem[5].onclick = () => {
                                if (!isOpen) {
                                    isOpen = !isOpen
                                    tempItem[4].classList.remove('ellipsis')
                                    tempItem[5].innerHTML = `접기`
                                } else {
                                    isOpen = !isOpen
                                    tempItem[4].classList.add('ellipsis')
                                    tempItem[5].innerHTML = `더보기`
                                }
                            }
                        } else {
                            tempItem[5].classList.add('hidden')
                        }

                        if (isMy) {
                            const delBtn = this._view.getElement('.del', tempItem[0])
                            const modBtn = this._view.getElement('.mod', tempItem[0])

                            modBtn.onclick = () => this.expectCommentAddClick(this._typeQna, true, e, 2, parentId)
                            delBtn.onclick = () => this.commentDel(this._typeQna, comment_id)
                        } else {
                            //신고하기
                            tempItem[3].onclick = () => this.reportBtnClick(8, comment_id)
                        }
                    })
                }
            })
        }
    }
    setReviewAddEvent = () => {
        // 별점 선택

        const star1 = this._view.getElement('#reviewStar1')
        const star2 = this._view.getElement('#reviewStar2')
        const star3 = this._view.getElement('#reviewStar3')
        const star4 = this._view.getElement('#reviewStar4')
        const star5 = this._view.getElement('#reviewStar5')
        this._commentStarList.push(star1)
        this._commentStarList.push(star2)
        this._commentStarList.push(star3)
        this._commentStarList.push(star4)
        this._commentStarList.push(star5)

        star1.addEventListener('mouseenter', () => this.fillEvent(1, this._commentStarList, this._typeComment))
        star2.addEventListener('mouseenter', () => this.fillEvent(2, this._commentStarList, this._typeComment))
        star3.addEventListener('mouseenter', () => this.fillEvent(3, this._commentStarList, this._typeComment))
        star4.addEventListener('mouseenter', () => this.fillEvent(4, this._commentStarList, this._typeComment))
        star5.addEventListener('mouseenter', () => this.fillEvent(5, this._commentStarList, this._typeComment))

        // 좋은 이유 선택
        const tagPerformance = this._view.getElement('#reviewTag1')
        const tagEfficiency = this._view.getElement('#reviewTag2')
        const tagCost = this._view.getElement('#reviewTag3')
        const tagDesign = this._view.getElement('#reviewTag4')
        const tagQuillty = this._view.getElement('#reviewTag5')

        tagPerformance.onclick = () => this.tagAddEvent('performance', tagPerformance)
        tagEfficiency.onclick = () => this.tagAddEvent('work_efficiency', tagEfficiency)
        tagCost.onclick = () => this.tagAddEvent('cost_performance', tagCost)
        tagDesign.onclick = () => this.tagAddEvent('design', tagDesign)
        tagQuillty.onclick = () => this.tagAddEvent('quality', tagQuillty)

        // 사진 등록
        const addFileInput = this._view.getElement('#addFile')
        const addInputChange = async () => {
            const files = addFileInput.files
            const reqData = []

            if (!files || files.length < 1) {
                return
            }
            if (files.length > 5 || this._commentAttaches.length >= 5) {
                utils().snackbar('이미지는 최대 5장 까지 추가가 가능합니다')
                return
            }

            for (let i = 0; i < files.length; i++) {
                const { name } = files[i]
                reqData.push({ data: files[i], name: name })
            }

            const resData = await this._storeModel.uploadImg(reqData)
            if (resData) {
                try {
                    const wrap = this._view.getElement('#commentAddImageView')
                    resData.map((data) => {
                        // console.log(data)
                        const { attach_id, file_path } = data
                        this._commentAttaches.push(attach_id)

                        const items = this._storeItem.createAddReviewCommentImageView()
                        items[1].src = file_path
                        items[1].alt = '개쇼 댓글 추가 이미지'

                        wrap.appendChild(items[0])
                        // 등록한 이미지 삭제 이벤트
                        items[0].onclick = () => {
                            wrap.removeChild(items[0])
                            const idx = this._commentAttaches.findIndex((e) => {
                                return attach_id == e
                            })
                            this._commentAttaches.splice(idx, 1)
                        }
                    })
                } catch (e) {
                    utils().snackbar('이미지 파일 업로드 실패')
                }
            } else {
                utils().snackbar('이미지 파일 업로드 실패')
            }
        }
        addFileInput.onchange = () => addInputChange()
        const commentTextArea = this._view.getElement('#commentTextArea')
        this._view.getElement('#commentAddBtn').onclick = () => this.commentAdd(this._typeComment, commentTextArea.value, 0)
    }
    setDataLap = async (data) => {
        // console.log('lap', data)
        const { preference_by_age, preference_by_developer, preference_by_experience, preference_by_gender, view_count } = data

        // 성별 선호도
        const setGenderPie = (data) => {
            const genderPieWrap = this._view.getElement('#genderPie')
            // 빈값 예외처리
            let color
            if (data.length < 1) {
                color = ['#000000']
                data = [
                    {
                        profile_gender: '데이터 수집중',
                        rate: '100'
                    }
                ]
            } else {
                color = ['#fc5689', '#169ce5']
            }
            let width = genderPieWrap.parentNode.offsetWidth,
                height = 170,
                margin = 20,
                radius = Math.min(width / 2, height) / 2 - margin,
                labelHeight = 13,
                circleSize = 80

            const screenWidth = window.innerWidth
            if (screenWidth < 421) {
                height = 130
                margin = 10
                circleSize = 50
            } else if (screenWidth < 1024) {
                height = 150
                margin = 10
                circleSize = 60
            }

            const svg = d3.select('#genderPie').append('svg').attr('width', width).attr('height', height)
            const svgPie = svg.append('g').attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')')
            const svgLegend = svg
                .append('g')
                .attr('transform', 'translate(' + width / 2 + ',' + 0 + ')')
                .classed('legend', true)
            const pie = d3.pie().value((d) => {
                return d.value.rate
            })

            const data_ready = pie(d3.entries(data))
            svgPie
                .selectAll('whatever')
                .data(data_ready)
                .enter()
                .append('path')
                .attr(
                    'd',
                    d3
                        .arc()
                        .innerRadius(circleSize) // 파이 크기
                        .outerRadius(radius / 2) // 내각 크기
                )
                .attr('fill', (d, i) => {
                    let selectIndex = -1
                    const value = d.value
                    const index = data.findIndex((e) => {
                        return e.rate == value
                    })
                    const gender = data[index].profile_gender
                    if (gender == '남') selectIndex = 1
                    else selectIndex = 0
                    return color[selectIndex]
                })
            const arcGenerator = d3
                .arc()
                .innerRadius(circleSize)
                .outerRadius(radius / 2)

            svgPie
                .selectAll('whatever')
                .data(data_ready)
                .enter()
                .append('text')
                .text((d) => {
                    const value = d.value
                    const index = data.findIndex((e) => {
                        return e.rate == value
                    })
                    const gender = data[index].profile_gender
                    if (gender == '데이터 수집중') {
                        return `${gender}`
                    } else {
                        return `${gender} ${d.value}%`
                    }
                })
                .attr('transform', (d) => {
                    return 'translate(' + arcGenerator.centroid(d) + ')'
                })
                .style('text-anchor', 'middle')
                .style('font-size', '1.2rem')
                .style('fill', 'white')
                .style('font-weight', 'bold')
        }
        // 직군별 관심도
        const setDeveloperBar = (data) => {
            const wrap = this._view.getElement('#developerBar')
            if (data.length < 1) {
                preference_by_developer.push({ name: '데이터 수집중', rate: '0' })
            }
            data.map((e) => {
                const item = this._storeItem.createDataLapDeveloperBarChart(e)
                wrap.appendChild(item)
            })
        }
        // 조회수
        const setViewCount = (data) => {
            const wrap = this._view.getElement('#clickedProduct')
            wrap.innerHTML = data
        }
        // 나이대별 관심도
        const setAgeBarChart = (data) => {
            const wrap = this._view.getElement('#ageBar')
            // 연령 없는거 채워주기
            const ageList = [10, 20, 30, 40, 50, 60]
            ageList.map((e) => {
                const idx = data.findIndex((f) => {
                    return f.age == e
                })
                if (idx == -1) {
                    data.push({ age: e, rate: '0' })
                }
            })
            // 연령 낮은순 정렬
            data.sort((a, b) => {
                return a.age - b.age
            })
            data.map((e) => {
                const item = this._storeItem.createDataLapAgeBarChart(e)
                wrap.appendChild(item)
            })
        }
        //년차별
        const experienceBar = (data) => {
            const wrap = this._view.getElement('#experienceBar')
            //낮은순 정렬
            data.sort((a, b) => {
                return a.experience_years - b.experience_years
            })
            if (data.length < 1) {
                preference_by_experience.push({ experience_years: '데이터 수집중', rate: '0' })
            }
            data.map((e) => {
                const item = this._storeItem.createExperienceBar(e)
                wrap.appendChild(item)
            })
        }
        setGenderPie(preference_by_gender)
        setDeveloperBar(preference_by_developer)
        setViewCount(view_count)
        setAgeBarChart(preference_by_age)
        experienceBar(preference_by_experience)
    }

    tagAddEvent = (type, button) => {
        const addData = { name: type }
        const idx = this._commentTags.findIndex((e) => {
            return e.name == type
        })
        if (idx > -1) {
            this._commentTags.splice(idx, 1)
            button.classList.remove('focus')
        } else {
            this._commentTags.push(addData)
            button.classList.add('focus')
        }
    }
    setPagination = (type, allCount, nowPage, limit, blockCount) => {
        const paginationRepo = new pagination(allCount, nowPage, limit, '', blockCount)

        let wrap
        let paginationItem
        if (type == this._typeExpect) {
            wrap = this._view.getElement('#expectPaginationWrap')
            while (wrap.hasChildNodes()) {
                wrap.removeChild(wrap.firstChild)
            }
            paginationItem = paginationRepo.createPaginationExpectation()
        }
        if (type == this._typeComment) {
            wrap = this._view.getElement('#reviewPagination')
            while (wrap.hasChildNodes()) {
                wrap.removeChild(wrap.firstChild)
            }
            paginationItem = paginationRepo.createPaginationExpectation()
        }
        if (type == this._typeQna) {
            wrap = this._view.getElement('#qnaPagination')
            while (wrap.hasChildNodes()) {
                wrap.removeChild(wrap.firstChild)
            }
            paginationItem = paginationRepo.createPaginationExpectation()
        }

        wrap.classList.remove('hidden')

        // 아이템 등록
        wrap.appendChild(paginationItem[0])
        // 클릭 이벤트
        if (type == this._typeExpect) {
            paginationItem[1].map((e) => {
                e.onclick = () => {
                    this._expectPage = e.getAttribute('idx')
                    this.getExpectCommentData().then((data) => this.setExpectationCommentData(data))
                }
            })
        }
        if (type == this._typeComment) {
            paginationItem[1].map((e) => {
                e.onclick = () => {
                    this._commentPage = e.getAttribute('idx')
                    this.getReviewsComment().then((e) => this.setReviewCommentData(e))
                    utils().moveTo(this._view.getElement('#reviewWrap'))
                }
            })
        }
        if (type == this._typeQna) {
            paginationItem[1].map((e) => {
                e.onclick = () => {
                    this._qnaPage = e.getAttribute('idx')
                    this.getQnaComment().then((e) => this.setQnaCommentData(e))
                    utils().moveTo(this._view.getElement('#qnaHeader'))
                }
            })
        }
    }

    sharedBtnClick = () => {
        const url = utils().copyUrl()
        this._shareModel.addShare(this._myInfo, this._pageIdx, 'product')
        utils().snackbar(`${url}이 복사되었습니다.`)
    }
    expectCommentAddClick = (type, mode = null, data = null, depth = 1, parentId = null) => {
        const body = document.body,
            html = document.documentElement
        const fullHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight)
        const wrap = this._view.getElement('#modalWrap')
        wrap.classList.remove('hidden')
        wrap.style.height = `${fullHeight}px`

        const modalItem = this._storeItem.createModalView()
        wrap.appendChild(modalItem[0])

        wrap.addEventListener('click', () => {
            try {
                wrap.removeChild(modalItem[0])
            } catch (e) {}
            wrap.classList.add('hidden')
        })
        modalItem[0].addEventListener('click', (e) => e.stopPropagation())
        // 텍스트 500글자 제한
        modalItem[7].addEventListener('keydown', () => {
            if (modalItem[7].value.length >= 499) {
                utils().snackbar('최대 500글자 까지 작성할 수 있습니다.')
                modalItem[7].value = modalItem[7].value.substring(0, 499)
            }
        })
        // 작성
        if (!mode) {
            modalItem[1].innerHTML = type == this._typeExpect ? '구매전 기대평 작성' : '상품 Q&A 작성'
            modalItem[2].src = this._titleImg
            modalItem[2].alt = `개쇼 ${this._productName}`
            modalItem[3].innerHTML = this._productName
            modalItem[4].innerHTML = `₩ ${this._productPrice}`

            if (type == this._typeExpect) {
                modalItem[6][0].addEventListener('mouseenter', () => this.fillEvent(1, modalItem[6], type))
                modalItem[6][1].addEventListener('mouseenter', () => this.fillEvent(2, modalItem[6], type))
                modalItem[6][2].addEventListener('mouseenter', () => this.fillEvent(3, modalItem[6], type))
                modalItem[6][3].addEventListener('mouseenter', () => this.fillEvent(4, modalItem[6], type))
                modalItem[6][4].addEventListener('mouseenter', () => this.fillEvent(5, modalItem[6], type))
                modalItem[8].onclick = () => this.commentAdd(type, modalItem[7].value)
            } else {
                modalItem[5].classList.add('hidden')
                modalItem[8].onclick = () => this.commentAdd(type, modalItem[7].value, 1)
            }
        }
        // 수정
        else {
            modalItem[1].innerHTML = type == this._typeExpect ? '구매전 기대평 수정' : '상품 Q&A 수정'
            modalItem[2].src = this._titleImg
            modalItem[2].alt = `개쇼 ${this._productName}`
            modalItem[3].innerHTML = this._productName
            modalItem[4].innerHTML = `₩ ${this._productPrice}`
            modalItem[7].innerHTML = data.content
            modalItem[8].innerHTML = `수정하기`

            if (type == this._typeExpect) {
                this.fillEvent(data.average_score, modalItem[6], type)
                modalItem[6][0].addEventListener('mouseenter', () => this.fillEvent(1, modalItem[6], type))
                modalItem[6][1].addEventListener('mouseenter', () => this.fillEvent(2, modalItem[6], type))
                modalItem[6][2].addEventListener('mouseenter', () => this.fillEvent(3, modalItem[6], type))
                modalItem[6][3].addEventListener('mouseenter', () => this.fillEvent(4, modalItem[6], type))
                modalItem[6][4].addEventListener('mouseenter', () => this.fillEvent(5, modalItem[6], type))
                modalItem[8].onclick = () => this.commentMod(type, modalItem[7].value, data.id, 1)
            } else {
                modalItem[5].classList.add('hidden')
                modalItem[8].onclick = () => this.commentMod(type, modalItem[7].value, data.comment_id, depth, parentId)
            }
        }
    }
    reviewCommentMod = async (data, imgList) => {
        const addReviewTitleWrap = this._view.getElement('#reviewAddTitle')
        utils().moveTo(addReviewTitleWrap)
        console.log(data)

        addReviewTitleWrap.innerHTML = '리뷰 수정하기'
        this.fillEvent(data.average_score, this._commentStarList, this._typeComment)

        const tagPerformance = this._view.getElement('#reviewTag1')
        const tagEfficiency = this._view.getElement('#reviewTag2')
        const tagCost = this._view.getElement('#reviewTag3')
        const tagDesign = this._view.getElement('#reviewTag4')
        const tagQuillty = this._view.getElement('#reviewTag5')
        // 한번 모두 지워주기
        tagPerformance.classList.remove('focus')
        tagEfficiency.classList.remove('focus')
        tagCost.classList.remove('focus')
        tagDesign.classList.remove('focus')
        tagQuillty.classList.remove('focus')

        this._commentAttaches = []
        this._commentTags = []

        data.tags.map((e) => {
            //태그에 맞게 포커스 주기
            if (e == '성능') {
                tagPerformance.classList.add('focus')
                this.tagAddEvent('performance', tagPerformance)
            }
            if (e == '업무 효율') {
                tagEfficiency.classList.add('focus')
                this.tagAddEvent('work_efficiency', tagEfficiency)
            }
            if (e == '가성비') {
                tagCost.classList.add('focus')
                this.tagAddEvent('cost_performance', tagCost)
            }
            if (e == '디자인') {
                tagDesign.classList.add('focus')
                this.tagAddEvent('design', tagDesign)
            }
            if (e == '품질') {
                tagQuillty.classList.add('focus')
                this.tagAddEvent('quality', tagQuillty)
            }
        })

        const textArea = this._view.getElement('#commentTextArea')
        const addBtn = this._view.getElement('#commentAddBtn')
        const cancleBtn = this._view.getElement('#commentCancleBtn')

        // 이미지 추가
        const wrap = this._view.getElement('#commentAddImageView')
        data.attachs.map((data) => {
            // console.log(data)
            const { id, url } = data
            this._commentAttaches.push(id)

            const items = this._storeItem.createAddReviewCommentImageView()
            items[1].src = url
            items[1].alt = '개쇼 댓글 추가 이미지'

            wrap.appendChild(items[0])
            // 등록한 이미지 삭제 이벤트
            items[0].onclick = () => {
                wrap.removeChild(items[0])
                const idx = this._commentAttaches.findIndex((e) => {
                    return id == e
                })
                this._commentAttaches.splice(idx, 1)
            }
        })

        textArea.value = data.content
        addBtn.innerHTML = '수정하기'
        cancleBtn.classList.remove('hidden')

        cancleBtn.onclick = () => {
            addReviewTitleWrap.innerHTML = '리뷰 등록하기'
            tagPerformance.classList.remove('focus')
            tagEfficiency.classList.remove('focus')
            tagCost.classList.remove('focus')
            tagDesign.classList.remove('focus')
            tagQuillty.classList.remove('focus')
            textArea.value = ''
            addBtn.innerHTML = '등록하기'
            cancleBtn.classList.add('hidden')
            this.fillEvent(-1, this._commentStarList, this._typeComment)
            this._commentTags = []
            this._commentAttaches = []
            const wrap = this._view.getElement('#commentAddImageView')
            while (wrap.hasChildNodes()) {
                wrap.removeChild(wrap.firstChild)
            }
        }

        addBtn.onclick = () => this.commentMod(this._typeComment, textArea.value, data.id)
    }
    commentAdd = async (type, text, depth = 0, parentId = -1) => {
        if (type == this._typeExpect && this._expectCommentAddRating <= 0) {
            utils().snackbar('별점을 선택해주세요')
            return
        }
        if (type == this._typeComment && this._commentAddRating <= 0) {
            utils().snackbar('별점을 선택해주세요')
            return
        }
        if (!text) {
            utils().snackbar('내용을 입력해주세요')
            return
        }
        const reqData = {}
        reqData.type = type
        if (type == this._typeExpect) reqData.average_score = this._expectCommentAddRating
        if (type == this._typeQna) {
            reqData.depth = depth
            if (parentId != -1) reqData.parent_id = parseInt(parentId)
        }
        if (type == this._typeComment) {
            reqData.average_score = this._commentAddRating
            reqData.tags = this._commentTags
            reqData.attach_ids = this._commentAttaches
        }
        reqData.content = text
        // console.log(reqData)

        const resData = await this._storeModel.addCommentData(reqData, this._pageIdx)
        // console.log(resData)
        if (resData.comment_id) {
            // 성공
            if (type == this._typeExpect) {
                const wrap = this._view.getElement('#modalWrap')
                while (wrap.hasChildNodes()) {
                    wrap.removeChild(wrap.firstChild)
                }
                wrap.classList.add('hidden')

                utils().snackbar('기대평 등록에 성공했습니다')

                this._expectPage = 1
                this.getExpectCommentData().then((e) => this.setExpectationCommentData(e))
            }
            if (type == this._typeComment) {
                utils().snackbar('리뷰 등록에 성공했습니다')

                // 초기화 작업
                const tagPerformance = this._view.getElement('#reviewTag1')
                const tagEfficiency = this._view.getElement('#reviewTag2')
                const tagCost = this._view.getElement('#reviewTag3')
                const tagDesign = this._view.getElement('#reviewTag4')
                const tagQuillty = this._view.getElement('#reviewTag5')
                tagPerformance.classList.remove('focus')
                tagEfficiency.classList.remove('focus')
                tagCost.classList.remove('focus')
                tagDesign.classList.remove('focus')
                tagQuillty.classList.remove('focus')
                this._commentTags = []
                this._commentAttaches = []
                this._view.getElement('#commentTextArea').value = ''
                this.fillEvent(-1, this._commentStarList, this._typeComment)
                const wrap = this._view.getElement('#commentAddImageView')
                while (wrap.hasChildNodes()) {
                    wrap.removeChild(wrap.firstChild)
                }
                this._commentPage = 1
                this.getReviewsComment().then((e) => this.setReviewCommentData(e))
            }
            if (type == this._typeQna) {
                const wrap = this._view.getElement('#modalWrap')
                while (wrap.hasChildNodes()) {
                    wrap.removeChild(wrap.firstChild)
                }
                wrap.classList.add('hidden')

                this._qnaPage = 1

                utils().snackbar('Q&A 작성에 성공했습니다.')
                this.getQnaComment().then((e) => this.setQnaCommentData(e))
            }
        }
    }
    commentMod = async (type, text, commentId, depth = -1, parent_id = -1) => {
        if (type == this._typeExpect && this._expectCommentAddRating <= 0) {
            utils().snackbar('별점을 선택해주세요')
            return
        }
        if (type == this._typeComment && this._commentAddRating <= 0) {
            utils().snackbar('별점을 선택해주세요')
            return
        }
        if (!text) {
            utils().snackbar('내용을 입력해주세요')
            return
        }
        const reqData = {}
        reqData.type = type
        if (type == this._typeExpect) {
            reqData.average_score = this._expectCommentAddRating
        }
        reqData.content = text
        if (type == this._typeComment) {
            reqData.average_score = this._commentAddRating
            reqData.tags = this._commentTags
            if (this._commentAttaches.length > 0) reqData.attach_id = this._commentAttaches[0]
        }
        if (type == this._typeQna) {
            reqData.depth = depth
            if (parent_id != -1) reqData.parent_id = parent_id
        }
        // console.log(reqData)
        const resData = await this._storeModel.modCommentData(reqData, this._pageIdx, commentId)
        if (resData.stats == 'ok') {
            if (type == this._typeExpect) {
                const wrap = this._view.getElement('#modalWrap')
                while (wrap.hasChildNodes()) {
                    wrap.removeChild(wrap.firstChild)
                }
                wrap.classList.add('hidden')

                utils().snackbar('댓글 수정을 성공!')

                this.getExpectCommentData().then((e) => this.setExpectationCommentData(e))
            }
            if (type == this._typeComment) {
                utils().snackbar('리뷰 수정 성공!')

                // 초기화 작업
                const tagPerformance = this._view.getElement('#reviewTag1')
                const tagEfficiency = this._view.getElement('#reviewTag2')
                const tagCost = this._view.getElement('#reviewTag3')
                const tagDesign = this._view.getElement('#reviewTag4')
                const tagQuillty = this._view.getElement('#reviewTag5')
                tagPerformance.classList.remove('focus')
                tagEfficiency.classList.remove('focus')
                tagCost.classList.remove('focus')
                tagDesign.classList.remove('focus')
                tagQuillty.classList.remove('focus')
                this._commentTags = []
                this._commentAttaches = []
                this._view.getElement('#commentTextArea').value = ''
                this.fillEvent(-1, this._commentStarList, this._typeComment)
                const wrap = this._view.getElement('#commentAddImageView')
                while (wrap.hasChildNodes()) {
                    wrap.removeChild(wrap.firstChild)
                }

                const addReviewTitleWrap = this._view.getElement('#reviewAddTitle')
                const addBtn = this._view.getElement('#commentAddBtn')
                const cancleBtn = this._view.getElement('#commentCancleBtn')
                addReviewTitleWrap.innerHTML = '리뷰 등록하기'
                addBtn.innerHTML = `등록하기`
                cancleBtn.classList.add('hidden')

                this.getReviewsComment().then((e) => this.setReviewCommentData(e))

                utils().moveTo(this._view.getElement('#reviewWrap'))
            }
            if (type == this._typeQna) {
                const wrap = this._view.getElement('#modalWrap')
                while (wrap.hasChildNodes()) {
                    wrap.removeChild(wrap.firstChild)
                }
                wrap.classList.add('hidden')

                this.getQnaComment().then((e) => this.setQnaCommentData(e))
                utils().moveTo(this._view.getElement('#reviewCommentWrap'))
            }
        } else {
            utils().snackbar('댓글 수정을 실패!')
        }
    }
    commentDel = async (type, commentId) => {
        const confirmCheck = confirm('정말로 삭제하시겠습니까?')
        if (confirmCheck) {
            const resData = await this._storeModel.delCommentData(this._pageIdx, commentId)
            console.log(resData)
            if (resData.stats == 'ok') {
                if (type == this._typeExpect) {
                    this.getExpectCommentData().then((e) => this.setExpectationCommentData(e))
                }
                if (type == this._typeComment) {
                    this.getReviewsComment().then((e) => this.setReviewCommentData(e))
                    utils().moveTo(this._view.getElement('#reviewWrap'))
                }
                if (type == this._typeQna) {
                    this.getQnaComment().then((e) => this.setQnaCommentData(e))
                    utils().moveTo(this._view.getElement('#reviewCommentWrap'))
                }
            } else {
                utils().snackbar('댓글 삭제 실패!')
            }
        }
    }
    commnetLike = async (unique_id, rating_id, img, text) => {
        if (!this._myInfo) {
            utils().snackbar('로그인이 필요한 서비스입니다.')
            return
        }
        const isLike = img.parentNode.getAttribute('idx') != 0 ? true : false

        if (!isLike) {
            const reqData = {}
            reqData.type = 'comment_of_product'
            reqData.unique_id = unique_id
            reqData.rating = 1

            // console.log(reqData)
            const resData = await this._evaluationModel.putLike(reqData)
            // console.log(resData)
            if (resData.rating_id) {
                img.src = `../res/img/icon_like.svg`
                text.innerHTML = parseInt(text.innerHTML) + 1
                img.parentNode.setAttribute('idx', resData.rating_id)
            }
        } else {
            const resData = await this._evaluationModel.delLike(img.parentNode.getAttribute('idx'))
            if ((resData.stats = 'ok')) {
                img.src = `../res/img/icon_like_df.svg`
                text.innerHTML = parseInt(text.innerHTML) - 1
                img.parentNode.setAttribute('idx', 0)
            } else {
                utils().snackbar(`잠시뒤에 다시 시도 해 주세요.`)
            }
        }
    }
    createCommentDepthUi = async (element) => {
        // 댓글달기 이벤트
        if (!this._myInfo) {
            utils().snackbar('로그인이 필요한 서비스 입니다.')
            return
        }
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
        // createUi[1].onclick = () => this.c(parent.getAttribute('idx'), createUi[2].value, parent, createUi[0])
        console.log(createUi[1])
        createUi[1].onclick = () => this.commentAdd(this._typeQna, createUi[2].value, 2, parent.getAttribute('idx'))
        this._isDepthTwoCommentOpen = true
        this._isDepthTwoCommentElement = createUi[0]
        this._isDepthTwoCommentIdx = parent.getAttribute('idx')
    }

    fillEvent = (count, list, type) => {
        if (type == this._typeExpect) {
            this._expectCommentAddRating = count
        }
        if ((type = this._typeComment)) {
            this._commentAddRating = count
        }

        list.map((e, i) => {
            if (i < count) {
                e.classList.remove('empty')
                e.classList.add('fill')
            } else {
                e.classList.remove('fill')
                e.classList.add('empty')
            }
        })
    }

    viewLargeImg = (selectIndex, imgList) => {
        const body = document.body,
            html = document.documentElement
        const fullHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight)
        const wrap = this._view.getElement('#modalLargeImage')
        wrap.classList.remove('hidden')
        wrap.style.height = `${fullHeight}px`

        this._selectdLargeImgIndex = selectIndex

        const item = this._storeItem.createModalLaregeImage(selectIndex, imgList)

        wrap.appendChild(item[0])

        this.largeImgChange(item, imgList)

        item[1].onclick = () => {
            this._selectdLargeImgIndex--
            this.largeImgChange(item, imgList)
        }
        item[2].onclick = () => {
            this._selectdLargeImgIndex++
            this.largeImgChange(item, imgList)
        }
        item[3].onclick = () => {
            this._selectdLargeImgIndex = 0
            wrap.removeChild(item[0])
            wrap.classList.add('hidden')
        }
    }

    largeImgChange = (item, imgList) => {
        if (this._selectdLargeImgIndex == 0) {
            item[1].classList.add('invisible')
        } else {
            item[1].classList.remove('invisible')
        }
        if (this._selectdLargeImgIndex + 1 == imgList.length) {
            item[2].classList.add('invisible')
        } else {
            item[2].classList.remove('invisible')
        }

        if (this._selectdLargeImgIndex < 0) {
            this._selectdLargeImgIndex = 0
        }
        if (this._selectdLargeImgIndex > imgList.length) {
            this._selectdLargeImgIndex = imgList.length - 1
        }

        item[5].src = imgList[this._selectdLargeImgIndex].img
        item[6].innerHTML = `${this._selectdLargeImgIndex + 1} / ${imgList.length}`

        item[4].map((e, i) => {
            e.onclick = () => {
                this._selectdLargeImgIndex = i
                this.largeImgChange(item, imgList)
            }
            if (i == this._selectdLargeImgIndex) {
                e.classList.remove('unfocus')
                e.classList.add('focus')
            } else {
                e.classList.remove('focus')
                e.classList.add('unfocus')
            }
        })
    }

    reportBtnClick = (type, postId, content) => {
        if (!this._myInfo) {
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

            const resData = await this._serviceModel.putReport(reqData)
            if (resData.post_id) {
                utils().snackbar('신고가 접수 되었습니다.<br />처리까지는 최대 1~3일까지 걸릴 수 있습니다.')
                document.body.removeChild(modal[0])
            } else {
                utils().snackbar('신고하기 실패<br />잠시 뒤 다시 시도해주세요')
                return
            }
        }
    }
}
