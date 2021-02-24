import categoryModel from '../Model/categoryModel.js'
import salaryModel from '../Model/salaryModel.js'
import View from '../Core/Mvc/View.js'
import salaryItem from '../View/salaryItem.js'
import utils from '../Core/Singleton/utils.js'

export default class workspaceController {
    constructor(isLogin) {
        this._isLogin = isLogin
        this._categoryModel = new categoryModel()
        this._salaryModel = new salaryModel()
        this._view = new View()
        this._salaryItem = new salaryItem()

        this._jobSelector = this._view.getElement('#jobSelector')
        this._exSelector = this._view.getElement('#exSelector')

        this._e = utils().getParameterByName('e') ? utils().getParameterByName('e') : 99
        this._t = utils().getParameterByName('t') ? utils().getParameterByName('t') : 'job_type'

        this._exSelector.value = this._e
        this._jobSelector.value = this._t

        this._jobName

        this._wrap = document.createElement('div')
        this._wrap.classList.add('blur')
        const itemWrap = document.createElement('div')
        const t = document.createElement('h1')
        const btn = document.createElement('button')

        t.innerHTML = '로그인후 모든 정보를 확인하세요!'
        btn.innerHTML = `Login`

        itemWrap.appendChild(t)
        itemWrap.appendChild(btn)

        this._wrap.appendChild(itemWrap)

        this.lifeCycle()
    }

    lifeCycle = async () => {
        this._jobSelector.onchange = () => this.dataGetAndSet()
        this._exSelector.onchange = () => this.dataGetAndSet()

        // 카테고리 얻기
        this.getCategory()
        // 평균 연봉 & 차트정 보 얻기
        this.dataGetAndSet()
        // 탑3 가격 얻기
        this.getDataTop3().then((e) => this.setDataTop3(e))
    }
    getCategory = async () => {
        const resData = await this._categoryModel.getPost()

        let idx
        if (resData) {
            resData.map((e) => {
                if (e.id == 6) {
                    idx = e.id
                    this._idx = idx
                    this._view.getElement('#cateTitle').innerHTML = e.name
                    this._view.getElement('#cateExplain').innerHTML = e.explanation
                    return
                }
            })
            return idx
        }
    }

    dataGetAndSet = async () => {
        const resData = await this.getData()
        if (!resData) return
        const { average_annual_salary, average_annual_salaries } = resData

        history.pushState(null, null, `/salary.html?e=${this._exSelector.value}&t=${this._jobSelector.value}`)
        // seo 데이터
        utils().removeSEO()
        const text = this._exSelector.value == 99 ? '' : `${this._exSelector.value}년차 `
        utils().setSEO(`${text}개발자 연봉 평균 - GAESHOW `, `${text},연봉 평균,개발자 연봉,개발자 급여`, `${text}개발자의 연봉 평균을 직군별로 확인하세요!`, null)
        //평균 연봉
        this._view.getElement('#avgSalary').innerHTML = average_annual_salary ? `${average_annual_salary}만원` : `정보 없음`
        // 차트
        // 차트 지우기
        const chartWrap = this._view.getElement('#chart')
        while (chartWrap.hasChildNodes()) {
            chartWrap.removeChild(chartWrap.firstChild)
        }

        if (average_annual_salaries.length < 1) {
            // 스켈레톤 차트
            const skeletonChart = this._salaryItem.createSkeletonChart()
            chartWrap.appendChild(skeletonChart)
            chartWrap.style.filter = 'none'
        } else {
            // 일반 차트
            this.setChart(average_annual_salaries, this._isLogin)
        }

        return resData
    }

    getData = async () => {
        const reqData = {}

        reqData.job_filter = this._jobSelector.value
        if (this._exSelector.value != 99) reqData.experience_years_filter = this._exSelector.value

        const resData = await this._salaryModel.getSalaryData(reqData)
        console.log(resData)
        if (resData) return resData
        return null
    }

    getDataTop3 = async () => {
        const resData = await this._salaryModel.getSalaryTop3()
        return resData
    }

    setDataTop3 = (data) => {
        const jobs = data.jobs
        const top3Wrap = this._view.getElement('#salaryTop3Wrap')
        jobs.map((e, i) => {
            const item = this._salaryItem.createTop3Item(e, i)
            top3Wrap.appendChild(item)
        })
    }

