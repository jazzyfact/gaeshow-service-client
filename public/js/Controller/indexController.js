import View from '../Core/Mvc/View.js'
import Singleton from '../Core/Singleton/Singleton.js'
import utils from '../Core/Singleton/utils.js'
import categoryModel from '../Model/categoryModel.js'
import indexModel from "../Model/indexModel.js"
import indexItem from '../View/indexItem.js'
import storeItem from '../View/storeItem.js'
import storeModel from '../Model/storeModel.js'


export default class indexController {
    constructor() {
        console.log()
        this._categoryModel = new categoryModel()
        this._indexItem = new indexItem()
        this._storeItem = new storeItem()
        this._indexModel = new indexModel()
        this._view = new View()
        this._utils = new utils()
        this._singleton = new Singleton()
        this._storeModel = new storeModel()
    
        
        //필수데이터
        this._nowPage = utils().getParameterByName('p') ? utils().getParameterByName('p') : 1
        this._limit = 3
        //페이지구분
        //오늘의 워크스페이스
        this._typeToday = 'today'
        //인기워크스페이스
        this._typePopular ='popularity'
        //카테고리
        this._categoryId = 5
        // 서버 리턴 데이터
        this._resData
        //상품 카테고리
        this._cateModel = new categoryModel()
        //개쇼추천상품
        this._expectation = 'expectation'
        //개쇼베스트상품
        this._best = 'review'
        
        this.selectedIndex

        // document.getElementById("fouc").style.display="block";
        //카테고리 1 전체보기
        this._pageCategoryRecIndex = utils().getParameterByName('r') ? utils().getParameterByName('r') : 1
        this._pageCategoryBestIndex = utils().getParameterByName('b') ? utils().getParameterByName('b') : 1
        this.lifeCycle()


        this._categoryWrap = this._view.getElement('#categoryWrap')

    }

    lifeCycle = async () =>{
        //최상단 상품 리뷰
        await this.getMainProduct().then((e) => this.setMainProduct(e))
        //상품카테고리
        await this.getRecommendCategory().then((e) => this.setRecommendCategory(e))
        //오늘의 워크스페이스
        await this.getTodayData().then((e) => this.setTodayWorksItem(e))
        //인기 워크스페이스
        await this.getPopularData().then((e) => this.setPopularItem(e))
        //개쇼추천상품
        await  this.getRecommendProduct(this._pageCategoryRecIndex).then((data) => this.setRecommendProductItem(data))
        //개쇼베스트카테고리
        await this.getBestCategory().then((e) => this.setBestCategory(e))
       //개쇼베스트상품
        await this.getBestProduct(this._pageCategoryBestIndex).then((data) => this.setBestProductItem(data))
        //오늘의 인기키워드
        await this.getTodayPopularKeywords().then((e) => this.setTodayPopularKeywords(e))
    }
    //개쇼추천상품카테고리 가져오기
    getRecommendCategory = async () => {
        const reqData = { type: 'store' }
        const resData = await this._cateModel.getStore(reqData)
        // console.log("상품카테고리",resData)
        return resData
    }
    //상품카테고리 선택한거 셋팅
    setRecommendCategory = async (data) => {
        const recommendWrap =  this._view.getElement('#categoryWrap')
        // console.log("카테고리데이터 셋팅",data)

        // const hasClass = li.classList.add('selected');
        // //기존아이템삭제
        // while (recommendWrap.hasChildNodes()) {
        //     recommendWrap.removeChild(recommendWrap.firstChild)
        // }

        // if (!recommendWrap) {
         
        //     recommendWrap.classList.add('selected')

        // } else {
        //        //기존 상품데이터 지우기
         
        //        recommendWrap.classList.remove('selected')
        // }


        //서버에서 받아온 상품 카테고리들을 화면에 보여준다
        data.map((data) => {
            const item = this._indexItem.createRecommendProductCategoryItem(data)
            // console.log("상품 data",data.id)
            //카테고리 아이템 셋팅
            this._categoryWrap.appendChild(item)
            //클릭한 상품 데이터 id를 통해 개쇼 추천 상품 데이터를 가져온다
            item.onclick = () => this.getRecommendProduct(data.id).then((data) => this.setRecommendProductItem(data))
            
            //상품카테고리 id를 리턴한다
            return data.id
        })
    }

