<template>
	<div class="discover">
		<!-- 轮播图 -->
		<Banner :banner="banner" />
		<!-- 推荐歌单 -->
		<Personalized :personalized="personalized" />
		<!-- 推荐MV -->
		<NewMv :newmv="newmv" />
		<!-- 最新音乐 -->
		<RecNewSong :newsong="newsong" />
		<!-- 独家放送 -->
		<Privatecontent :privatecontent="privatecontent" />
	</div>
</template>

<script>
// 网络请求
import { getBanner, getPersonalized, getPrivatecontent, getRecommend, getNewsong, getNewmv } from "network/findmusic/discover/discover";
// 子组件
import Banner from "./Childcomps/Banner.vue";
import Personalized from "./Childcomps/Personalized.vue";
import Privatecontent from "./Childcomps/Privatecontent.vue";
import RecNewSong from "./Childcomps/RecNewSong.vue";
import NewMv from "./Childcomps/NewMv.vue";
import { mapGetters } from "vuex";
export default {
	name: "Discover",
	components: { Banner, Personalized, Privatecontent, RecNewSong, NewMv },
	data() {
		return {
			banner: [], //轮播图数据
			personalized: [], //推荐歌单
			privatecontent: [], //独家放送
			newsong: [], //每日推荐新音乐
			newmv: [],
		};
	},
	computed: {
		...mapGetters(["isLogin"]),
	},
	created() {
		// 获取轮播图数据
		getBanner().then(res => {
			this.banner = res.data.banners;
		});
		this.getRecommendBy();
	},
	methods: {
		// 获取推荐歌单
		getRecommendBy() {
			if (this.isLogin) {
				getRecommend().then(res => {
					let recommend = res.data.recommend;
					let limit = 18 - recommend.length;
					getPersonalized(limit).then(res => {
						this.personalized = [...recommend, ...res.data.result];
						this.getRecOther();
					});
				});
			} else {
				getPersonalized(18).then(res => {
					this.personalized = res.data.result;
					this.getRecOther();
				});
			}
		},
		getRecOther() {
			// 获取每日推荐新音乐
			getNewsong(15)
				.then(res => {
					this.newsong = res.data.result;
				})
				.catch(err => err);
			// 获取独家放送入口数据
			getPrivatecontent().then(res => {
				this.privatecontent = res.data.result;
			});
			// 获取推荐MV
			getNewmv().then(res => {
				this.newmv = res.data.result;
			});
		},
	},
	watch: {
		isLogin() {
			this.getRecommendBy();
		},
	},
};
</script>
<style lang="less" scoped></style>
