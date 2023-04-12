<template>
	<div class="top-desc" v-if="Object.keys(albuminfo).length !== 0">
		<!-- 左侧图片 -->
		<div class="left-img">
			<img v-lazy="cover" alt="" />
		</div>
		<!-- 右侧描述 -->
		<div class="right-desc">
			<!-- 专辑标题 -->
			<div class="title">
				<el-tag effect="plain" class="stag">专辑</el-tag>
				<h2>{{ albuminfo.name }}</h2>
			</div>
			<!-- 相关操作 -->
			<div class="operation">
				<el-button type="primary" icon="el-icon-video-play" @click="playAll">播放全部</el-button>
				<el-button :icon="isSub ? 'el-icon-folder-checked' : 'el-icon-folder-add'" :type="isSub ? 'primary' : 'default'" @click="subAlbumBy">{{ isSub ? "已收藏" : "收藏" }}</el-button>
				<el-button icon="el-icon-share">分享({{ dynamic.shareCount }})</el-button>
			</div>
			<!-- 相关信息 -->
			<div class="base-info">
				<div>歌手：{{ albuminfo.artist.name }}</div>
				<div>歌曲数：{{ albuminfo.size }}</div>
				<div v-if="albuminfo.company">出品公司：{{ albuminfo.company }}</div>
				<div>发行时间：{{ albuminfo.publishTime | showDate }}</div>
			</div>
		</div>
	</div>
</template>

<script>
import { formatDate } from "common/formatDate";
export default {
	name: "AlbumTopInfo",
	props: {
		dynamic: {
			type: Object,
			default() {
				return {};
			},
		},
		albuminfo: {
			type: Object,
			default() {
				return {};
			},
		},
		isSub: {
			type: Boolean,
			default() {
				return false;
			},
		},
	},
	computed: {
		cover() {
			return this.albuminfo.picUrl + "?param=200y200";
		},
	},
	filters: {
		showDate(value) {
			const date = new Date(value);
			return formatDate(date, "yyyy-MM-dd");
		},
	},

	data() {
		return {};
	},
	methods: {
		// 播放所有歌曲
		playAll() {
			this.$emit("playAllSong");
		},
		// 收藏专辑
		subAlbumBy() {
			// 先判断登录状态
			if (!this.$store.state.isLogin) {
				this.$message({
					type: "warning",
					message: "登录后才能收藏",
					showClose: true,
					center: true,
				});
				return;
			}
			this.$emit("subAlbumBy");
		},
	},
};
</script>

<style lang="less" scoped>
.top-desc {
	display: flex;
	align-items: center;
	.left-img {
		flex: 1;
		img {
			width: 100%;
		}
	}
	.right-desc {
		flex: 4;
		padding-left: 15px;
		.title {
			display: flex;
			.stag {
				height: 30px;
				font-size: 16px;
				font-weight: 700;
			}
			h2 {
				padding-left: 15px;
				font-size: 22px;
			}
		}
		.operation {
			margin-top: 15px;
		}
		.base-info {
			margin-top: 15px;
			font-size: 16px;
			div {
				padding: 5px 0;
			}
		}
	}
}
</style>