    //개쇼베스트상품카테고리
    getBestCategory = async () => {
    const reqData = { type: 'store' }
    const resData = await this._cateModel.getStore(reqData)
    // console.log("상품카테고리",resData)
    return resData
    }
    //개쇼베스트상품카테고리 선택한거 셋팅
    setBestCategory = async (data) => {
        const bestCategoryWrap = this._view.getElement('#bestCategoryWrap')
        // console.log("data는",data)

        data.map((data) => {
        //서버에서 받아온 상품 카테고리들을 화면에 보여준다
        const bestItem = this._indexItem.createRecommendProductCategoryItem(data)
        // console.log("상품 item",item)
        bestCategoryWrap.appendChild(bestItem)
        
        //클릭한 상품 데이터 id를 통해 개쇼 베스트 상품 데이터를 가져온다
        bestItem.onclick = () =>this.getBestProduct(data.id).then((data) => this.setBestProductItem(data))
        // console.log('item.id는??',  item.id)
    })
}

    //메인 최상단 상품보여주기
    getMainProduct = async () =>{
        const reqData = {}
        reqData.page = 1
        reqData.limit = 2
        reqData.filter = 'review'
        reqData.category_id =  1
        // console.log("개쇼 메인 최상단 상품 reqData ",reqData)
        const resData = await this._indexModel.getMainReview(reqData)
        // console.log("개쇼 메인 최상단 상품?????",resData)

        //서버에서 받아온 메인 최상단 상품데이터의 id를 가져와서
        //해당 상품에 해당하는 각 각의 리뷰를 가져온다(1번상품에 대한 리뷰, 2번상품에대한 리뷰)
        const { is_next, product_count, products } = resData
        // products[0].id, products[2].id
        // 상품 id 알아내기
        // console.log("개쇼 메인 최상단 상품 첫번째",products[0].id)
        // console.log("개쇼 메인 최상단 상품 두번째",products[1].id)
        if(products[0] == undefined){

            const itemWrap = this._view.getElement('#mainProduct')

            products.map((itemData) => {
                const item = this._indexItem.createEmptyListMainProductItem(itemData)
                // console.log("확인 itemData",itemData)
                // console.log("메인상품인덱스",item)
                itemWrap.appendChild(item)
            })
        }
        else if(products[1] == undefined){
            const itemWrap = this._view.getElement('#mainProduct')

            products.map((itemData) => {
                const item = this._indexItem.createEmptyListMainProductItem(itemData)
                // console.log("확인 itemData",itemData)
                // console.log("메인상품인덱스",item)
                itemWrap.appendChild(item)
            })
        }
        else if(products[0] != undefined && products[1] != undefined)
        //최상단 상품데이터 id를 통해서 해당 리뷰를 가져옴
        this.getMainProductReview(products[0].id).then((data) => this.setMainProductFirstReview(data,products[0].id))
        this.getMainProductReview(products[1].id).then((data) => this.setMainProductTwoReview(data,products[1].id))

        //최상단 상품데이터 리턴
        return resData
    }

    //최상단 상품 데이터 셋팅
    setMainProduct = (data) =>{
        // console.log('받은 최상단 데이터',  data)
        const { is_next, product_count, products } = data
  
        const itemWrap = this._view.getElement('#mainProduct')

        products.map((itemData) => {
            const item = this._indexItem.mainProductItem(itemData)
            // console.log("확인 itemData",itemData)
            // console.log("메인상품인덱스",item)
            itemWrap.appendChild(item)
        })
    }

    //최상단  상품 리뷰 데이터 가져오기
    getMainProductReview = async (idx) => {
        const reqData = {}
        reqData.type = 'comment_of_product'
        reqData.page = 1
        reqData.limit = 3
        const resData = await this._storeModel.getCommentData(reqData, idx)
        // console.log("가져온리뷰",resData)
        //데이터 리턴
        return resData
    }

    //////////////// 최상단 상품 데이터 마우스 호버시 해당 리뷰 데이터 3개 보여지게 한 방법.... 힘들었다.!!/////////////////

