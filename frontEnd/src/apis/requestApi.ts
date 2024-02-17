import { request } from '../utils/request'

export function loginApi(userId:string,password:string) {
    return request({
        url: '/fss/welcome!login.sv?userId='+userId+'&password='+password,
        method: 'get'
    })
}

// export function loginApi(data:any) {
//     return request({
//         url: '/welcome!login.sv',
//         method: 'post',
//         data:data
//     })
// }

export function historyApi(user:any) {
    return request({
        url: '/fss/web/facility-data!selectFacilityDataList.sv',
        method: 'post',
        data:user
    })
}

export function manageApi(user:any) {
    return request({
        url: '/fss/web/facility-list!selectFacilityList.sv',
        method: 'post',
        data:user
    })
}

export function addApi(user:any) {
    return request({
        url: '/fss/web/facility!editFacility.sv',
        method: 'post',
        data:user
    })
}

export function systemApi(user:any) {
    return request({
        url: '/fss/sys/login',
        method: 'post',
        data:user
    })
}
