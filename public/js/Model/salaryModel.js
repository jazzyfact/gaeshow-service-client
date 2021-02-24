import Model from '../Core/Mvc/Model.js'

export default class salaryModel extends Model {
    constructor() {
        super()
    }

    reqSalary = {
        job_filter: '',
        experience_years_filter: ''
    }

    getSalaryData = async (data) => {
        try {
            const res = await this.getRequest('/posts/salaries', data)
            if (!res) throw '연봉 조회 실패'
            return res
        } catch (e) {
            console.error(e)
        }
    }

    getSalaryTop3 = async () => {
        try {
            const res = await this.getRequest('/posts/salaries/top')
            if (!res) throw 'top3 연봉 조회 실패'
            return res
        } catch (e) {
            console.error(e)
        }
    }
}