    /*
    컨트롤러에서
    1.서버에서 최상단 상품 데이터 가져옴
    getMainProduct()
    2.최상단 상품 데이터 가져온 후 해당 상품의 id를 가져와서 해당 상품에 각 각의 리뷰를 가져온다(1번상품에 대한 리뷰, 2번상품에대한 리뷰)
    this.getMainProductReview(products[0].id).then((data) => this.setMainProductFirstReview(data,products[0].id)) ->리뷰데이터, 상품 인덱스 2개를 같이 보내줌
    this.getMainProductReview(products[1].id).then((data) => this.setMainProductTwoReview(data,products[1].id))
    3. section class ="main__photo" 안에 <a class 첫번째 상품에 관한 리뷰> <b class 두번째 상품에 관한 리뷰> html에 만들어준다
    4. 받아온 리뷰 데이터 들을 setMainProductFirstReview, setMainProductTwoReview에서 각각의 id에 해당 데이터들을 넣어준다
    5. a 태그안에 id 값을 설정해주고 id="aLink" , id="bLink" 받아온 상품의 인덱스를 href 태그로 넣어준다

    Scss에서
    1.main__photo (최상단 상품 데이터 보여주는)여기 말고 .main 에  .main__review--frist,  .main__review--two 클래스 id들을 만들어준다
    2.리뷰 포지션 값은 position: absolute; 준다
    3. main__review--frist:hover, main__review--two:hover 호버했을 때 보여줄 것도 만든다
    */



