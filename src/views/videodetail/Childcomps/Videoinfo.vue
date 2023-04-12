<template>
	<div class="video-info">
		<!-- 作者 -->
		<div class="auther">
			<div class="block">
				<img :src="showAvatar" />
			</div>
			<span v-if="type == 'mv'" @click="toSingerDetail">{{ videoinfo.artistName }}</span>
			<span v-if="videoinfo.creator" @click="toUserDetail">{{ videoinfo.creator.nickname }}</span>
		</div>
		<!-- 标题 -->
		<div class="title">
			<h2>{{ videoinfo.name || videoinfo.title }}</h2>
		</div>
		<div class="desc" v-if="videoinfo.description">
			{{ videoinfo.description }}
		</div>
		<!-- 时间 -->
		<div class="time">
			<span>发布：{{ videoinfo.publishTime | showDate }}</span>
			<span>播放：{{ videoinfo.playCount || videoinfo.playTime | formatNum }}</span>
		</div>
		<!-- 相关操作 -->
		<div class="opreation">
			<el-button class="iconfont icon-dianzan" :type="islike ? 'primary' : 'default'" @click="likeVideo">{{ islike ? "已赞" : "点赞" }}</el-button>
			<el-button :icon="isSub ? 'el-icon-folder-checked' : 'el-icon-folder-add'" :type="isSub ? 'primary' : 'default'" @click="subMv">{{ isSub ? "已收藏" : "收藏" }}</el-button>
			<el-button icon="el-icon-share">分享</el-button>
		</div>
	</div>
</template>

<script>
import { formatDate } from "common/formatDate";
import { isArray } from "common/utils";
export default {
	name: "Videoinfo",
	props: {
		videoinfo: {
			type: Object,
			default() {
				return {};
			},
		},
		type: {
			type: String,
		},
		isSub: {
			type: Boolean,
			default() {
				return false;
			},
		},
		islike: {
			type: Boolean,
			default() {
				return false;
			},
		},
	},
	filters: {
		showDate(value) {
			const date = new Date(value);
			return formatDate(date, "yyyy-MM-dd");
		},
	},
	computed: {
		showAvatar() {
			let avatar = this.type == "mv" ? isArray(this.videoinfo.artists) && this.videoinfo.artists[0].img1v1Url : this.videoinfo.avatarUrl;
			return avatar;
		},
	},

	methods: {
		// 收藏视频事件
		subMv() {
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
			this.$emit("subMvBy");
		},
		// 点赞视频
		likeVideo() {
			// 先判断登录状态
			if (!this.$store.state.isLogin) {
				this.$message({
					type: "warning",
					message: "登录后才能点赞",
					showClose: true,
					center: true,
				});
				return;
			}
			this.$emit("likeVideoBy");
		},

		toUserDetail() {
			this.$router.push("/userdetail/" + this.videoinfo.creator.userId);
		},
		toSingerDetail() {
			this.$router.push("/singerdetail/" + this.videoinfo.artistId);
		},
	},
};
</script>

<style lang="less" scoped>
.video-info {
	.auther {
		display: flex;
		align-items: center;
		padding-top: 15px;
		color: #5091ca;
		span {
			padding-left: 10px;
			cursor: pointer;
		}
		.block {
			width: 50px;
			height: 50px;
			img {
				width: 100%;
				height: 100%;
				border-radius: 50%;
			}
		}
	}
	.title {
		padding-top: 25px;
	}
	.desc {
		padding-top: 10px;
		color: #909399;
	}
	.time {
		padding-top: 10px;
		color: #909399;
		span {
			padding-right: 15px;
		}
	}
	.opreation {
		padding-top: 15px;
	}
}
.sub {
	background: var(--themeColor);
	color: #fff;
}
</style>
