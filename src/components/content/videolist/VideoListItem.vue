<template>
	<div class="video-list-item" @click="videoItemClick">
		<!-- 视频封面 -->
		<div class="item-img" @mouseenter="showIcon" @mouseleave="closeIcon">
			<img :src="showImg" alt="" />
			<!-- 播放图标遮罩层 -->
			<transition name="el-fade-in-linear">
				<div class="mask-playicon" v-show="isShowPlay">
					<span class="iconfont icon-play"></span>
				</div>
			</transition>
			<!-- 播放量 -->
			<transition name="el-zoom-in-top">
				<div class="play-icon" v-show="isShowIcon">
					<span class="iconfont icon-play-square"></span>
					<span>{{ videolistitem.playCount || videolistitem.playTime || videolistitem.data.playTime || videolistitem.data.playCount | formatNum }}</span>
				</div>
			</transition>
			<!-- 时长 -->
			<transition name="el-zoom-in-bottom">
				<div class="playduration" v-show="isShowIcon">
					<span>{{ videolistitem.duration || videolistitem.durationms || videolistitem.data.durationms || videolistitem.data.duration | formatDuration }}</span>
				</div>
			</transition>
		</div>
		<!-- 视频介绍 -->
		<div class="item-text">
			<div class="twoLine">
				{{ videolistitem.name || videolistitem.title || videolistitem.data.title || videolistitem.data.name }}
			</div>
			<div class="by">by{{ showAuthor }}</div>
		</div>
	</div>
</template>
<script>
export default {
	name: "VideoListItem",
	props: {
		videolistitem: {
			type: Object,
			default() {
				return {};
			},
		},
	},
	data() {
		return {
			isShowIcon: true, //控制播放量和时长的显示与隐藏
			isShowPlay: false, //控制播放图标的显示与隐藏
		};
	},
	computed: {
		// 封面
		showImg() {
			return this.videolistitem.cover || this.videolistitem.imgurl16v9 || this.videolistitem.picUrl || this.videolistitem.coverUrl || this.videolistitem.data.coverUrl;
		},
		// 作者
		showAuthor() {
			// MV页面
			if (this.videolistitem.id) {
				return this.videolistitem.artistName;
			}
			// 视频页面
			else if (this.videolistitem.data) {
				// 视频中的MV
				if (this.videolistitem.data.artists) {
					return this.videolistitem.data.artists[0].name;
				}
				// 视频
				else return this.videolistitem.data.creator.nickname;
			}
			// 我的收藏视频页面
			else if (this.videolistitem.vid) {
				return this.videolistitem.creator[0].userName;
			}
		},
	},
	methods: {
		/* 控制播放量和时长的显示与隐藏事件 */
		showIcon() {
			this.isShowIcon = false;
			this.isShowPlay = true;
		},
		closeIcon() {
			this.isShowIcon = true;
			this.isShowPlay = false;
		},

		/* 视频点击事件 */
		videoItemClick() {
			// 视频页面跳转
			if (this.videolistitem.data) {
				// 视频中的MV
				if (this.videolistitem.data.videoGroup[0].type == 0) {
					this.$router.push({
						name: "VideoDetail",
						params: { id: this.videolistitem.data.id, type: "mv" },
					});
				} else
					this.$router.push({
						//视频
						name: "VideoDetail",
						params: { id: this.videolistitem.data.vid, type: "video" },
					});
			}
			//Mv页面跳转
			else if (this.videolistitem.id) {
				this.$router.push({
					name: "VideoDetail",
					params: { id: this.videolistitem.id, type: "mv" },
				});
			}
			//我的收藏视频页面跳转
			else if (this.videolistitem.vid) {
				//mv
				if (this.videolistitem.type == 0) {
					this.$router.push({
						name: "VideoDetail",
						params: { id: this.videolistitem.vid, type: "mv" },
					});
				} else {
					//视频
					this.$router.push({
						name: "VideoDetail",
						params: { id: this.videolistitem.vid, type: "video" },
					});
				}
			}
			this.isShowIcon = true;
			this.isShowPlay = false;
		},
	},
};
</script>

<style lang="less" scoped>
.video-list-item {
	padding-bottom: 0px;
	width: 100%;
	cursor: pointer;
	.item-img {
		position: relative;
		img {
			width: 100%;
			height: 180px;
		}
		.play-icon {
			position: absolute;
			top: 0;
			right: 0;
			height: 30px;
			line-height: 30px;
			background: rgba(100, 100, 100, 0.5);
			color: #fff;
			padding: 0 5px;
		}
		.playduration {
			position: absolute;
			bottom: 0;
			left: 0;
			height: 30px;
			line-height: 30px;
			background: rgba(100, 100, 100, 0.5);
			color: #fff;
			span {
				padding: 5px;
			}
		}
	}

	.item-text {
		padding: 10px 10px;
		.by {
			padding-top: 5px;
		}
	}
}
</style>
