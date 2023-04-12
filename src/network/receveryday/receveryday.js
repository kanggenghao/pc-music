import {request} from '../request'
// 获取每日推荐歌曲（要登陆）
export function getRecSongs(){
    return request({
        url:'/recommend/songs',
    })
}
// 获取每日推荐歌单
export function getRecSongList(){
    return request({
        url:'/personal_fm',
    })
}