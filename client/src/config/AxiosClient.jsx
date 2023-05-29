import axios from 'axios'

const AxiosClient = axios.create({
    baseURL: `/api`
})

export default AxiosClient