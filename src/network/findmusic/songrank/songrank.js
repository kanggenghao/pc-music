import { request } from "../../request";

// 所有榜单内容摘要
export function getAllRankInfo(){
    return request({
        url:"/toplist/detail"
    })
}
export function getAllRank(){
    return request({
        url:"/toplist"
    })
}