export default class View {
    constructor() {}

    createElement = (tag, firstClassName, secondClassName) => {
        //매개변수가 하나일때는 tag만 만들고 두개,세개이면 클래스 이름까지 만들어줌
        const element = document.createElement(tag)
        if (firstClassName) element.classList.add(firstClassName)
        if (secondClassName) element.classList.add(secondClassName)

        return element
    }

    getElement = (selector, parentElement = document) => {
        const element = parentElement.querySelector(selector)
        return element
    }

    getElements = (selector, parentElement = document) => {
        const element = parentElement.querySelectorAll(selector)
        return element
    }
    getElementsByTagName = (selector, parentElement = document) => {
        const element = parentElement.getElementsByTagName(selector)
        return element
    }

    appendElementFromParent = (parent, child) => {
        if (parent && child) {
            parent.appendChild(child)
        }
    }

    createTextElement = (tag, className, innerHTML) => {
        const textElement = document.createElement(tag)
        if (className) textElement.className = className
        if (innerHTML) textElement.innerHTML = innerHTML
        return textElement
    }

    // input(type) - submit을 제외한 input을 생성할 때 사용하는 메소드
    createInputElement = (className, type, name, placeholder, value) => {
        const inputTag = document.createElement('input')
        inputTag.type = type
        inputTag.name = name
        if (placeholder) inputTag.placeholder = placeholder
        if (className) inputTag.className = className
        if (value) inputTag.value = value
        return inputTag
    }

    // input(type) - submit을 생성할 때 사용
    createSubmitElement = (className, value) => {
        const submitTag = document.createElement('input')
        submitTag.type = 'submit'
        submitTag.value = value
        if (className) submitTag.className = className
        return submitTag
    }

    createBtnElement = (className, innerHTML) => {
        const buttonTag = document.createElement('button')
        if (innerHTML) buttonTag.innerHTML = innerHTML
        if (className) buttonTag.className = className
        return buttonTag
    }

    // a 태그는 li 태그나 다른 태그들로 감싸는 경우가 많아 파라미터에 containerTag 추가
    createATagElement = (className, href, innerHTML, containerTag, containerClassName) => {
        const aTag = document.createElement('a')
        aTag.href = href
        aTag.innerHTML = innerHTML
        if (className) aTag.className = className
        // 컨테이너 태그가 선언되어 있다면
        if (containerTag) {
            const container = document.createElement(containerTag)
            container.append(aTag)
            if (containerClassName) container.className = containerClassName
            return container
        }
        return aTag
    }

    createImgElement = (className, src, alt) => {
        const imgTag = document.createElement('img')
        if (src) imgTag.src = src
        if (alt) imgTag.alt = alt
        if (className) imgTag.className = className
        return imgTag
    }
}
