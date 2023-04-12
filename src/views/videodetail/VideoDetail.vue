<template>
	<div class="video-detail w">
		<div class="left-detail">
			<h2 style="padding-bottom: 15px" v-if="$route.params.type == 'mv'">MV详情</h2>
			<h2 style="padding-bottom: 15px" v-else>视频详情</h2>
			<!-- 视频播放器 -->
			<div class="video-play">
				<video :src="mvUrl || videoUrl" controls="controls" autoplay="autoplay" loop="loop"></video>
			</div>
			<!-- 视频信息 -->
			<Videoinfo :videoinfo="videoinfo" :type="$route.params.type" :is-sub="isSub" :islike="isLikeInfo.liked" @subMvBy="subMvBy" @likeVideoBy="likeVideoBy" />
			<!-- 视频评论 -->
			<div class="video-comment" ref="comment">
				<h3 style="padding-bottom: 5px">评论</h3>
				<CommentPage :comment-type="commentType" :commentres-id="id" @changePage="changePage" />
			</div>
		</div>
		<!-- 右侧相关视频推荐 -->
		<div class="right-recvideo">
			<Similarvideo :similarvideo="similarvideo" :type="$route.params.type" />
		</div>
	</div>
</template>

<script>
/* 网络请求 */
import {
	/* MV */
	getMvDetail,
	getSimiMv,
	getMvUrl,
	subMv,
	getMvLikeInfo,
	/* 视频 */
	getVideoDetail,
	getSimiVideo,
	getVideoUrl,
	subVideo,
	likeVideo,
	getVideoLikeInfo,
} from "network/recvideo/recvideo";
import { getSubMv } from "network/myfavorite/myfavorite";
/* vuex */
import { mapGetters } from "vuex";
/* 子组件 */
import Videoinfo from "./Childcomps/Videoinfo.vue";
import CommentPage from "components/content/comment/commentPage.vue";
import Similarvideo from "./Childcomps/Similarvideo.vue";
export default {
	inject: ["reload"],
	name: "VideoDetail",
	components: { Videoinfo, CommentPage, Similarvideo },
	data() {
		return {
			id: "",
			type: "",
			videoinfo: {}, //视频信息
			similarvideo: [], //相似视频
			mvUrl: "",
			videoUrl: "",
			isSub: false, //是否收藏了该视频
			isLikeInfo: {}, //是否点赞的信息
			commentType: Number, //评论类型
		};
	},
	computed: {
		...mapGetters(["subMvlist"]),
	},
	created() {
		document.querySelector(".view").scrollTop = 0;
		// 保存路由传过来的id
		this.id = this.$route.params.id;
		// 视频类型
		this.type = this.$route.params.type;
		if (this.type == "mv") {
			this.commentType = 1; //评论类型是mv
			//.* MV数据 */
			// 获取MV详情数据
			this.getMvDetailBy();
			// 获取相似mv
			this.getSimiMvBy();
			// 获取mv播放地址
			this.getMvUrlBy();
			// 获取mv点赞数据
			this.getMvLikeInfoBy();
		} else if (this.type == "video") {
			this.commentType = 5; //评论类型是视频
			//.* 视频数据 */
			// 获取视频详情数据
			this.getVideoDetailBy();
			// 获取相关视频
			this.getSimiVideoBy();
			//  获取视频播放地址
			this.getVideoUrlBy();
			// 获取视频点赞数据
			this.getVideoLikeInfoBy();
		}
		// 获取收藏的视频MV列表
		if (this.subMvlist.length == 0) {
			this.getSubMvBy();
		}
		// 判断是否收藏了当前MV或视频
		this.isSubMv();
	},

	methods: {
		/* 
    网络请求事件
    */
		//.* MV数据 */
		// 获取MV详情数据
		getMvDetailBy() {
			getMvDetail(this.id).then(res => {
				this.videoinfo = res.data.data;
			});
		},
		// 获取相似mv
		getSimiMvBy() {
			getSimiMv(this.id).then(res => {
				this.similarvideo = res.data.mvs;
			});
		},
		// 获取mv播放地址
		getMvUrlBy() {
			getMvUrl(this.id).then(res => {
				this.mvUrl = res.data.data.url;
			});
		},
		// 获取mv点赞数据
		getMvLikeInfoBy() {
			getMvLikeInfo(this.id).then(res => {
				this.isLikeInfo = res.data;
			});
		},

		//.* 视频数据 */
		// 获取视频详情数据
		getVideoDetailBy() {
			getVideoDetail(this.id).then(res => {
				this.videoinfo = res.data.data;
			});
		},
		// 获取相关视频
		getSimiVideoBy() {
			getSimiVideo(this.id).then(res => {
				this.similarvideo = res.data.data;
			});
		},
		//  获取视频播放地址
		getVideoUrlBy() {
			getVideoUrl(this.id).then(res => {
				this.videoUrl = res.data.urls[0].url;
			});
		},
		// 获取视频点赞数据
		getVideoLikeInfoBy() {
			getVideoLikeInfo(this.id).then(res => {
				this.isLikeInfo = res.data;
				console.log(res);
			});
		},

		/* 
    事件监听
    */
		//评论分页事件
		changePage() {
			// 返回指定位置
			let view = document.querySelector(".view");
			view.scrollTop = this.$refs.comment.offsetTop;
		},

		/* 收藏视频或MV事件 */
		// 获取收藏的视频
		getSubMvBy() {
			getSubMv().then(res => {
				this.$store.dispatch("saveFavoriteMv", res.data.data);
				this.isSubMv();
			});
		},
		// 判断是否收藏了当前视频
		isSubMv() {
			let index = this.subMvlist.findIndex(item => {
				return item.vid == this.id;
			});
			if (index == -1) {
				this.isSub = false;
			} else {
				this.isSub = true;
			}
		},

		// 点击收藏按钮的回调
		subMvBy() {
			let t = !this.isSub ? 1 : 2; // 1 为收藏,其他为取消收藏
			if (this.type == "mv") {
				subMv(t, this.id).then(res => {
					if (res.data.code == 200) {
						// 从新请求最新数据
						this.getSubMvBy();
					}
				});
			} else {
				subVideo(t, this.id).then(res => {
					if (res.data.code == 200) {
						this.getSubMvBy();
					}
				});
			}
		},

		// 点击点赞按钮的回调
		likeVideoBy() {
			let t = !this.isLikeInfo.liked ? 1 : 2; // 1 为点赞,其他为取消点赞
			if (this.type == "mv") {
				let type = 1; // 1: mv 5: 视频
				likeVideo(t, type, this.id).then(res => {
					this.isLikeInfo.liked = !this.isLikeInfo.liked;
				});
			} else {
				let type = 5; // 1: mv 5: 视频
				likeVideo(t, type, this.id).then(res => {
					this.isLikeInfo.liked = !this.isLikeInfo.liked;
				});
			}
		},
	},
	watch: {
		// 点击相关推荐视频时
		// 路由push相同地址不同参数时 不会自动刷新页面，这里通过watch监听路由变化，一但发生变化reload刷新
		$route(to, from) {
			if (to !== from) {
				this.reload();
			}
		},
	},
};
</script>

<style lang="less" scoped>
.video-detail {
	display: flex;
	justify-content: space-between;
	.left-detail {
		position: relative;
		width: 60%;
		.video-play {
			background: #000;
			video {
				width: 100%;
				height: 400px;
			}
		}
		.video-comment {
			padding-top: 20px;
		}
	}
	.right-recvideo {
		width: 35%;
	}
}
</style>
