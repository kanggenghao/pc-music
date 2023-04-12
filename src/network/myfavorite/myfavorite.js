import {request} from "../request";
// 获取收藏的专辑
export function getSubAlbum(){
    return request({
        url:'/album/sublist',
        params:{
            timestamp:Date.parse(new Date()),
            limit:48
        }
        
    })
}
// 收藏的歌手
export function getSubSinger(){
    return request({
        url:'/artist/sublist',
        params:{
            timestamp:Date.parse(new Date()),
            limit:48
        }
    })
}
// 收藏的Mv和视频
export function getSubMv(){
    return request({
        url:'/mv/sublist',
        params:{
            timestamp:Date.parse(new Date()),
            limit:40
        }
    })
}
