import {request} from "../../request"

// 获取精品歌单标签列表
export function getTopHighqualityTag(){
    return request({
        url:"/playlist/highquality/tags"       
    })
}

// 获取顶部精品歌单
export function getTopHighquality(cat){
    return request({
        url:"/top/playlist/highquality",
        params:{
            cat,
            limit:1
        }
    })
}
// 获取所有歌单分类标签
export function getAllTag(){
    return request({
        url:"/playlist/catlist",
    })
}
// 获取热门歌单分类标签
export function getHotTag(){
    return request({
        url:"/playlist/hot",
     
    })
}

// 获取歌单
export function getSongList(cat,offset){
    return request({
        url:"/top/playlist",
        params:{
            cat,
            offset, //用于分页 （页码 -1）* limit
            limit:48,
        }
     
    })
}