    //최상단 상품 리뷰 데이터 셋팅(첫번째 상품에 해당 하는 리뷰들)
    //최상단 리뷰 데이터와 해당 상품의 id를 같이 넣어준다
    setMainProductFirstReview = (data,idx) =>{
    // console.log("받아온리뷰댓글id",data)
    // console.log("d첫번째상품indx",idx)
    const { is_next, comment_count, comments } = data


        //undefined, 0, 1, 2
//  console.log("comments[0]",comments[0])
//  console.log("comments]",comments)
    //서버에서 받아온 리뷰 데이터가 3개 일 때, 2개 일 때 1개 일 때 예외처리   
      if(comments[0] == undefined){
        //첫번째 댓글이 없을 때
       this._view.getElement('#mainReviewOneTitle').classList.add('hidden')
       this._view.getElement('#aLink').href  = `/product.html?i=${idx}`
   }
   
   else if(comments[1] == undefined){
       //두번째 댓글이 없을 때
       this._firstComment = this._view.getElement('#firstProductComment').innerHTML = `${comments[0].content} <br><br>`
       this._view.getElement('#aLink').href  = `/product.html?i=${idx}`
   }
   else if(comments[2] == undefined){
       //3번째 댓글이 없을 때
       this._firstComment = this._view.getElement('#firstProductComment').innerHTML = `${comments[0].content} <br><br>`
       this._firstComment1 = this._view.getElement('#firstProductTwoReview').innerHTML = `${comments[1].content}<br><br>`
       this._view.getElement('#aLink').href  = `/product.html?i=${idx}`
   }
   //댓글이 있을 때
   if(comments[0] == 0){
       //첫번째 댓글이 없을 때
       this._firstComment = this._view.getElement('#firstProductComment').innerHTML = `${comments[0].content} <br><br>`
      this._view.getElement('#aLink').href  = `/product.html?i=${idx}`
  }
  
  else if(comments[1] == 1){
      //두번째 댓글이 없을 때
      this._firstComment = this._view.getElement('#firstProductComment').innerHTML = `${comments[0].content} <br><br>`
      this._firstComment1 = this._view.getElement('#firstProductTwoReview').innerHTML = `${comments[1].content}<br><br>`
      this._view.getElement('#aLink').href  = `/product.html?i=${idx}`
  }
  else if(comments[2] == 2){
      //3번째 댓글이 없을 때
      this._firstComment = this._view.getElement('#firstProductComment').innerHTML = `${comments[0].content} <br><br>`
      this._firstComment1 = this._view.getElement('#firstProductTwoReview').innerHTML = `${comments[1].content}<br><br>`
      this._firstComment2 = this._view.getElement('#firstProductThreeReview').innerHTML = `${comments[2].content}<br><br> `
      this._view.getElement('#aLink').href  = `/product.html?i=${idx}`
  }
   else{
       //첫번째 상품 댓글이 3개 다 있을 때
       this._firstComment = this._view.getElement('#firstProductComment').innerHTML = `${comments[0].content} <br><br>`
       this._firstComment1 = this._view.getElement('#firstProductTwoReview').innerHTML = `${comments[1].content}<br><br>`
       this._firstComment2 = this._view.getElement('#firstProductThreeReview').innerHTML = `${comments[2].content}<br><br> `
       this._view.getElement('#aLink').href  = `/product.html?i=${idx}`
   }
   

}
    //최상단 상품 리뷰 데이터 셋팅(두번째 상품에 해당 하는 리뷰들)
    //최상단 리뷰 데이터와 해당 상품의 id를 같이 넣어준다
    setMainProductTwoReview = (data, idx) =>{
    // console.log("받아온리뷰댓글은 222",data)
    // console.log("두번째상품indx",idx)
    const { is_next, comment_count, comments } = data

     //서버에서 받아온 리뷰 데이터가 3개 일 때, 2개 일 때 1개 일 때 예외처리   
    // if(comments[0] !== undefined){
    //     this._comment = this._view.getElement('#twoComment').innerHTML = `Review <br><br> ${comments[0].content}  <br>  `+ `${comments[1].content} <br> ` + `${comments[2].content}`
    //     this._view.getElement('#bLink').href  = `/product.html?i=${idx}`
    // }
    // else if(comments[0] === undefined){
    //     // this._comment = this._view.getElement('#twoComment').innerHTML = `<상품 리뷰>  <br>${comments[0].content} <br>`
    //     this._view.getElement('#bLink').href  = `/product.html?i=${idx}`
    // }
    // else if(comments[1] === undefined){
    //     this._comment = this._view.getElement('#twoComment').innerHTML = `Review <br><br>${comments[0].content} <br>`
    //     this._view.getElement('#bLink').href  = `/product.html?i=${idx}`
    // }
    // else if(comments[2] == undefined){
    //     this._comment = this._view.getElement('#twoComment').innerHTML = `Review <br><br>${comments[0].content} <br>`+ `${comments[1].content}`
    //     this._view.getElement('#bLink').href  = `/product.html?i=${idx}`
    // }
   
    // else{
    //     this._view.getElement('#twoComment').innerHTML = `<상품 리뷰>  <br>${comments[0].content} <br>`+ `${comments[1].content} <br>`  + `${comments[2].content}`
    //     this._view.getElement('#bLink').href  = `/product.html?i=${idx}`
    // }
     //다시
     if(comments[0] == undefined){
         //첫번째 댓글이 없을 때
        this._view.getElement('#mainReviewTwoTitle').classList.add('hidden')
        this._view.getElement('#bLink').href  = `/product.html?i=${idx}`
    }
    
    else if(comments[1] == undefined){
        //두번째 댓글이 없을 때
        this._firstComment = this._view.getElement('#twoComment').innerHTML = `${comments[0].content} <br><br>`
        this._view.getElement('#bLink').href  = `/product.html?i=${idx}`
    }
    else if(comments[2] == undefined){
        //3번째 댓글이 없을 때
        this._firstComment = this._view.getElement('#twoComment').innerHTML = `${comments[0].content} <br><br>`
        this._firstComment1 = this._view.getElement('#twoCommentTwoReview').innerHTML = `${comments[1].content}<br><br>`
        this._view.getElement('#bLink').href  = `/product.html?i=${idx}`
    }
    //댓글이 있을 때
    if(comments[0] == 0){
        //첫번째 댓글이 없을 때
        this._firstComment = this._view.getElement('#twoComment').innerHTML = `${comments[0].content} <br><br>`
       this._view.getElement('#bLink').href  = `/product.html?i=${idx}`
   }
   
   else if(comments[1] == 1){
       //두번째 댓글이 없을 때
       this._firstComment = this._view.getElement('#twoComment').innerHTML = `${comments[0].content} <br><br>`
       this._firstComment1 = this._view.getElement('#twoCommentTwoReview').innerHTML = `${comments[1].content}<br><br>`
       this._view.getElement('#bLink').href  = `/product.html?i=${idx}`
   }
   else if(comments[2] == 2){
       //3번째 댓글이 없을 때
       this._firstComment = this._view.getElement('#twoComment').innerHTML = `${comments[0].content} <br><br>`
       this._firstComment1 = this._view.getElement('#twoCommentTwoReview').innerHTML = `${comments[1].content}<br><br>`
       this._firstComment2 = this._view.getElement('#twoCommentThreeReview').innerHTML = `${comments[2].content}<br><br> `
       this._view.getElement('#bLink').href  = `/product.html?i=${idx}`
   }
   
}

