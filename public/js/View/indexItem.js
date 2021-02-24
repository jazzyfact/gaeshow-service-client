// import View from "../Core/Mvc/View"



export default class indexItem{
    constructor(){

    //   this._view =new View()
    }

    //추천상품카테고리
    createRecommendProductCategoryItem = (data) =>{

        const { id, name, explanation, categories } = data
        // console.log("데이터",data)

        let ul, a, li
        ul = document.createElement('ul')
        a = document.createElement('a')
        li = document.createElement('li')
        
        ul.classList.add('main__recommend--category')
        a.classList.add('main__recommend--title')
        // a.classList = id
     

        // a.href = `?r=${id}`
        li.innerHTML = name
        // a.classList = id
        // a.innerHTML = `${id}`

        //수정해야함..
        //상품 카테고리 하나를 클릭하면 셀렉트 표시가 됐다가
        //다른 카테고리 선택하면 기존에 셀렉트 표시 된게 없어지고
        //새로 클릭한 카테고리에 셀렉트 표시 (동그라미)가 표시되야하는데
        //기존에 있는 동그라미가 안사라짐... 일단 주석처리해놈

        // li.classList.add('selected')
        //카테고리 클릭하면 
        li.onclick = () =>{
        // li.classList.add('selected')
        // a.classList.remove('selected')
        // li.classList.add('selected')
        // li.classList.toggle('selected');


       
        // const hasClass = li.classList.add('selected');
        // // const hasClass = document.getElementById('#itemBestWrap')
        // // li.classList.toggle('selected');

        //   //기존 상품데이터 지우기
         

        // if (!hasClass) {
         
        //     li.classList.add('selected')

        // } else {
        //        //기존 상품데이터 지우기
         
        //     li.classList.remove('selected')
        // }

        }

       


        a.appendChild(li)
        // if (categories.length > 0) a.appendChild(p)
        ul.appendChild(a)




        return ul, li, a
    }
    //베스트상품카테고리
    createBestProductCategoryItem = (data) =>{

        const { id, name, explanation, categories } = data

        let ul, a, li
        ul = document.createElement('ul')
        a = document.createElement('a')
        li = document.createElement('li')
        
        ul.classList.add('main__recommend--category')
        a.classList.add('main__recommend--title')
     

        a.href = `?b=${id}`
        li.innerHTML = name
        // a.innerHTML = id

        // li.classList.add('selected')
        li.onclick = () =>{
        li.classList.add('selected')
       
        }


        a.appendChild(li)
        // if (categories.length > 0) a.appendChild(p)
        ul.appendChild(a)




        return ul, li, a
    }

    //상품 item
    createStoreListItem = (data) => {
        // console.log(data)
        const { id, name, price, view_count, review_count, expectation_count, qna_count, share_count, average_score, thumbnail } = data

        let wrap

        wrap = document.createElement('a')
        wrap.href = `/product.html?i=${id}`

        let figure, figcaption, share, qna, img

        figure = document.createElement('figure')
        figcaption = document.createElement('figcaption')
        share = document.createElement('p')
        qna = document.createElement('p')
        img = document.createElement('img')

        figcaption.appendChild(share)
        figcaption.appendChild(qna)
        figure.appendChild(figcaption)
        figure.appendChild(img)

        wrap.appendChild(figure)

        figure.classList.add('main__recommend--titleImg')

        share.innerHTML = `공유 ${share_count}`
        qna.innerHTML = `Q&A ${qna_count}개`
        img.src = thumbnail ? thumbnail : '../res/img/logo.svg'
        img.alt = `개쇼 ${name} 상품`

        let title = document.createElement('p')
        title.classList.add('main__recommend--titleStr')
        title.innerHTML = name

        wrap.appendChild(title)

        let desWrap, price_p, average_p

        desWrap = document.createElement('div')
        price_p = document.createElement('p')
        average_p = document.createElement('p')

        desWrap.classList.add('main__recommend--subTitle--wrapper')
        price_p.classList.add('main__recommend--subTitle--price')
        average_p.classList.add('main__recommend--subTitle--point')

        desWrap.appendChild(price_p)
        desWrap.appendChild(average_p)

        wrap.appendChild(desWrap)

        price_p.innerHTML = `₩ ${price}`
        const avText = average_score ? average_score : 0
        average_p.innerHTML = `평점 ${avText == 0 ? `없음` : parseFloat(avText).toFixed(1)}`

        let exAverage_p, reviewCount_p
        exAverage_p = document.createElement('p')
        reviewCount_p = document.createElement('p')

        wrap.appendChild(exAverage_p)
        wrap.appendChild(reviewCount_p)

        exAverage_p.classList.add('main__recoomend--subTitles')
        reviewCount_p.classList.add('main__recoomend--subTitles')

        exAverage_p.innerHTML = `구매 전 기대평 ${expectation_count}개`
        reviewCount_p.innerHTML = `리뷰수 ${review_count}개`

        return wrap
    }
    createEmptyListItem = () => {
        let wrap = document.createElement('div')

        let h3 = document.createElement('h3')
        h3.innerHTML = '제품을 찾을 수 없습니다.'

        wrap.appendChild(h3)

        return wrap
    }

