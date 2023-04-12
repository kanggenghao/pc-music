<template>
	<div class="top-desc" v-if="Object.keys(playlist).length !== 0">
		<!-- 左侧图片 -->
		<div class="left-img">
			<img v-lazy="cover" alt="" />
		</div>
		<!-- 右侧描述 -->
		<div class="right-desc">
			<!-- 歌单标题 -->
			<div class="title">
				<el-tag effect="plain" class="stag">歌单</el-tag>
				<h2>{{ playlist.name }}</h2>
			</div>
			<!-- 歌单创建者信息 -->
			<div class="creator-info">
				<!-- 头像 -->
				<div class="avatar" @click="toUserDetail">
					<img v-lazy="playlist.creator.avatarUrl + '?param=80y80'" alt="" />
				</div>
				<!-- 名字 -->
				<div class="uname" @click="toUserDetail">
					<span>{{ playlist.creator.nickname }}</span>
				</div>
				<!-- 创建时间 -->
				<div class="creat-time">
					<p v-if="playlist.createTime && !playlist.ToplistType">创建时间：{{ playlist.createTime | showDate }}</p>
					<p v-if="playlist.ToplistType && playlist.trackUpdateTime">最近更新时间：{{ playlist.trackUpdateTime | showDate }}</p>
				</div>
			</div>
			<!-- 相关操作 -->
			<div class="operation">
				<el-button type="primary" icon="el-icon-video-play" @click="playAll">播放全部</el-button>
				<el-button
					v-if="$store.state.userInfo == null || ($store.state.userInfo.userId && playlist.creator.userId != $store.state.userInfo.userId)"
					:icon="isSub ? 'el-icon-folder-checked' : 'el-icon-folder-add'"
					:type="isSub ? 'primary' : 'default'"
					@click="subSongList"
					><span>{{ isSub ? "已收藏" : "收藏" }}</span>
				</el-button>
				<el-button icon="el-icon-share">分享({{ playlist.shareCount | formatNum }})</el-button>
			</div>
			<!-- 歌单标签 -->
			<div class="tags" v-if="playlist.tags.length !== 0">
				<span>标签：</span>
				<span v-for="(item, index) in playlist.tags" :key="index" class="tags-item">
					<el-tag effect="plain" size="small">{{ item }}</el-tag>
				</span>
			</div>
			<!-- 歌曲数量 歌单播放量 -->
			<div class="song-count">
				<span>歌曲：{{ playlist.trackIds.length }}首</span>
				<span>播放：{{ playlist.playCount | formatNum }}次</span>
			</div>
			<!-- 歌单简介 -->
			<div class="desc-info">
				<span v-if="playlist.description">简介：{{ playlist.description }}</span>
				<span v-else>简介：暂无简介</span>
			</div>
		</div>
	</div>
</template>
<script>
import { formatDate } from "common/formatDate";
export default {
	name: "Topdesc",
	props: {
		playlist: {
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
	data() {
		return {};
	},
	computed: {
		cover() {
			return this.playlist.coverImgUrl + "?param=200y200";
		},
	},
	filters: {
		showDate(value) {
			const date = new Date(value);
			return formatDate(date, "yyyy-MM-dd");
		},
	},
	methods: {
		// 播放所有歌曲
		playAll() {
			this.$emit("playAllSong");
		},
		// 收藏歌单
		subSongList() {
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
			this.$emit("subSongListBy");
		},
		// 去往歌单创建者主页
		toUserDetail() {
			this.$router.push("/userdetail/" + this.playlist.creator.userId);
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
		height: 100%;
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

		.creator-info {
			display: flex;
			align-items: center;
			margin-top: 8px;
			.avatar {
				width: 6%;
				img {
					width: 100%;
					border-radius: 50%;
					vertical-align: middle;
				}
			}
			.uname {
				font-size: 16px;
				padding-left: 10px;
				cursor: pointer;
				color: #5091ca;
			}
			.creat-time {
				padding-left: 15px;
			}
		}

		.operation {
			margin-top: 8px;
		}

		.tags {
			margin-top: 8px;
			font-size: 16px;
			.tags-item {
				font-size: 14px;
				padding-right: 5px;
			}
		}

		.song-count {
			margin-top: 8px;
			font-size: 16px;
			span {
				padding-right: 15px;
			}
		}

		.desc-info {
			font-size: 16px;
			margin-top: 8px;
			overflow: hidden;
			text-overflow: ellipsis;
			display: -webkit-box;
			-webkit-line-clamp: 2;
			-webkit-box-orient: vertical;
		}
	}
}
</style>
