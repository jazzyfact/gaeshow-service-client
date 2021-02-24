import categoryModel from '../Model/categoryModel.js'
import postModel from '../Model/postModel.js'
import utils from '../Core/Singleton/utils.js'
import View from '../Core/Mvc/View.js'
import starRating from '../View/starRating.js'
import commentModel from '../Model/commentModel.js'
import portfolioItem from '../View/portfolioItem.js'
import pagination from '../View/pagination.js'
import report from '../View/report.js'
import serviceModel from '../Model/serviceCenterModel.js'

const lang = `language`
const ide = `ide`

export default class ideViewController {
    constructor(myInfo) {
        this._categoryModel = new categoryModel()
        this._postModel = new postModel()
        this._view = new View()
        this._commentModel = new commentModel()
        this._portfolioItem = new portfolioItem()
        this._pagination = new pagination()
        this._report = new report()
        this._serviceModel = new serviceModel()

        this._myInfo = myInfo ? myInfo : null
        this._selectName

        this._requestDefind = utils().getParameterByName('i') ? utils().getParameterByName('i') : -1
        if (this._requestDefind == 'i') this._requestDefind = ide
        if (this._requestDefind == 'l') this._requestDefind = lang

        this._postIdx = utils().getParameterByName('n') ? utils().getParameterByName('n') : -1

        if (this._postIdx == -1 || this._requestDefind == -1) {
            // 없는 데이터
        }
        // 필요한 엘리먼트 찾기
        this._langBtn = this._view.getElement('#langBtn')
        this._ideBtn = this._view.getElement('#ideBtn')
        this._selector = this._view.getElement('#selector')
        // 선택 포커스
        this.requestDefindFocusChange(this._requestDefind)
        this._langBtn.onclick = () => this.requestDefindOnclick(lang)
        this._ideBtn.onclick = () => this.requestDefindOnclick(ide)

        // 댓글
        this._commentPage = 1
        this._commentLimit = 3
        this._addStarRating = 0
        this._starList
        this._commentModifyMode = false
        this._commentModIdx

        this._commentHeader = this._view.getElement('#commentHeader')
        this._commentAddBtn = this._view.getElement('#commentAddBtn')
        this._commentModifyCancleBtn = this._view.getElement('#commentModifyDeleteBtn')
        this._commentAddBtn.onclick = () => this.commentAddBtnClick()
        this._commentModifyCancleBtn.onclick = () => this.commentModifyCancle()

        this.lifeCycle()
    }

    lifeCycle = async () => {
        this.getCategory().then((e) => this.setCategory(e))
        this.getData().then((e) => {
            utils().removeSEO()
            utils().setSEO(`${this._selectName} 후기 - GAESHOW`, `${this._selectName},${e.developer_name}`, `${this._selectName}를 사용하는 ${e.developer_name}의 생생한 후기를 들어보세요`, null)
            this.setPostData(e)
        })
        this.getComment().then((e) => this.setCommentData(e))
        this.setStarRating()
    }

    getCategory = async () => {
        let data = {
            type: this._requestDefind
        }
        const resData = await this._categoryModel.getIdeLang(data)
        // console.log(resData)
        return resData
    }
    setCategory = (data) => {
        // 기존 아이템 지우기
        while (this._selector.hasChildNodes()) {
            this._selector.removeChild(this._selector.firstChild)
        }
        data.map((e) => {
            const { id, en_name } = e
            const option = document.createElement('option')
            option.value = id
            option.innerHTML = en_name
            if (id == this._postIdx) {
                option.selected = true
                this._selectName = en_name
            }
            this._selector.appendChild(option)
        })
        // 카테고리 세팅하고 체인지 이벤트 달아주기
        this._selector.onchange = () => this.selectorChange(this._selector.value)
    }
    requestDefindOnclick = (type) => {
        this.requestDefindFocusChange(type)
        // 타입별로 카테고리 다시 조회
        this._requestDefind = type
        this._postIdx = 1

        history.pushState(null, null, `remview.html?n=1&i=${type == ide ? `i` : `l`}`)

        this.lifeCycle()
    }

