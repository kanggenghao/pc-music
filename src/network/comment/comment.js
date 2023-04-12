import {request} from '../request'

// 获取所有资源热门评论(有的歌单会没有数据)
export function getHotComment(type,id,offset){
    return request({
        url:'/comment/hot',
        params:{
            type,
            id,
            offset,
            limit:60,
            timestamp:Date.parse(new Date())
        }
    })
}
// 获取最新评论（封装了一下，传入资源类型，用作判断）
export function getNewCommentList(type,id, offset) {
    return request({
      url: `/comment/${type}`,
      params: {
        id,
        offset,
        limit: 60,
        timestamp:Date.parse(new Date())
      },
    });
  }
// 获取评论的通用接口，但是返回的评论数据没有被回复的评论（上面的获取热门评论没有数据时使用这个接口）
export function getComment(type,id,pageNo){
    return request({
        url:'/comment/new',
        params:{
            type,
            id,
            pageNo,
            sortType:2,
            pageSize:60,
            timestamp:Date.parse(new Date())
        }
    })
}
// 发送评论
export function sendComment(type,id,content){
    return request({
        url:'/comment',
        params:{
            t:1,
            type,
            id,
            content,
            timestamp:Date.parse(new Date())
        }
    })
}
// 回复评论
export function replyComment(type,id,content,commentId){
    return request({
        url:'/comment',
        params:{
            t:2,
            type,
            id,
            content,
            commentId,
            timestamp:Date.parse(new Date())
        }
    })
}
// 给评论点赞
export function isLikeComment(id,type,t,cid){
    return request({
        url:'/comment/like',
        params:{
            id,
            type,
            t, //1 为点赞 ,0 为取消点赞
            cid,
            timestamp:Date.parse(new Date())
        }
    })
}
