<template>
	<div id="main">
		<!-- 侧边导航 -->
		<div class="aside">
			<Aside />
		</div>
		<!-- 主路由视图 -->
		<div class="view">
			<transition name="el-fade-in-linear">
				<keep-alive include="Findmusic,Recvideo,RecEveryDay,MyFavorite">
					<router-view v-if="isRouterAlive"></router-view>
				</keep-alive>
			</transition>
			<!-- 返回顶部按钮 -->
			<el-backtop target=".view" :right="10" :bottom="75" id="backtop"></el-backtop>
		</div>
		<!-- 当前歌曲详情页 -->
		<transition name="songdetail">
			<PlayingSongDetail v-show="isShowSongDetail" />
		</transition>
		<!-- 浮动歌词 -->
		<transition name="el-fade-in-linear">
			<FloatLyric v-show="showFloatLyric" />
		</transition>
		<!-- 用于下载的a标签 -->
		<a :href="downloadMusicInfo.url" :download="downloadMusicInfo.name" target="_blank" id="downloadCurrentMusic"></a>
	</div>
</template>

<script>
import Aside from "./Aside.vue";
import PlayingSongDetail from "components/content/player/PlayingSongDetail.vue";
import FloatLyric from "components/content/player/FloatLyric.vue";
import { mapGetters } from "vuex";
import { downloadMusic } from "network/request.js";
export default {
	name: "Main",
	components: { Aside, PlayingSongDetail, FloatLyric },
	computed: {
		...mapGetters(["nowSongDetail", "isShowSongDetail", "showFloatLyric"]),
	},
	data() {
		return {
			isRouterAlive: true,
			// 下载的音乐的信息
			downloadMusicInfo: {
				name: "",
				url: "",
			},
		};
	},
	provide() {
		return {
			reload: this.reload,
		};
	},
	methods: {
		// 实现页面的局部刷新 使用provide提供 到需要刷新的页面进行引用，使用inject导入引用reload，然后直接调用即可
		reload() {
			this.isRouterAlive = false;
			this.$nextTick(function () {
				this.isRouterAlive = true;
			});
		},
	},
	watch: {
		// 监听当前下载音乐信息
		"$store.state.downloadMusicInfo"(current) {
			downloadMusic({ url: current.url })
				.then(res => {
					let url = URL.createObjectURL(res.data);
					let a = document.querySelector("#downloadCurrentMusic");
					this.downloadMusicInfo.url = url;
					this.downloadMusicInfo.name = current.name;
					this.$nextTick(() => {
						a.click();
						// 用完释放URL对象
						URL.revokeObjectURL(url);
					});
				})
				.catch(err => {
					this.$message.error("下载失败,请稍后重试!");
				});
		},
	},
};
</script>

<style lang="less" scoped>
#main {
	height: calc(100% - 130px);
	display: flex;
	.aside {
		::-webkit-scrollbar {
			width: 5px;
			height: 12px;
		}
	}
	.view {
		flex: 1;
		height: 100%;
		overflow-y: scroll;
	}
}

// 歌曲详情页动画
.songdetail-enter,
.songdetail-leave-to {
	transform: translateY(calc(100vh - 70px));
}
.songdetail-enter-active,
.songdetail-leave-active {
	transition: all 0.6s;
}
.songdetail-enter-to {
	transform: translateY(0);
}
</style>