    requestDefindFocusChange = (type) => {
        // 포커스 선택
        if (type == 'ide') {
            this._langBtn.classList.remove('focus')
            this._ideBtn.classList.add('focus')
        } else {
            this._ideBtn.classList.remove('focus')
            this._langBtn.classList.add('focus')
        }
    }
    selectorChange = (selectedValue) => {
        // 클릭 인덱스 변경
        this._postIdx = selectedValue
        // 주소 변경
        history.pushState(null, null, `remview.html?n=${selectedValue}&i=${this._requestDefind == ide ? `i` : `l`}`)

        this.lifeCycle()
    }
    getData = async () => {
        const data = {
            type: this._requestDefind,
            unique_id: this._postIdx
        }
        const resData = await this._postModel.getIdePostsDetail(data)
        // console.log(resData)
        return resData
    }
    setPostData = (data) => {
        console.log(data)
        this._view.getElement('#title').innerHTML = this._selectName
        this._view.getElement('#subTitle').innerHTML = this._selectName
        this._view.getElement('#developName').innerHTML = data.developer_name

        // 레이팅 점수
        if (!data.average_score) data.average_score = `0.0`
        if (data.average_score == 0) data.average_score = `0.0`
        this._view.getElement('#rating').innerHTML = data.average_score

        // 레이팅 별
        const ratingWrap = this._view.getElement('#ratingWrap')
        // 레이팅 별 초기화
        while (ratingWrap.hasChildNodes()) {
            ratingWrap.removeChild(ratingWrap.firstChild)
        }
        const floatRating = parseFloat(data.average_score).toFixed(1)
        // 정수 판단
        let firstRate = floatRating.split('.')[0]
        // 소수점 판단
        let secondRate = floatRating.split('.')[1]

        // 별점 테스트
        // firstRate = 3
        // secondRate = 8
        // 별 생성
        const starRepo = new starRating(false)
        let isSecond = false
        if (firstRate == 0 || secondRate == 0) isSecond = true
        // 별 만들기
        for (let i = 0; i < 5; i++) {
            let star
            if (i < firstRate) {
                // 채워진 별
                star = starRepo.getStar(25, `#ffe200`, true, 1)
            } else if (!isSecond) {
                // 반만 채워진 별
                isSecond = true
                star = starRepo.getStar(25, `#ffe200`, true, secondRate)
            } else {
                // 안채워진 별
                star = starRepo.getStar(25, `rgba(0,0,0,0.1)`, true, 0)
            }
            ratingWrap.appendChild(star)
        }
        // 바차트 만들기
        this.createBarChart(data)
        this.createPieChart(data)
    }

