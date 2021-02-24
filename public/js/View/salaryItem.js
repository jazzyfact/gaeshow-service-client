export default class salaryItem {
    constructor() {}

    createTop3Item = (data, index) => {
        const { id, name, count, basic_salary, laguages } = data

        const wrap = document.createElement('li'),
            rank = document.createElement('p'),
            nameWrap = document.createElement('span'),
            names = document.createElement('p'),
            counts = document.createElement('p'),
            p = document.createElement('p'),
            langWrap = document.createElement('span'),
            avgSalaryText = document.createElement('p'),
            avgSalary = document.createElement('p')

        wrap.classList.add('top__item')
        rank.classList.add('top__item--rank')
        nameWrap.classList.add('top__item--position')
        names.classList.add('name')
        counts.classList.add('count')
        p.classList.add('top__item--text')
        langWrap.classList.add('top__item--lang')
        avgSalaryText.classList.add(`top__item--text`)
        avgSalary.classList.add(`top__item--salary`)

        rank.innerHTML = index + 1
        names.innerHTML = name
        counts.innerHTML = `(${count}명)`

        p.innerHTML = `주로 사용 언어`

        // 언어 구성
        laguages.map((i) => {
            if (!i) {
                i = {}
                i.name = '미선택'
            }
            const p = document.createElement('p')
            p.innerHTML = i.name

            langWrap.appendChild(p)
        })

        avgSalaryText.innerHTML = `평균연봉`
        avgSalary.innerHTML = `${basic_salary}만원`

        // 조합
        nameWrap.appendChild(names)
        nameWrap.appendChild(counts)

        wrap.appendChild(rank)
        wrap.appendChild(nameWrap)
        wrap.appendChild(p)
        wrap.appendChild(langWrap)
        wrap.appendChild(avgSalaryText)
        wrap.appendChild(avgSalary)

        return wrap
    }

    createSkeletonChart = () => {
        const wrap = document.createElement('div')
        wrap.classList.add('chart__skeleton')
        const text = document.createElement('div')
        text.classList.add('chart__skeleton--text')

        for (let i = 0; i < 10; i++) {
            const item = document.createElement('div')
            text.appendChild(item)
        }

        const bar = document.createElement('div')
        bar.classList.add('chart__skeleton--bar')

        for (let i = 0; i < 7; i++) {
            const item = document.createElement('div')
            item.classList.add('item')

            const bar1 = document.createElement('div')
            bar1.classList.add('item__bar')

            const text = document.createElement('div')
            text.classList.add('item__text')

            const div = document.createElement('div')
            const p = document.createElement('p')

            text.appendChild(div)
            text.appendChild(p)

            item.appendChild(bar1)
            item.appendChild(text)

            bar.appendChild(item)
        }

        const textWrap = document.createElement('div')
        textWrap.classList.add('chart__skeleton--wran')

        const h3 = document.createElement('h3')
        h3.innerHTML = `표시할 데이터가 없습니다`
        textWrap.appendChild(h3)

        wrap.appendChild(text)
        wrap.appendChild(bar)
        wrap.appendChild(textWrap)

        return wrap
    }

    createTooltip = (t, a) => {
        const wrap = document.createElement('div')

        const titleWrap = document.createElement('div')
        const title = document.createElement('p')
        const avg = document.createElement('p')

        titleWrap.appendChild(title)
        titleWrap.appendChild(avg)

        const circle = document.createElement('div')

        wrap.classList.add('tooltip__wrap')
        titleWrap.classList.add(`tooltip__title--wrap`)
        title.classList.add(`tooltip__title--text`)
        avg.classList.add(`tooltip__title--avg`)
        circle.classList.add(`tooltip__circle`)

        title.innerHTML = `${t}`
        avg.innerHTML = `${a}만원`

        wrap.appendChild(titleWrap)
        wrap.appendChild(circle)

        return wrap
    }
}