    setChart = (data, isBlur) => {
        const screenWidth = window.innerWidth
        let barWidth
        const margin = { top: 50, right: 80, bottom: 50, left: 80 }

        if (screenWidth >= 1920) {
            barWidth = 700
        } else if (screenWidth >= 1024) {
            barWidth = 500
        } else if (screenWidth >= 720) {
            barWidth = 400
        } else {
            barWidth = 300
            margin.left = 40
            margin.right = 40
        }

        // console.log(screenWidth)
        const chartWrap = this._view.getElement('#chart')

        const width = chartWrap.parentNode.offsetWidth
        const height = 500

        const gWidth = width - margin.left - margin.right
        const gHeight = height - margin.top - margin.bottom
        const maxSalary = data.reduce((p, c) => (p.basic_salary > c.basic_salary ? p.basic_salary : c.basic_salary))
        const svg = d3.select(`#chart`).append(`svg`).attr(`width`, width).attr(`height`, height)

        const graph = svg.append(`g`).attr(`width`, gWidth).attr(`height`, gHeight).attr(`transform`, `translate(${margin.left}, ${margin.top})`)

        const gXAxis = graph.append(`g`).attr(`transform`, `translate(0, ${gHeight})`)

        const gXAxis2 = graph.append(`g`).attr(`transform`, `translate(0, ${gHeight})`)

        const gYAxis = graph.append(`g`).attr('class', `line__title`)

        const y = d3.scaleLinear().domain([1000, 10000]).range([gHeight, 0])
        const x = d3
            .scaleBand()
            .domain(data.map((d) => d.name))
            .range([0, barWidth])
            .paddingInner(0.2)
            .paddingOuter(0.2)
        const x2 = d3
            .scaleBand()
            .domain(data.map((d) => d.count))
            .range([0, barWidth])
            .paddingInner(0.2)
            .paddingOuter(0.2)

        const tooltip = d3.select('body').append('div').attr('class', 'tooltip hidden')
        const tooltipWrap = this._view.getElement('.tooltip')
        const _salaryItem = this._salaryItem

        const rects = graph.selectAll(`rect`).data(data)

        rects
            .attr(`width`, x.bandwidth)
            .attr(`class`, `bar-rect`)
            .attr(`height`, (d) => gHeight - y(d.basic_salary))
            .attr(`x`, (d) => {
                x(d.name)
            })
            .attr(`y`, (d) => y(d.basic_salary))

        rects
            .enter()
            .append(`rect`)
            .attr(`class`, `bar-rect`)
            .attr(`width`, x.bandwidth)
            .attr(`height`, (d) => gHeight - y(d.basic_salary))
            .attr(`x`, (d) => x(d.name))
            .attr(`y`, (d) => y(d.basic_salary))
            .attr('fill', '#0258ff')
            .on('mouseover', function (d) {
                // const bar = this
                // console.log(d)
                tooltipWrap.appendChild(_salaryItem.createTooltip(d.name, d.basic_salary))
                tooltipWrap.classList.remove('hidden')
                tooltipWrap.style.left = `${d3.event.pageX - 25}px`
                tooltipWrap.style.top = `${d3.event.pageY - 75}px`
            })
            .on('mouseout', function (d) {
                tooltipWrap.classList.add('hidden')
                while (tooltipWrap.hasChildNodes()) {
                    tooltipWrap.removeChild(tooltipWrap.firstChild)
                }
            })
        // const xAxis = d3.axisBottom(x)

        const xAxis = (g) =>
            g
                .classed('name__title', true)
                .attr('transform', `translate(0, ${gHeight})`)
                .call(d3.axisBottom(x).tickSizeOuter(0))
                .call(
                    d3.axisBottom(x).tickFormat((d) => {
                        if (screenWidth > 700) return d.split(' ')[0]
                    })
                )
                .call((g) => g.select('.domain').remove())
        const xAxis2 = (g) =>
            g
                .classed('name__title', true)
                .attr('transform', `translate(0, ${gHeight + 15})`)
                .call(d3.axisBottom(x).tickSizeOuter(0))
                .call(
                    d3.axisBottom(x).tickFormat((d) => {
                        if (screenWidth > 700) {
                            const word = d.split(' ')
                            if (word.length > 1) return word[1]
                            else return ''
                        }
                    })
                )
                .call((g) => g.select('.domain').remove())

        const yAxis = d3
            .axisLeft(y)
            .ticks(10)
            .tickSize(-width)
            .tickFormat((d, i) => {
                if (screenWidth > 720) {
                    if (i != 9) {
                        return `${d}만원`
                    } else {
                        return `1억 이상`
                    }
                } else {
                    if (i != 9) {
                        return `${i}k`
                    } else {
                        return `10k ↑`
                    }
                }
            })

        gXAxis.call(xAxis)
        gXAxis2.call(xAxis2)
        gYAxis.call(yAxis)

        gXAxis.selectAll(`text`).style(`font-size`, 14)
        gYAxis.selectAll(`text`).style(`font-size`, 14)

        gXAxis.selectAll('line').attr('stroke', 'rgba(0,0,0,0)')
        gXAxis2.selectAll('line').attr('stroke', 'rgba(0,0,0,0)')

        gYAxis.selectAll('line').attr('stroke-dasharray', '10,10')
        gYAxis.selectAll('line').attr('stroke', 'rgba(168,168,168,0.5)')

        // 블러 작업
        const blurWrap = this._view.getElement('#chartWrap')
        if (!isBlur && this._exSelector.value != 99) {
            if (blurWrap) blurWrap.appendChild(this._wrap)
            chartWrap.style.filter = 'blur(10px)'
        } else {
            try {
                blurWrap.removeChild(this._wrap)
                chartWrap.style.filter = 'blur(0px)'
            } catch (e) {}
        }
    }
}