    createBarChart = (data) => {
        // 개발자 선호도 넣기 d3 barchart
        const screenWidth = window.innerWidth
        let height = 150
        let barWidth

        if (screenWidth >= 1920) {
            barWidth = 300
        } else if (screenWidth >= 1024) {
            barWidth = 250
        } else if (screenWidth >= 720) {
            barWidth = 200
        } else {
            barWidth = 100
        }

        // 넓이 구하기
        const delData = data.preference_by_developer.map((e) => {
            e.rate = parseFloat(e.rate).toFixed(2)
            return e
        })
        // 기존 차트 모두 지우고
        const developWrap = this._view.getElement('#developChart')
        while (developWrap.hasChildNodes()) {
            developWrap.removeChild(developWrap.firstChild)
        }

        const width = developWrap.parentNode.offsetWidth
        const margin = { top: 10, right: 10, bottom: 20, left: 10 }
        const x = d3
            .scaleBand()
            .range([0, barWidth])
            // .scaleBand() 그래프의 막대의 반복되는 범위를 정해줍니다.
            .domain(delData.map((d) => d.name))
            // .domain() 각각의 막대에 순서대로 막대에 매핑합니다.
            .range([margin.left, width - margin.right])
            // 시작위치와 끝 위치로 눈금의 범위를 지정합니다.
            .padding(0.2)
        // 막대의 여백을 설정합니다.

        const y = d3
            .scaleLinear()
            .domain([0, 100])
            .nice()
            .range([height - margin.bottom, margin.top])

        const xAxis = (g) =>
            g
                .attr('transform', `translate(0, ${height - margin.bottom})`)
                .call(d3.axisBottom(x).tickSizeOuter(0))
                .call((g) => g.select('.domain').remove())
        const yAxis = (g) =>
            g
                .attr('transform', `translate(${margin.left}, 0)`)
                // .call(d3.axisLeft(y))
                .call((g) => g.select('.domain').remove())

        const svg = d3.select(`#developChart`).append('svg').style('width', width).style('height', height)

        svg.append('g').call(xAxis)
        svg.append('g').call(yAxis)

        svg.append('g')
            .attr('fill', '#f5f5fb')
            // .attr('fill', 'red')
            .selectAll('rect')
            .data(delData)
            .enter()
            .append('rect')
            .attr('x', (d) => x(d.name))
            .attr('y', (d) => y(100))
            .attr('height', (d) => y(d.rate) - y(100))
            .attr('width', x.bandwidth())

        const dataChart = svg.append('g').attr('fill', '#6c6cff').selectAll('rect').data(delData).enter()
        dataChart
            .append('rect')
            .attr('x', (d) => x(d.name))
            .attr('y', (d) => y(d.rate))
            .attr('height', (d) => y(0) - y(d.rate))
            .attr('width', x.bandwidth())

        dataChart
            .append('text')
            .text((d) => `${d.rate}%`)
            .attr('y', y(20))
            .attr('x', (d) => x(d.name) + x.bandwidth() / 2)
            .style('transform', (d) => {
                const textLength = d.rate.length
                // 제일 길때
                if (textLength >= 6) {
                    return `translate(-2.5rem, 0)`
                } else if (textLength >= 5) {
                    return `translate(-2.25rem, 0)`
                } else {
                    return `translate(-2.05rem, 0)`
                }
            })
            .style('fill', (d) => {
                if (d.rate < 20) {
                    return 'rgba(0,0,0,0.7)'
                } else {
                    return 'rgba(255,255,255,0.7)'
                }
            })
            .style('font-size', '1.5rem')

        svg.selectAll('line').attr('stroke', 'rgba(0,0,0,0)')

        svg.node()
    }