    //개쇼 추천 상품 가져오기
    getRecommendProduct =async (cateIndex)=>{
  
        const reqData = {}
        reqData.page = 1
        reqData.limit = 3
        reqData.fileter = this._expectation
        reqData.category_id =  parseInt(cateIndex)
        // console.log("개쇼추천상품 reqData ",reqData)

        const resData = await this._indexModel.getRecommendProduct(reqData)
        // console.log("가져온개쇼추천상품은?????",resData)
        return resData
    }

    //개쇼 베스트 상품 가져오기
    getBestProduct =async (cateIndex)=>{
        const reqData = {}
        reqData.page = 1
        reqData.limit = 3
        reqData.fileter = this._best
        reqData.category_id =parseInt(cateIndex)
        // console.log("개쇼베스트상품 reqData ",reqData)

        const resData = await this._indexModel.getBestProduct(reqData)
        // console.log("개쇼베스트상품?????",resData)
        return resData
    }

    //개쇼추천상품 셋팅
    setRecommendProductItem = async (data) => {
        // console.log("추천상품셋팅중",data)
        const { is_next, product_count, products } = data

        
        
        const itemWrap = this._view.getElement('#itemWrap')

        //기존 상품데이터 지우기
        while (itemWrap.hasChildNodes()) {
            itemWrap.removeChild(itemWrap.firstChild)
        }
        // console.log(data)
        if (product_count == 0) {
            // 상품 없음
            const item = this._indexItem.createEmptyListItem()
            itemWrap.appendChild(item)
        } else {
            products.map((itemData) => {
                const item = this._indexItem.createStoreListItem(itemData)
                // console.log(itemData)
                itemWrap.appendChild(item)
            })
        }

      

    }


    //개쇼 베스트 상품 셋팅
    setBestProductItem = async (data) => {
        // console.log(data)
        const { is_next, product_count, products } = data

        const itemWrap = this._view.getElement('#itemBestWrap')

        //기존 상품데이터 지우기
        while (itemWrap.hasChildNodes()) {
            itemWrap.removeChild(itemWrap.firstChild)
        }
        // console.log(data)
        if (product_count == 0) {
            // 상품 없음
            const item = this._indexItem.createEmptyListItem()
            itemWrap.appendChild(item)
        } else {
            products.map((itemData) => {
                const item = this._indexItem.createBestListItem(itemData)
                // console.log(itemData)
                itemWrap.appendChild(item)
            })
        }


    }


    //오늘의 워크스페이스
    getTodayData = async () => {
        const reqData = this._indexModel._worksData
        // 필수 데이터 넣기
        reqData.category_id =  this._categoryId
        reqData.page = this._nowPage
        reqData.limit = this._limit
        reqData.type = this._typeToday
        
        const resData = await this._indexModel.getWorksData(reqData)
        // console.log("오늘의워크스페이스",resData)
        this._resData = resData

        return resData
        // this.setTodayWorksItem(resData)

    }

    //인기 워크스페이스
    getPopularData = async () => {
        const reqData = this._indexModel._worksData
        // 필수 데이터 넣기
        reqData.category_id =  this._categoryId
        reqData.page = this._nowPage
        reqData.limit = this._limit
        reqData.type = this._typePopular
        
        const resData = await this._indexModel.getWorksData(reqData)
        // console.log("인기워크스페이스",resData)
        this._resData = resData

        return resData
    }

    
        
  

    

