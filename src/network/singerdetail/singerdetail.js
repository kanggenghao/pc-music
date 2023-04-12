import { request } from "../request";
// 获取歌手详情
export function getSingerDetail(id){
    return request({
        url:"/artist/detail",
       params:{
           id,
       }
    })
}
// 获取歌手热门歌曲50首
export function getSingerHotSong(id){
    return request({
        url:"/artists",
       params:{
           id
       }
    })
}
// 获取歌手专辑
export function getSingerAlbum(id,offset,limit=30){
    return request({
        url:"/artist/album",
       params:{
           id,
           offset,
           limit
       }
    })
}
// 获取歌手MV
export function getSingerMv(id,offset,limit=40){
    return request({
        url:"/artist/mv",
       params:{
           id,
           offset,
           limit
       }
    })
}
// 获取相似歌手
export function getSingerSimilar(id){
    return request({
        url:"/simi/artist",
        params:{
            id
        }
     
    })
}
// 收藏/取消收藏歌手
export function subSinger(t,id){
    return request({
        url:"/artist/sub",
        params:{
            t,
            id,
            timestamp:Date.parse(new Date())
        }
     
    })
}