    createPieChart = (data) => {
        const carrerData = data.preference_by_career.map((e) => {
            e.rate = parseFloat(e.rate).toFixed(2)
            return e
        })
        // 경력순으로 정렬
        carrerData.sort((a, b) => {
            return a.experience_years - b.experience_years
        })
        // 기존 차트 지우기
        const carrerWrap = this._view.getElement('#carrerChart')
        while (carrerWrap.hasChildNodes()) {
            carrerWrap.removeChild(carrerWrap.firstChild)
        }

        const width = carrerWrap.parentNode.offsetWidth,
            height = 130,
            margin = -15,
            radius = Math.min(width / 4, height) / 2 - margin,
            labelHeight = 13

        const svg = d3.select('#carrerChart').append('svg').attr('width', width).attr('height', height)
        const svgPie = svg.append('g').attr('transform', 'translate(' + width / 3 + ',' + height / 2 + ')')
        const svgLegend = svg
            .append('g')
            .attr('transform', 'translate(' + width / 1.5 + ',' + 0 + ')')
            .classed('legend', true)
        // Create dummy data

        // set the color scale
        // const color = d3.scaleOrdinal().range(['#F11A88', '#8D157F', '#402783', '#2A4498', '#0B68CA', '#01A1D1', '#34A539', '#95C61D', '#F4E502', '#F67D25'])
        const color = ['#F11A88', '#8D157F', '#402783', '#2A4498', '#0B68CA', '#01A1D1', '#34A539', '#95C61D', '#F4E502', '#F67D25']

        // Compute the position of each group on the pie:
        const pie = d3.pie().value((d) => {
            return d.value.rate
        })
        const data_ready = pie(d3.entries(carrerData))

        svgPie
            .selectAll('whatever')
            .data(data_ready)
            .enter()
            .append('path')
            .attr(
                'd',
                d3
                    .arc()
                    .innerRadius(55) // 파이 크기
                    .outerRadius(radius / 2) // 내각 크기
            )
            .attr('fill', (d) => {
                // 년차별 컬러 지정
                let data = d.data.value.experience_years.replace('년차', '')
                let index = data == '신입' ? 0 : parseInt(data)

                return color[index]
            })

        svgLegend
            .selectAll('.legend')
            .data(carrerData)
            .enter()
            .append('rect')
            .attr('y', (d, i) => {
                if (i < 5) {
                    return labelHeight * i * 1.7
                } else {
                    return labelHeight * (i - 5) * 1.7
                }
            })
            .attr('x', (d, i) => {
                if (i < 5) {
                    return labelHeight
                } else {
                    return labelHeight + 60
                }
            })
            .attr('width', labelHeight / 1.5)
            .attr('height', labelHeight + 2)
            .attr('fill', (d) => {
                let data = d.experience_years.replace('년차', '')
                let index = data == '신입' ? 0 : parseInt(data)

                return color[index]
            })

        svgLegend
            .selectAll('.legend')
            .data(carrerData)
            .enter()
            .append('text')
            .text((d) => {
                if (d.experience_years != 10) {
                    if (d.experience_years == 0) {
                        return `신입`
                    } else {
                        return `${d.experience_years}`
                    }
                } else {
                    return `${d.experience_years} 이상`
                }
            })
            .attr('x', (d, i) => {
                if (i < 5) {
                    return labelHeight * 2
                } else {
                    return labelHeight * 2 + 60
                }
            })
            .attr('y', (d, i) => {
                if (i < 5) {
                    return labelHeight * i * 1.68 + labelHeight
                } else {
                    return labelHeight * (i - 5) * 1.68 + labelHeight
                }
            })
            .style('font-size', `${labelHeight + 1}px`)

        svgLegend.node()
    }
    getComment = async () => {
        const reqData = {}
        reqData.type = this._requestDefind
        reqData.unique_id = this._postIdx
        reqData.page = this._commentPage
        reqData.limit = this._commentLimit

        const resData = await this._commentModel.getIdeComment(reqData)
        return resData
    }
    setCommentData = async (data) => {
        // console.log(data)
        const { comment_count, is_next, comments } = data

        const wrap = this._view.getElement('#commentWrap')

        while (wrap.hasChildNodes()) {
            wrap.removeChild(wrap.firstChild)
        }

        // 댓글 총 개수
        const commentCountWrap = this._view.getElement('#commentCount')
        commentCountWrap.innerHTML = comment_count

        if (comment_count == 0) {
        } else {
            comments.map(async (e) => {
                const item = await this._portfolioItem.createIdeLangCommentItem(e, this._myInfo)
                wrap.appendChild(item[0])

                if (this._myInfo) {
                    // 로그인시 수정 삭제 신고하기 버튼 생성
                    if (this._myInfo.user_id == e.user_id) {
                        const modBtn = item[1]
                        const delBtn = item[2]

                        modBtn.onclick = () => this.commentMod(e)
                        delBtn.onclick = () => this.commentDelete(e)
                    } else {
                        // console.log('들옴?')
                        const reportBtn = item[1]
                        reportBtn.onclick = () => this.reportBtnClick(2, e.comment_id)
                    }
                } else {
                    // 비 로그인시 블러 처리
                    item[0].style.filter = 'blur(5px)'
                }
            })

            this.setPagination(comment_count, this._commentPage, this._commentLimit)

            if (!this._myInfo) {
                // 비 로그인시 로그인 유도 ui 생성
                const loginUi = document.createElement('div')
                loginUi.classList.add('appraisal__item--login')
                let btn
                btn = document.createElement('button')
                btn.innerHTML = `로그인 하고 전체보기`

                loginUi.appendChild(btn)
                wrap.appendChild(loginUi)

                btn.onclick = () => {
                    console.log('click')
                    window.location.href = '/login.html'
                }
            }
        }
    }
    commentDelete = async (data) => {
        const dialog = window.confirm(`정말로 삭제하시겠습니까?`)
        if (dialog) {
            const { comment_id } = data
            const resData = await this._commentModel.delIdeComment(comment_id)
            if (resData.stats == 'ok') {
                this.resetItems()
                const ideHeader = this._view.getElement('#ideAdHeader')
                const movedLocation = ideHeader.offsetTop
                window.scrollTo({ top: movedLocation, behavior: 'smooth' })
            } else {
                utils().snackbar('댓글 삭제에 실패 했습니다')
            }
        }
    }
    commentMod = (data) => {
        // console.log(data)
        this._commentModifyMode = true
        this._commentAddBtn.innerHTML = '수정하기'
        this._commentHeader.innerHTML = `리뷰 수정하기`
        this._commentModIdx = data.comment_id

        this._commentModifyCancleBtn.classList.remove('hidden')

        const advanceText = this._view.getElement('#advanceInput')
        const disadvanceText = this._view.getElement('#disadvanceInput')
        if (data.advantage_content) {
            advanceText.value = data.advantage_content
        }
        if (data.disadvantage_content) {
            disadvanceText.value = data.disadvantage_content
        }
        this.fillEvent(data.average_score)

        const ideHeader = this._commentHeader
        const movedLocation = ideHeader.offsetTop
        window.scrollTo({ top: movedLocation, behavior: 'smooth' })
    }
    commentModifyCancle = () => {
        this._commentModifyMode = false
        this._commentModIdx = null
        this._commentAddBtn.innerHTML = '완료하기'
        this._commentHeader.innerHTML = `리뷰 작성하기`

        this._commentModifyCancleBtn.classList.add('hidden')
        const advanceText = this._view.getElement('#advanceInput')
        const disadvanceText = this._view.getElement('#disadvanceInput')
        advanceText.value = ''
        disadvanceText.value = ''
        this.fillEvent(0)
    }
    setPagination = async (allCount, nowPage, limit) => {
        if (allCount <= limit) return
        const paginationView = await import('../View/pagination.js')
        let paginationRepo = new paginationView.default(allCount, nowPage, limit)
        const paginationItem = paginationRepo.createPagenationMyProfile()
        let pageWrapper
        pageWrapper = this._view.getElement('#pageWrap')
        while (pageWrapper.hasChildNodes()) {
            pageWrapper.removeChild(pageWrapper.firstChild)
        }
        pageWrapper.appendChild(paginationItem[0])
        // console.log(paginationItem)
        // 페이지네이션 아이템 이벤트 등록
        const prevBtnClick = () => {
            this._commentPage = this._commentPage - 3 > 0 ? this._commentPage - 3 : 1
            this.resetItems(pageWrapper)
            moveHeader()
        }
        const nextBtnClick = () => {
            this._commentPage = this._commentPage + 3 > 0 ? this._commentPage + 3 : 1
            this.resetItems(pageWrapper)
            moveHeader()
        }
        const pageSelect = (page) => {
            this._commentPage = page
            this.resetItems(pageWrapper)
            moveHeader()
        }

        const moveHeader = () => {
            const ideHeader = this._view.getElement('#ideAdHeader')
            const movedLocation = ideHeader.offsetTop
            window.scrollTo({ top: movedLocation, behavior: 'smooth' })
        }
        if (paginationItem[1]) paginationItem[1].onclick = () => prevBtnClick()
        if (paginationItem[3]) paginationItem[3].onclick = () => nextBtnClick()
        paginationItem[2].map((e) => {
            e.onclick = () => {
                pageSelect(e.getAttribute('idx'))
            }
        })
    }

