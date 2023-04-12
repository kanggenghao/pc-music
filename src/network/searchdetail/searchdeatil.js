import {request} from "../request"
// 获取搜索热榜列表
export function getSearchHotWord(){
    return request({
        url:'/search/hot/detail'
    })
}
// 获取搜索内容
// type  1: 单曲, 10: 专辑, 100: 歌手, 1000: 歌单, 1002: 用户, 1004: MV, 1006: 歌词, 1009: 电台, 1014: 视频, 1018:综合
export function getSearcDetail(keywords,type,offset,limit=30){
    return request({
        url:'/cloudsearch',
        params:{
            keywords,
            type,
            offset,
            limit
        }
    })
}
// 获取搜索结果最佳匹配
export function getGoodMatch(keywords){
    return request({
        url:'/search/multimatch',
        params:{
            keywords,
        }
    })
}
// 获取搜索单曲
export function getSearchSong(keywords,offset,type=1,limit=50){
    return request({
        url:'/cloudsearch',
        params:{
            keywords,
            offset,
            type,
            limit
        }
    })
}
// 获取搜索专辑
export function getSearchAlbum(keywords,offset,type=10,limit=30){
    return request({
        url:'/cloudsearch',
        params:{
            keywords,
            offset,
            type,
            limit
        }
    })
}
// 获取搜索歌手
export function getSearchSinger(keywords,offset,type=100,limit=30){
    return request({
        url:'/cloudsearch',
        params:{
            keywords,
            offset,
            type,
            limit
        }
    })
}
// 获取搜索歌单
export function getSearchSongList(keywords,offset,type=1000,limit=30){
    return request({
        url:'/cloudsearch',
        params:{
            keywords,
            offset,
            type,
            limit
        }
    })
}
// 获取搜索MV
export function getSearchMv(keywords,offset,type=1004,limit=40){
    return request({
        url:'/cloudsearch',
        params:{
            keywords,
            offset,
            type,
            limit
        }
    })
}
// 获取搜索视频
export function getSearchVideo(keywords,offset,type=1014,limit=40){
    return request({
        url:'/cloudsearch',
        params:{
            keywords,
            offset,
            type,
            limit
        }
    })
}