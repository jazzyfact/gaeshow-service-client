export default class starRating {
    constructor(writeAble) {
        this._writeAble = writeAble

        this._fillStar = `★`
        this._emptyStar = `☆`
    }

    getStar = (size, color, isFill, value) => {
        const p = document.createElement('p')
        p.innerHTML = isFill ? this._fillStar : this._emptyStar
        p.style.fontSize = `${size}px`

        if (value != 0 && value != 1) {
            // 값 만큼 채워줌.
            p.style.background = `linear-gradient(to left, rgba(0,0,0,0.1) ${10 - value}0%, #ffe220 ${value}0%)`
            p.style.webkitBackgroundClip = `text`
            p.style.webkitTextFillColor = `transparent`
        } else {
            p.style.color = color
        }

        return p
    }
}
