import { request } from "../request";

// 获取专辑歌曲
export function getAlbumSong(id){
    return request({
        url:"/album",
        params:{
            id,
        }
    })
}

// 获取专辑动态信息
export function getAlbumDynamic(id){
    return request({
        url:"/album/detail/dynamic",
        params:{
            id,
        }
    })
}

// 收藏/取消收藏专辑
export function subAlbum(t,id){
    return request({
        url:'/album/sub',
        params:{
            t,
            id,
            timestamp:Date.parse(new Date()),
        }
    })
}

