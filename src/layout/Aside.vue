<template>
	<div id="aside">
		<!-- 主路由导航 -->
		<el-menu router :default-active="defaultActive">
			<el-menu-item v-for="(item, index) in subnavitem" :key="index" :index="item.path">
				<span class="iconfont" :class="item.icon"></span>
				<span>{{ item.name }}</span>
			</el-menu-item>
			<!-- 登录后的 -->
			<div class="mycreat" v-if="userSongList.length >= 1">
				<p class="by">我创建的歌单</p>
				<el-menu-item v-for="item in createdSongList" :key="item.id" :index="'/songlistdetail/' + item.id">
					<span class="iconfont icon-xihuan"></span>
					<span>{{ item.name }}</span>
				</el-menu-item>
			</div>
			<div class="collect" v-if="userSongList.length > 1">
				<p class="by">我收藏的歌单</p>
				<div class="person">
					<el-menu-item v-for="item in collectSongList" :key="item.id" :index="'/songlistdetail/' + item.id">
						<span class="iconfont icon-gedan"></span>
						<span>{{ item.name }}</span>
					</el-menu-item>
				</div>
			</div>
		</el-menu>
	</div>
</template>
<script>
import { mapGetters } from "vuex";
export default {
	name: "Aside",
	data() {
		return {
			defaultActive: " ",
			subnavitem: [
				{ name: "发现音乐", path: "/findmusic", icon: "icon-yinyueclick" },
				{ name: "推荐视频", path: "/recvideo", icon: "icon-shipin1" },
				{ name: "每日推荐", path: "/receveryday", icon: "icon-dianzan" },
				{ name: "我的收藏", path: "/myfavorite", icon: "icon-myfavorite" },
			],
			collectIndex: null,
		};
	},
	computed: {
		...mapGetters(["userSongList", "userInfo"]),
		createdSongList() {
			// 找到用户收藏的第一个歌单的索引号
			this.collectIndex = this.userSongList.findIndex(item => item.creator.userId != this.userInfo.userId);
			// 截取用户创建的歌单
			if (this.collectIndex !== -1) {
				return this.userSongList.slice(0, this.collectIndex);
			} else {
				return this.userSongList;
			}
		},
		collectSongList() {
			if (this.collectIndex !== -1) {
				return this.userSongList.slice(this.collectIndex);
			} else {
				return [];
			}
		},
	},
	methods: {
		getPath() {
			let pathArr = "/" + this.$route.path.split("/")[1];
			if (pathArr == "/songlistdetail") {
				this.defaultActive = pathArr + "/" + this.$route.params.id;
			} else {
				this.defaultActive = pathArr;
			}
		},
	},
	watch: {
		$route: "getPath",
	},
};
</script>

<style lang="less" scoped>
#aside {
	height: 100%;
	width: 230px;
	overflow-y: scroll;
	border-right: 1px solid #dddddd;
	padding-top: 2px;
	.el-menu {
		border-right: 0;
	}
	.el-menu-item {
		height: 53px;
		line-height: 53px;
		font-size: 16px;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.el-menu-item.is-active {
		color: var(--base-black);
		font-weight: 700;
		background: rgb(245, 245, 245, 0.3) !important;
	}
	.el-menu-item:hover {
		background: rgb(245, 245, 245, 0.3);
	}
	span {
		padding-right: 10px;
	}
	.by {
		font-size: 14px;
		padding-left: 10px;
	}
	.person {
		margin-top: 10px;
	}
}
</style>
