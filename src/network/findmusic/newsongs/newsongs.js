import {request} from "../../request";
// 获取新歌速递
export function getNewSongs(type){
    return request({
        url:'/top/song',
        params:{
            type
        }
    })
}
// 获取新碟上架
export function getNewAlbum(offset,area){
    return request({
        url:'/album/new',
        params:{
            offset,
            area,
            limit:50
        }
    })
}
