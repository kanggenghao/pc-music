<template>
	<div id="album-detail" class="w">
		<!-- 顶部专辑基本信息 -->
		<AlbumTopInfo :dynamic="dynamic" :albuminfo="albuminfo" :is-sub="isSub" @playAllSong="playAllSong" @subAlbumBy="subAlbumBy" />
		<!-- 底部专辑内容 -->
		<div class="singer-works" v-if="Object.keys(dynamic).length !== 0">
			<el-tabs>
				<!-- 专辑歌曲列表 -->
				<el-tab-pane label="歌曲列表">
					<SongTable :songs="albumsong" />
				</el-tab-pane>
				<!-- 评论 -->
				<el-tab-pane>
					<span slot="label">评论</span>
					<CommentPage :comment-type="3" :commentres-id="id" @changePage="changePage" />
				</el-tab-pane>
				<!-- 专辑详情 -->
				<el-tab-pane label="专辑详情">
					<div class="album-desc">
						<p v-if="albuminfo.description" v-html="albuminfo.description"></p>
						<el-empty v-else description="暂无介绍" :image-size="200"></el-empty>
					</div>
				</el-tab-pane>
			</el-tabs>
		</div>
	</div>
</template>

<script>
/* 网络请求 */
import { getAlbumDynamic, getAlbumSong, subAlbum } from "network/zhuanjidetail/albumdetail";
import { getSongUrl } from "network/playmusic/playmusic.js";
import { getSubAlbum } from "network/myfavorite/myfavorite";
/* vuex */
import { mapGetters } from "vuex";
/* 子组件 */
import AlbumTopInfo from "./Childcomps/AlbumTopInfo.vue";
import SongTable from "components/content/SongTable.vue";
import CommentPage from "components/content/comment/commentPage.vue";
export default {
	name: "Albumdetail",
	components: { AlbumTopInfo, SongTable, CommentPage },
	data() {
		return {
			id: "",
			dynamic: {},
			albuminfo: {},
			albumsong: [],
			isSub: false, //是否收藏该专辑
		};
	},
	computed: {
		...mapGetters(["subAlbumlist"]),
	},
	created() {
		this.id = this.$route.params.id;
		// 获取专辑动态信息 如收藏 分享数据
		this.getAlbumDynamicBy();
		// 获取专辑歌曲
		this.getAlbumSongBy();
		//获取用户收藏的专辑列表
		if (this.subAlbumlist.length == 0) {
			this.getUserSubAlbum();
			return;
		}
		// 判断是否收藏了当前专辑
		this.isSubAlbum();
	},

	methods: {
		/* 
    网络请求
     */
		// 获取专辑动态信息 如收藏 分享数据
		getAlbumDynamicBy() {
			getAlbumDynamic(this.id).then(res => {
				this.dynamic = res.data;
			});
		},
		// 获取专辑歌曲
		getAlbumSongBy() {
			getAlbumSong(this.id).then(res => {
				this.albuminfo = res.data.album;
				this.albumsong = res.data.songs;
			});
		},

		/* 
    事件监听
    */
		/* 评论分页事件 */
		changePage(page) {
			// 返回指定位置
			let view = document.querySelector(".view");
			view.scrollTo({
				behavior: "smooth",
				top: 300,
			});
		},

		/* 播放全部歌曲事件 */
		playAllSong() {
			this.$store.dispatch("addAllSong", this.albumsong);
			//默认播放第一首歌
			getSongUrl(this.albumsong[0].id).then(res => {
				this.$store.dispatch("saveSongUrl", res.data.data[0].url);
			});
			//提交vuex保存当前歌曲详情
			this.$store.dispatch("saveSongDetail", this.albumsong[0]);
		},

		/* 收藏专辑事件 */
		// 获取用户收藏的专辑列表
		getUserSubAlbum() {
			getSubAlbum().then(res => {
				this.$store.dispatch("saveFavoriteAlbum", res.data.data);
				this.isSubAlbum();
			});
		},
		// 判断是否收藏了当前专辑
		isSubAlbum() {
			let index = this.subAlbumlist.findIndex(item => {
				return item.id == this.id;
			});
			if (index == -1) {
				this.isSub = false;
			} else {
				this.isSub = true;
			}
		},
		// 点击收藏按钮的回调
		subAlbumBy() {
			let t = !this.isSub ? 1 : 2; // 1 为收藏,其他为取消收藏,
			// console.log(t);
			// 发送网络请求 收藏/取消收藏当前专辑
			subAlbum(t, this.id)
				.then(res => {
					console.log(res);
					if (res.data.code == 200) {
						// 重新获取用户收藏的专辑
						this.getUserSubAlbum();
						if (t == 1) {
							this.$message({
								type: "success",
								message: "收藏成功",
								center: true,
							});
						} else {
							this.$message({
								type: "success",
								message: "取消收藏成功",
								center: true,
							});
						}
					}
				})
				.catch(err => this.$message.warning("操作失败,请重试"));
		},
	},
};
</script>

<style lang="less" scoped>
.album-desc {
	p {
		text-indent: 24px;
	}
}
</style>