    resetItems = () => {
        const wrap = this._view.getElement(`#commentWrap`)
        while (wrap.hasChildNodes()) {
            wrap.removeChild(wrap.firstChild)
        }
        this.getComment().then((e) => this.setCommentData(e))
        this.getData().then((e) => this.setPostData(e))
    }

    setStarRating = () => {
        this._starList = []
        const star1 = this._view.getElement('#star1')
        const star2 = this._view.getElement('#star2')
        const star3 = this._view.getElement('#star3')
        const star4 = this._view.getElement('#star4')
        const star5 = this._view.getElement('#star5')

        this._starList.push(star1)
        this._starList.push(star2)
        this._starList.push(star3)
        this._starList.push(star4)
        this._starList.push(star5)

        star1.addEventListener('mouseenter', () => this.fillEvent(1))
        star2.addEventListener('mouseenter', () => this.fillEvent(2))
        star3.addEventListener('mouseenter', () => this.fillEvent(3))
        star4.addEventListener('mouseenter', () => this.fillEvent(4))
        star5.addEventListener('mouseenter', () => this.fillEvent(5))
    }

    fillEvent = (count) => {
        this._addStarRating = count
        this._starList.map((e, i) => {
            if (i < count) {
                e.classList.remove('empty')
                e.classList.add('fill')
            } else {
                e.classList.remove('fill')
                e.classList.add('empty')
            }
        })
    }