    //개쇼 베스트 상품
    //상품 item
    createBestListItem = (data) => {
        // console.log(data)
        const { id, name, price, view_count, review_count, expectation_count, qna_count, share_count, average_score, thumbnail } = data

        let wrap

        wrap = document.createElement('a')
        wrap.href = `/product.html?i=${id}`

        let figure, figcaption, share, qna, img

        figure = document.createElement('figure')
        figcaption = document.createElement('figcaption')
        share = document.createElement('p')
        qna = document.createElement('p')
        img = document.createElement('img')

        figcaption.appendChild(share)
        figcaption.appendChild(qna)
        figure.appendChild(figcaption)
        figure.appendChild(img)

        wrap.appendChild(figure)

        figure.classList.add('main__best--titleImg')

        share.innerHTML = `공유 ${share_count}`
        qna.innerHTML = `Q&A ${qna_count}개`
        img.src = thumbnail ? thumbnail : '../res/img/logo.svg'
        img.alt = `개쇼 ${name} 상품`

        let title = document.createElement('p')
        title.classList.add('main__best--titleStr')
        title.innerHTML = name

        wrap.appendChild(title)

        let desWrap, price_p, average_p

        desWrap = document.createElement('div')
        price_p = document.createElement('p')
        average_p = document.createElement('p')

        desWrap.classList.add('main__best--subTitle--wrapper')
        price_p.classList.add('main__best--subTitle--price')
        average_p.classList.add('main__best--subTitle--point')

        desWrap.appendChild(price_p)
        desWrap.appendChild(average_p)

        wrap.appendChild(desWrap)

        price_p.innerHTML = `₩ ${price}`
        const avText = average_score ? average_score : 0
        average_p.innerHTML = `평점 ${avText == 0 ? `없음` : parseFloat(avText).toFixed(1)}`

        let exAverage_p, reviewCount_p
        exAverage_p = document.createElement('p')
        reviewCount_p = document.createElement('p')

        wrap.appendChild(exAverage_p)
        wrap.appendChild(reviewCount_p)

        exAverage_p.classList.add('main__best--subTitles')
        reviewCount_p.classList.add('main__best--subTitles')

        exAverage_p.innerHTML = `구매 전 기대평 ${expectation_count}개`
        reviewCount_p.innerHTML = `리뷰수 ${review_count}개`

        return wrap
    }

