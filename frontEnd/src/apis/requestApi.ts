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

export function editApi(user:any) {
    return request({
        url: '/fss/web/facility!editFacility.sv',
        method: 'post',
        data:user
    })
}

export function selectPatientApi() {
    return request({
        url: '/fss/web/facility-data!selectPatientList.sv',
        method: 'post'
    })
}

export function selectServerApi() {
    return request({
        url: '/fss/web/facility-data!selectFacilityServerList.sv',
        method: 'post'
    })
}

export function selectFacilityTypeApi() {
    return request({
        url: '/fss/web/facility-data!selectFacilityTypeList.sv',
        method: 'post'
    })
}

export function systemApi(user:any) {
    return request({
        url: '/fss/sys/XXX',
        method: 'post',
        data:user
    })
}
