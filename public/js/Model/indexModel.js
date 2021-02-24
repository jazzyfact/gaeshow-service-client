import Model from '../Core/Mvc/Model.js'

export default class indexModel extends Model{
    constructor(){
        super()

        //기본주소
        this._originalUrl = '/posts'
        //필수데이터
        //오늘의워크스페이스,인기워크스페이스
        this._worksData = {
            page : '',
            limit :'',
            category_id : '',
            type :'',
        }

        //상품목록조회주소
        this._productUrl = '/products'

        //키워드주소
        this._keywrodUrl = '/searchs'

        this._productData = {
            page : '',
            limit : '',
            fileter : ''
        }
    }

    //워크스페이스 가져오기
    getWorksData = async (data) =>{
        try{
            const res = await this.getRequest(this._originalUrl, data)
            if (!res) throw '게시물 요청 실패!'
            return res
        }catch(e){
            console.error(e)
        }
    }

    getBestProduct = async (data) =>{

        try{
            const res = await this.getRequest(this._productUrl, data)
            // console.log('요청한 베스트 데이터',res)
            if (!res) throw '게시물 요청 실패!'
            return res
        }catch(e){
            console.error(e)
        }
    }

    getRecommendProduct = async (data) =>{

        try{
            const res = await this.getRequest(this._productUrl, data)
            // console.log('요청한 추천 데이터',res)
            if (!res) throw '게시물 요청 실패!'
            return res
        }catch(e){
            console.error(e)
        }
    }

    getMainReview = async (data) =>{

        try{
            const res = await this.getRequest(this._productUrl, data)
            // console.log('요청한 메인 상품 데이터 res',res)
            // console.log('요청한 메인 상품 데이터 데이터',data)
            if (!res) throw '게시물 요청 실패!'
            return res
        }catch(e){
            console.error(e)
        }
    }


    getKeyword = async () =>{
        try{
            const res = await this.getRequest(this._keywrodUrl)
            // console.log('요청한 메인 상품 데이터 res',res)
            // console.log('요청한 메인 상품 데이터 데이터',data)
            if (!res) throw '키워드 요청 실패!'
            return res
        }catch(e){
            console.error(e)
        }
    }
}