    //오늘의워크스페이스 셋팅
    setTodayWorksItem = async (resData) => {
        console.log(resData)
        const { is_next, post_count, posts } = resData
        // console.log("셋팅 post_count",post_count)
        // console.log("셋팅 posts ",posts)
        // console.log("셋팅 is_next",is_next)
      

        if(post_count == 1){
            this._firstTitle = this._view.getElement('#firstTitle').innerHTML = posts[0].title
            this._thumbnail =this._view.getElement('#firstThumbnail')
            this._thumbnail.src = posts[0].thumbnail
            //좋아요, 북마크
            this._firstLiked = this._view.getElement('#firstLiked').innerHTML = posts[0].liked
            this._firstBookmark = this._view.getElement('#firstBookmark').innerHTML = posts[0].bookmark_count
            //작성자 닉네임, 프로필사진
            this._firstProfileImage = this._view.getElement('#firstProfileImage').src = posts[0].profile_image_url
            this._firstNickname = this._view.getElement('#firstNickname').innerHTML = posts[0].profile_nickname
            //공유 수, 댓글 수, 조회수
            this._firstShare = this._view.getElement('#firstShare').innerHTML = `공유 ${posts[0].share_count} 회`
            this._firstComment = this._view.getElement('#firstComment').innerHTML = `댓글 ${posts[0].comment_count} 개`
            this._firstView = this._view.getElement('#firstView').innerHTML = `조회수 ${posts[0].view_count}`
          
    
            //첫번째 워크스페이스 이동
            this._view.getElement('#firstClick').onclick = () => {
                
                window.location.href = `./workspace.html?n=${posts[0].post_id}`
            }
        }
        
        else if(post_count == 2){
            //첫번째, 두번째데이터
            this._firstTitle = this._view.getElement('#firstTitle').innerHTML = posts[0].title
            this._thumbnail =this._view.getElement('#firstThumbnail')
            this._thumbnail.src = posts[0].thumbnail
            //좋아요, 북마크
            this._firstLiked = this._view.getElement('#firstLiked').innerHTML = posts[0].liked
            this._firstBookmark = this._view.getElement('#firstBookmark').innerHTML = posts[0].bookmark_count
            //작성자 닉네임, 프로필사진
            this._firstProfileImage = this._view.getElement('#firstProfileImage').src = posts[0].profile_image_url
            this._firstNickname = this._view.getElement('#firstNickname').innerHTML = posts[0].profile_nickname
            //공유 수, 댓글 수, 조회수
            this._firstShare = this._view.getElement('#firstShare').innerHTML = `공유 ${posts[0].share_count} 회`
            this._firstComment = this._view.getElement('#firstComment').innerHTML = `댓글 ${posts[0].comment_count} 개`
            this._firstView = this._view.getElement('#firstView').innerHTML = `조회수 ${posts[0].view_count}`
          
    
            //첫번째 워크스페이스 이동
            this._view.getElement('#firstClick').onclick = () => {
                
                window.location.href = `./workspace.html?n=${posts[0].post_id}`
            }
            //두번째
            //제목, 사진
            this._twoTitle = this._view.getElement('#twoTitle').innerHTML =  posts[1].title
            this._twoThumbnail = this._view.getElement('#twoThumbnail').src =  posts[1].thumbnail
            //작성자 닉네임, 프로필사진
            this._twoProfileImage = this._view.getElement('#twoProfileImage').src =  posts[1].profile_image_url
            this._twoNickname = this._view.getElement('#twoNickname').innerHTML =  posts[1].profile_nickname
            
            //두번째 워크스페이스 이동
            this._view.getElement('#twoClick').onclick = () => {
                
                window.location.href = `./workspace.html?n=${posts[1].post_id}`
            }
        }
        else if(post_count >= 3){
            //첫번째, 두번째, 세번째 데이터
             //첫번째, 두번째데이터
             this._firstTitle = this._view.getElement('#firstTitle').innerHTML = posts[0].title
             this._thumbnail =this._view.getElement('#firstThumbnail')
             this._thumbnail.src = posts[0].thumbnail
             //좋아요, 북마크
             this._firstLiked = this._view.getElement('#firstLiked').innerHTML = posts[0].liked
             this._firstBookmark = this._view.getElement('#firstBookmark').innerHTML = posts[0].bookmark_count
             //작성자 닉네임, 프로필사진
             this._firstProfileImage = this._view.getElement('#firstProfileImage').src = posts[0].profile_image_url
             this._firstNickname = this._view.getElement('#firstNickname').innerHTML = posts[0].profile_nickname
             //공유 수, 댓글 수, 조회수
             this._firstShare = this._view.getElement('#firstShare').innerHTML = `공유 ${posts[0].share_count} 회`
             this._firstComment = this._view.getElement('#firstComment').innerHTML = `댓글 ${posts[0].comment_count} 개`
             this._firstView = this._view.getElement('#firstView').innerHTML = `조회수 ${posts[0].view_count}`
           
     
             //첫번째 워크스페이스 이동
             this._view.getElement('#firstClick').onclick = () => {
                 
                 window.location.href = `./workspace.html?n=${posts[0].post_id}`
             }
             //두번째
             //제목, 사진
             this._twoTitle = this._view.getElement('#twoTitle').innerHTML =  posts[1].title
             this._twoThumbnail = this._view.getElement('#twoThumbnail').src =  posts[1].thumbnail
             //작성자 닉네임, 프로필사진
             this._twoProfileImage = this._view.getElement('#twoProfileImage').src =  posts[1].profile_image_url
             this._twoNickname = this._view.getElement('#twoNickname').innerHTML =  posts[1].profile_nickname
             
             //두번째 워크스페이스 이동
             this._view.getElement('#twoClick').onclick = () => {
                 
                 window.location.href = `./workspace.html?n=${posts[1].post_id}`
             }
             //세번째
              //제목, 사진
        this._threeTitle = this._view.getElement('#threeTitle').innerHTML =  posts[2].title
        this._threeThumbnail = this._view.getElement('#threeThumbnail').src =  posts[2].thumbnail
        //작성자 닉네임, 프로필사진
        this._threeProfileImage = this._view.getElement('#threeProfileImage').src =  posts[2].profile_image_url
        this._threeNickname = this._view.getElement('#threeNickname').innerHTML =  posts[2].profile_nickname

        //세번째 워크스페이스 이동
        this._view.getElement('#threeClick').onclick = () => {
            
            window.location.href = `./workspace.html?n=${ posts[2].post_id}`
        }
        }

        else if(post_count == 0){
            //데이터 없을 때
        }


        return resData

    }

