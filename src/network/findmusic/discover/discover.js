import { request } from "../../request";
// 获取轮播图
export function getBanner() {
	return request({
		url: "/banner",
	});
}
// 获取推荐歌单
export function getPersonalized(limit) {
	return request({
		url: "/personalized",
		params: {
			limit,
			timestamp: Date.parse(new Date()),
		},
	});
}
export function getRecommend() {
	return request({
		url: "/recommend/resource",
		params: {
			timestamp: Date.parse(new Date()),
		},
	});
}
//独家放送入口
export function getPrivatecontent() {
	return request({
		url: "personalized/privatecontent",
	});
}
// 获取每日推荐新音乐
export function getNewsong(limit) {
	return request({
		url: "/personalized/newsong",
		params: {
			limit,
		},
	});
}
// 获取每日推荐新MV
export function getNewmv() {
	return request({
		url: "/personalized/mv",
	});
}
