import Model from '../Core/Mvc/Model.js'
export default class checkUserModel extends Model {
    constructor() {
        super()
        //registered_type
        this._typeEmail = 'email'
        this._typeGithub = 'github'
        this._typeGoogle = 'gmail'
        this._typeKakao = 'kakao'
        this._typeNaver = 'naver'
    }

    reqData = {
        registered_type: ''
    }

    //가입여부체크
    //회원가입 및 로그인 할 때 가입여부 체크해야 함
    //자체 회원가입이든, 소셜 회원가입이든 중복된 이메일로는 가입할 수 없음
    //자체 회원가입 일 때 가입여부 체크
    checkUser = async () => {
        // console.log(this.reqData)
        try {
            const res = await this.postRequest('/users/check', this.reqData)
            if (!res) throw 'checkUser : reasponse is empty!'
            if (!res.message) throw 'checkUser : message is empty'
            return res
        } catch (e) {
            console.log(e)
            return null
        }
    }
}