    //인기워크스페이스 셋팅
    setPopularItem = async (resData) =>{
        console.log(resData)
        const { is_next, post_count, posts } = resData
        // console.log("셋팅 post_count",post_count)
        // console.log("인기 posts ",posts)

        if(post_count == 1){
            //첫번째 데이터만 올 떄
        this._firstTitle = this._view.getElement('#popularTitle').innerHTML = posts[0].title
        this._thumbnail =this._view.getElement('#popularImage')
        this._thumbnail.src = posts[0].thumbnail
        //좋아요, 북마크
        this._firstLiked = this._view.getElement('#popularLike').innerHTML = posts[0].liked
        this._firstBookmark = this._view.getElement('#popularBookmark').innerHTML = posts[0].bookmark_count
        //작성자 닉네임, 프로필사진
        this._firstProfileImage = this._view.getElement('#popularProfileImage').src = posts[0].profile_image_url
        this._firstNickname = this._view.getElement('#popularNickname').innerHTML = posts[0].profile_nickname
        //공유 수, 댓글 수, 조회수
        this._firstShare = this._view.getElement('#popularShare').innerHTML = `공유 ${posts[0].share_count} 회`
        this._firstComment = this._view.getElement('#popularComment').innerHTML =`댓글 ${posts[0].comment_count} 개`
        this._firstView = this._view.getElement('#popularView').innerHTML = `조회수 ${posts[0].view_count}`
      

        //첫번째 워크스페이스 이동
        this._view.getElement('#popularClick').onclick = () => {
            
            window.location.href = `./workspace.html?n=${posts[0].post_id}`
        // }
        }
    }
    else if(post_count == 2){
        //첫번째, 두번째 데이터

        //첫번째데이터
        this._firstTitle = this._view.getElement('#popularTitle').innerHTML = posts[0].title
        this._thumbnail =this._view.getElement('#popularImage')
        this._thumbnail.src = posts[0].thumbnail
        //좋아요, 북마크
        this._firstLiked = this._view.getElement('#popularLike').innerHTML = posts[0].liked
        this._firstBookmark = this._view.getElement('#popularBookmark').innerHTML = posts[0].bookmark_count
        //작성자 닉네임, 프로필사진
        this._firstProfileImage = this._view.getElement('#popularProfileImage').src = posts[0].profile_image_url
        this._firstNickname = this._view.getElement('#popularNickname').innerHTML = posts[0].profile_nickname
        //공유 수, 댓글 수, 조회수
        this._firstShare = this._view.getElement('#popularShare').innerHTML = `공유 ${posts[0].share_count} 회`
        this._firstComment = this._view.getElement('#popularComment').innerHTML =`댓글 ${posts[0].comment_count} 개`
        this._firstView = this._view.getElement('#popularView').innerHTML = `조회수 ${posts[0].view_count}`
      

        //첫번째 워크스페이스 이동
        this._view.getElement('#popularClick').onclick = () => {
            
            window.location.href = `./workspace.html?n=${posts[0].post_id}`
        // }
        }

        //두번째데이터
        this._twoTitle = this._view.getElement('#popularTwoTitle').innerHTML =  posts[1].title
        this._twoThumbnail = this._view.getElement('#popularTwoImage').src =  posts[1].thumbnail
        //작성자 닉네임, 프로필사진
        this._twoProfileImage = this._view.getElement('#popularTwoProfileImage').src =  posts[1].profile_image_url
        this._twoNickname = this._view.getElement('#popularTwoNickname').innerHTML =  posts[1].profile_nickname
        
        //두번째 워크스페이스 이동
        this._view.getElement('#popularTwoClick').onclick = () => {
            
            window.location.href = `./workspace.html?n=${ posts[1].post_id}`
        }
        
    }
    
    else if (post_count >= 3 ){
        //첫번째, 두번째, 세번째 데이터, 
 //첫번째데이터
        this._firstTitle = this._view.getElement('#popularTitle').innerHTML = posts[0].title
        this._thumbnail =this._view.getElement('#popularImage')
        this._thumbnail.src = posts[0].thumbnail
        //좋아요, 북마크
        this._firstLiked = this._view.getElement('#popularLike').innerHTML = posts[0].liked
        this._firstBookmark = this._view.getElement('#popularBookmark').innerHTML = posts[0].bookmark_count
        //작성자 닉네임, 프로필사진
        this._firstProfileImage = this._view.getElement('#popularProfileImage').src = posts[0].profile_image_url
        this._firstNickname = this._view.getElement('#popularNickname').innerHTML = posts[0].profile_nickname
        //공유 수, 댓글 수, 조회수
        this._firstShare = this._view.getElement('#popularShare').innerHTML = `공유 ${posts[0].share_count} 회`
        this._firstComment = this._view.getElement('#popularComment').innerHTML =`댓글 ${posts[0].comment_count} 개`
        this._firstView = this._view.getElement('#popularView').innerHTML = `조회수 ${posts[0].view_count}`
      

        //첫번째 워크스페이스 이동
        this._view.getElement('#popularClick').onclick = () => {
            
            window.location.href = `./workspace.html?n=${posts[0].post_id}`
        // }
        }

        //두번째데이터
        this._twoTitle = this._view.getElement('#popularTwoTitle').innerHTML =  posts[1].title
        this._twoThumbnail = this._view.getElement('#popularTwoImage').src =  posts[1].thumbnail
        //작성자 닉네임, 프로필사진
        this._twoProfileImage = this._view.getElement('#popularTwoProfileImage').src =  posts[1].profile_image_url
        this._twoNickname = this._view.getElement('#popularTwoNickname').innerHTML =  posts[1].profile_nickname
        
        //두번째 워크스페이스 이동
        this._view.getElement('#popularTwoClick').onclick = () => {
            
            window.location.href = `./workspace.html?n=${ posts[1].post_id}`
        }

        //세번째
        //제목, 사진
        this._threeTitle = this._view.getElement('#popularThreeTitle').innerHTML =  posts[2].title
        this._threeThumbnail = this._view.getElement('#popularThreeImage').src =  posts[2].thumbnail
        //작성자 닉네임, 프로필사진
        this._threeProfileImage = this._view.getElement('#popularThreeProfileImage').src =  posts[2].profile_image_url
        this._threeNickname = this._view.getElement('#popularThreeNickname').innerHTML =  posts[2].profile_nickname

        //세번째 워크스페이스 이동
        this._view.getElement('#popularThreeClick').onclick = () => {
            
            window.location.href = `./workspace.html?n=${ posts[2].post_id}`
        }
    }
    //데이터가 없을 때
    else if(post_count == 0){

    }



        return resData
    }

    //오늘의 인기키워드 가져오기
    getTodayPopularKeywords = async () =>{

        const resData = await this._indexModel.getKeyword()
        // console.log("키워드",resData)
        // this.setTodayPopularKeywords()
        return resData
    }

    //키워드셋팅
    setTodayPopularKeywords = async (data) =>{

        // console.log("키워드데이터",data)
        // const { keywords } = data
        //  console.log("keywords",keywords)
       
         const todayKeyword = this._view.getElement('#todayKeyword')
        //  console.log(todayKeyword)
        
         data.keywords.map((itemData) => {
             const item = this._indexItem.createTodayKeyword(itemData)
            //  console.log("키워드파싱",item)
            //  document.getElementById('#todayUpKeyword').appendChild(todayKeyword);
            todayKeyword.appendChild(item)
         })
    }
}