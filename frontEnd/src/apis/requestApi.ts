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

export function historyApi(data:any) {
    return request({
        url: '/fss/web/facility-data!selectFacilityDataList.sv',
        method: 'post',
        data:data
    })
}

export function manageApi(data:any) {
    return request({
        url: '/fss/web/facility-list!selectFacilityList.sv',
        method: 'post',
        data:data
    })
}

export function editApi(data:any) {
    return request({
        url: '/fss/web/facility!editFacility.sv',
        method: 'post',
        data:data
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

export function systemApi() {
    return request({
        url: '/fss/web/system-setting!getSettingInfo.sv',
        method: 'post'
    })
}

export function systemSaveApi(data:any) {
    return request({
        url: '/fss/web/system-setting!updateSettingInfo.sv',
        method: 'post',
        data:data
    })
}