    commentAddBtnClick = async () => {
        if (!this._myInfo) {
            utils().snackbar('로그인이 필요한 서비스입니다.')
            return
        }
        const advanceText = this._view.getElement('#advanceInput').value
        const disadvanceText = this._view.getElement('#disadvanceInput').value
        const starRating = this._addStarRating
        // console.log(advanceText, disadvanceText, starRating)
        if (starRating == 0) {
            utils().snackbar('평점을 입력해주세요')
            return
        }
        const reqData = {}
        if (!this._commentModifyMode) reqData.type = this._requestDefind
        if (!this._commentModifyMode) reqData.unique_id = this._postIdx
        if (this._commentModifyMode) reqData.comment_id = this._commentModIdx
        reqData.average_score = starRating

        if (advanceText) {
            reqData.advantage_content = advanceText
        }
        if (disadvanceText) {
            reqData.disadvantage_content = disadvanceText
        }

        let resData
        if (!this._commentModifyMode) resData = await this._commentModel.addIdeComment(reqData)
        else resData = await this._commentModel.updateIdeComment(reqData)
        // console.log(resData)
        if (this._commentModifyMode) {
            if (resData.stats == 'ok') {
                this.resetItems()
                this.commentModifyCancle()
                const ideHeader = this._view.getElement('#ideAdHeader')
                const movedLocation = ideHeader.offsetTop
                window.scrollTo({ top: movedLocation, behavior: 'smooth' })
            } else {
                utils().snackbar('리뷰 수정에 실패 했습니다.')
            }
        } else {
            if (resData.comment_id) {
                // 등록 성공
                this.resetItems()
                // 초기화
                this._view.getElement('#advanceInput').value = ''
                this._view.getElement('#disadvanceInput').value = ''
                this.fillEvent(0)
                // 화면 이동
                const ideHeader = this._view.getElement('#ideAdHeader')
                const movedLocation = ideHeader.offsetTop
                window.scrollTo({ top: movedLocation, behavior: 'smooth' })
            } else {
                // 등록 실패
                utils().snackbar('리뷰 등록에 실패 했습니다.')
            }
        }
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
