import { request } from "../request";
// 获取歌单详情
export function getSongListDetail(id) {
  return request({
    url: "/playlist/detail",
    params: {
      id,
      timestamp:Date.parse(new Date())
    },
  });
}
// 获取每首歌的详细信息
export function getEverySongDetail(ids) {
  return request({
    url: "/song/detail",
    params: {
      ids, //音乐id(支持多个id, 用 , 隔开)
    },
  });
}
// 获取歌单的收藏者
export function getSongListSubscribers(id, offset) {
  return request({
    url: "/playlist/subscribers",
    params: {
      id,
      offset,
      limit: 48,
    },
  });
}


// 收藏/取消收藏歌单
export function subSongList(t, id) {
  return request({
    url: "/playlist/subscribe",
    params: {
      t,
      id,
      timestamp:Date.parse(new Date())
    },
  });
}
