import { request } from "../../request";
// 获取歌手列表
export function getSinger(area,type,initial,offset){
    return request({
        url:"/artist/list",
        params:{
            area,
            type,
            initial,
            offset,
            limit:48
        }
    })
}
