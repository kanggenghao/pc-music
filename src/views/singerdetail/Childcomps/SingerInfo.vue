<template>
	<div class="singer-info">
		<!-- 左侧封面 -->
		<div class="left-cover" v-lazy-container="{ selector: 'img' }">
			<img :data-src="cover" :data-loading="require('assets/imgs/singerload.png')" />
		</div>
		<!-- 右侧信息 -->
		<div class="right-info">
			<!-- 歌手名 -->
			<div class="singer-name">
				<el-tag effect="plain" class="stag">歌手</el-tag>
				<h2>{{ singerInfo.name }}</h2>
			</div>
			<!-- 相关操作 -->
			<div class="operation">
				<el-button :icon="isSub ? 'el-icon-folder-checked' : 'el-icon-folder-add'" :type="isSub ? 'primary' : 'default'" @click="subSinger">{{ isSub ? "已收藏" : "收藏" }}</el-button>
				<el-button icon="el-icon-connection" v-if="singerInfo.userId" @click="toUserDetail">个人主页</el-button>
				<el-button icon="el-icon-share">分享</el-button>
			</div>
			<!-- 作品数量 -->
			<div class="count">
				<div class="item-count">
					<span class="iconfont icon-yinyue"></span>
					<span>单曲数：{{ singerInfo.musicSize }}</span>
				</div>
				<div class="item-count">
					<span class="iconfont icon-zhuanji"></span>
					<span>专辑数：{{ singerInfo.albumSize }}</span>
				</div>
				<div class="item-count">
					<span class="iconfont icon-mv"></span>
					<span>MV数：{{ singerInfo.mvSize }}</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: "SingerInfo",
	props: {
		singerInfo: {
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
			return this.singerInfo.cover + "?param=200y200";
		},
	},
	methods: {
		// 关注歌手
		subSinger() {
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
			this.$emit("subSingerBy");
		},
		// 去往歌手主页
		toUserDetail() {
			this.$router.push("/userdetail/" + this.singerInfo.userId);
		},
	},
};
</script>

<style lang="less" scoped>
.singer-info {
	display: flex;
	align-items: center;
	.left-cover {
		position: relative;
		flex: 1;
		img {
			width: 100%;
		}
		img[lazy="error"] {
			width: 100%;
		}
		img[lazy="loading"] {
			width: 100%;
		}
	}
	.right-info {
		flex: 4;
		padding-left: 15px;
		.singer-name {
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
			padding-top: 15px;
		}
		.count {
			padding-top: 15px;
			.item-count {
				padding-bottom: 5px;
				span {
					padding-left: 10px;
				}
			}
		}
	}
}
</style>