   //메인 상품 
   createMainProductItem = (data) =>{

    const { id, name, price, view_count, review_count, expectation_count, qna_count, share_count, average_score, thumbnail } = data

    const wrap = document.createElement('a')
    wrap.classList.add('main__photo')

    let figure, img, figcaption,  pTitle

    // section = document.createElement('section')
    figure = document.createElement('figure')
    img = document.createElement('img')
    figcaption = document.createElement('figcaption')
    // figcaption.classList.add('figcaption')
    // pTitle = document.createElement('p')


    figure.appendChild(img)
    figure.appendChild(figcaption)


    wrap.appendChild(figure)

    figure.classList.add('main__photo--wrapper')


    img.src = thumbnail ? thumbnail : '../res/img/logo@3x.png'
    img.alt = `개쇼 ${name} 상품`

    let title = document.createElement('p')
    title.classList.add('main__photo--titleStr')
    title.innerHTML = name

    wrap.appendChild(title)
}

//최상단상품
mainProductItem =  (data) => {
    const { id, name, price, view_count, review_count, expectation_count, qna_count, share_count, average_score, thumbnail ,content} = data

    // const {content} = data

    // console.log("최상단상품item은. data ",data)
  



    const wrap = document.createElement('a')
    wrap.classList.add('main__photo')

    let fig, img
    fig = document.createElement('figure')
    fig.classList.add('main__photo--wrapper')
    img = document.createElement('img')
    img.classList.add('main__photo--titleImg')
    img.alt = `개쇼 ${name} 상품 이미지`

    // comment = document.createElement('p')
    // comment.classList.add('main__photo--comment')
    // comment.innerHTML = data.content


    let figCap, p_title, p_review, div

    figCap = document.createElement('figcaption')

    // div.classList.add('main__photo--wrapper--profile')
    //상품명
    p_title = document.createElement('p')
    p_title.innerHTML = name
    p_title.classList.add('main__photo--titleStr')

    div = document.createElement('div')
    div.classList.add('main__photo--wrapper--profile')

    //기대평,리뷰,QnA
    p_review  = document.createElement('p')
    p_review.innerHTML = `기대평 ${expectation_count}회&nbsp 리뷰 ${review_count} 개&nbsp QnA ${qna_count} 개`
    p_review.classList.add('main__photo--nick')

    //20px빈공간
    // span = document.createElement('span')


    figCap.appendChild(p_title)
    figCap.appendChild(div)
    // figCap.appendChild(p_review)
    div.appendChild(p_review)

    fig.appendChild(img)
    fig.appendChild(figCap)
    // fig.appendChild(comment)


    wrap.appendChild(fig)
    // wrap.appendChild(span)
    // wrap.appendChild(divWrap)

    // data insert
    wrap.href = `/product.html?i=${id}`
    if (thumbnail) img.src = thumbnail
    else img.src = `../res/img/logo.svg`

    return wrap
}


//오늘의키워드
createTodayKeyword =   (data) =>{
    const {name,ranking } = data
    // console.log("data는아이템",data)

    // let wrap
    // wrap = document.createElement('a')
    // wrap.classList.add('keywords__body')

    let div, pRank, pTitle

  
    div = document.createElement('a')
    div.classList.add('keywords__item')
    div.href = `/result.html?s=${name}`

    pRank = document.createElement('p')
    pRank.innerHTML = ranking
    pRank.classList.add('keywords__item--rank')
    

    pTitle = document.createElement('p')
    pTitle.innerHTML = name
    pTitle.classList.add('keywords__item--title')
    

    div.appendChild(pRank)
    div.appendChild(pTitle)
    // wrap.appendChild(div)
    // pTriangle = document.createElement('p')
    // pTriangle.classList.add('keywords__item--triangle')
    // // pTriangle.innerHTML = name

    // pNumericChange = document.createElement('p')
    // pNumericChange.classList.add('keywords__item--numericChange')
    // pNumericChange.innerHTML = name

   
    // div.appendChild(pTriangle)
    // div.appendChild(pNumericChange)
   


    return div
}

//오늘의키워드 없을때 더미데이터
createEmptyListKeyWordItem = () => {
    // let wrap = document.createElement('div')

    // let h3 = document.createElement('h3')
    // h3.innerHTML = '인기 키워드가 없습니다'

    // wrap.appendChild(h3)

    // return wrap
    let div, pRank, pTitle

  
    div = document.createElement('a')
    div.classList.add('keywords__item')
    // div.href = `/result.html?s=${name}`

    pRank = document.createElement('p')
    pRank.innerHTML = '1'
    pRank.classList.add('keywords__item--rank')
    

    pTitle = document.createElement('p')
    pTitle.innerHTML = `Today's Popular Keywords`
    pTitle.classList.add('keywords__item--title')
    

    div.appendChild(pRank)
    div.appendChild(pTitle)
    // wrap.appendChild(div)
    // pTriangle = document.createElement('p')
    // pTriangle.classList.add('keywords__item--triangle')
    // // pTriangle.innerHTML = name

    // pNumericChange = document.createElement('p')
    // pNumericChange.classList.add('keywords__item--numericChange')
    // pNumericChange.innerHTML = name

   
    // div.appendChild(pTriangle)
    // div.appendChild(pNumericChange)
   


    return div
}

//최상단 상품 더미데이터(데이터없을때)
createEmptyListMainProductItem = () => {
    const wrap = document.createElement('a')
    wrap.classList.add('main__photo')

    let fig, img
    fig = document.createElement('figure')
    fig.classList.add('main__photo--wrapper')
    img = document.createElement('img')
    img.classList.add('main__photo--titleImg')
    img.alt = `개쇼 ${name} 상품 이미지`

    // comment = document.createElement('p')
    // comment.classList.add('main__photo--comment')
    // comment.innerHTML = data.content


    let figCap, p_title, p_review, div

    figCap = document.createElement('figcaption')

    // div.classList.add('main__photo--wrapper--profile')
    //상품명
    p_title = document.createElement('p')
    p_title.innerHTML = name
    p_title.classList.add('main__photo--titleStr')

    div = document.createElement('div')
    div.classList.add('main__photo--wrapper--profile')

    //기대평,리뷰,QnA
    p_review  = document.createElement('p')
    // p_review.innerHTML = `기대평 ${expectation_count}회&nbsp 리뷰 ${review_count} 개&nbsp QnA ${qna_count} 개`
    p_review.classList.add('main__photo--nick')

    //20px빈공간
    // span = document.createElement('span')


    figCap.appendChild(p_title)
    figCap.appendChild(div)
    // figCap.appendChild(p_review)
    div.appendChild(p_review)

    fig.appendChild(img)
    fig.appendChild(figCap)
    // fig.appendChild(comment)


    wrap.appendChild(fig)
    // wrap.appendChild(span)
    // wrap.appendChild(divWrap)

    // data insert
    // wrap.href = `/product.html?i=${id}`
    // if (thumbnail) img.src = thumbnail
    img.src = `../res/img/icon_gaeshow.png`

    return wrap
}
}