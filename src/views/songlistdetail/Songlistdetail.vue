<template>
	<div id="song-list-detail" class="w">
		<!-- 顶部歌单描述 -->
		<Topdesc :playlist="playlist" :is-sub="isSub" @playAllSong="playAllSong" @subSongListBy="subSongListBy" />
		<!-- 底部歌曲 -->
		<div class="bot-song-list" v-if="Object.keys(playlist).length !== 0">
			<el-tabs>
				<!-- 歌曲列表 -->
				<el-tab-pane label="歌曲列表">
					<SongTable :songs="songs" @updateSonglist="updateSonglist" />
				</el-tab-pane>
				<!-- 评论 -->
				<el-tab-pane>
					<span slot="label">评论</span>
					<CommentPage :comment-type="2" :commentres-id="id" @changePage="changePage" />
				</el-tab-pane>
				<!-- 收藏者 -->
				<el-tab-pane label="收藏者">
					<Subscribers :subscribers="subscribers" :totalcount="totalcount" @handlePage="getSongListSubscribersBy" />
				</el-tab-pane>
			</el-tabs>
		</div>
	</div>
</template>

<script>
/* 
网络请求模块
 */
import { getSongListDetail, getEverySongDetail, getSongListSubscribers, subSongList } from "network/songlistdetail/songlistdetail";
import { getSongUrl } from "network/playmusic/playmusic.js";
import { getUserSonglist } from "network/userdetail/userdetail";
import { mapGetters } from "vuex";
/* 
子组件 
*/
import Topdesc from "./Childcomps/Topdesc.vue";
import CommentPage from "components/content/comment/commentPage.vue";
import SongTable from "components/content/SongTable.vue";
import Subscribers from "./Childcomps/Subscribers.vue";
export default {
	inject: ["reload"],
	name: "Songlistdetail",
	components: { Topdesc, CommentPage, SongTable, Subscribers },
	data() {
		return {
			id: "", //存储路由传递过来歌单id
			playlist: {}, //歌单描述信息
			songids: "", //歌单中所有歌曲id
			songs: [], //歌单中所有歌曲详细信息
			subscribers: [], //收藏者
			totalcount: 0, //收藏者数量
			isSub: false, //是否收藏了当前歌单
		};
	},
	computed: {
		...mapGetters(["userSongList", "userInfo"]),
	},
	created() {
		//保存路由传递过来歌单id
		this.id = this.$route.params.id;
		//  根据歌单id请求对应的歌单详情数据
		this.getSongListDetailBy();
		// 获取歌单收藏者
		this.getSongListSubscribersBy();
		// 判断用户是否收藏了该歌单
		this.isSubSongList();
	},
	methods: {
		/* 
    网络请求
    */
		// 根据id获取对应的歌单详情数据
		getSongListDetailBy() {
			getSongListDetail(this.id).then(res => {
				// 保存歌单描述信息
				this.playlist = res.data.playlist;
				//存储歌单中的所歌曲id，为一个字符串
				if (this.playlist.trackIds.length > 1000) {
					this.playlist.trackIds.slice(0, 500).forEach(item => {
						this.songids += item.id + ",";
					});
				} else {
					this.playlist.trackIds.forEach(item => {
						this.songids += item.id + ",";
					});
				}

				let queryids = this.songids.substr(0, this.songids.length - 1);
				/* 根据歌曲id获取每首歌的信息*/
				getEverySongDetail(queryids).then(res => {
					if (res.data.code == 200) {
						this.songs = res.data.songs;
					}
				});
			});
		},

		// 获取歌单收藏者
		getSongListSubscribersBy(page = 1) {
			let offset = (page - 1) * 48;
			getSongListSubscribers(this.id, offset).then(res => {
				this.subscribers = res.data.subscribers;
				this.totalcount = res.data.total;
			});
		},

		/* 
    事件监听
    */
		//  评论分页事件
		changePage() {
			// 返回指定位置
			let view = document.querySelector(".view");
			view.scrollTo({
				top: 300,
			});
		},
		// 播放全部歌曲事件
		playAllSong() {
			this.$store.dispatch("addAllSong", this.songs);
			//默认播放第一首歌
			getSongUrl(this.songs[0].id).then(res => {
				this.$store.dispatch("saveSongUrl", res.data.data[0].url);
				// 更新播放状态
				this.$store.dispatch("changePlayState", true);
			});
			//提交vuex保存当前歌曲详情
			this.$store.dispatch("saveSongDetail", this.songs[0]);
		},

		/* 收藏/取消收藏歌单事件 */
		// 先判断用户是否收藏了该歌单
		isSubSongList() {
			// 查找用户歌单是否有当前歌单
			let index = this.userSongList.findIndex(item => {
				return item.id == this.id;
			});
			if (index == -1) {
				//如果没有 返回false
				this.isSub = false;
			} else {
				//否则返回true
				this.isSub = true;
			}
		},
		// 点击收藏按钮的回调
		subSongListBy() {
			let t = !this.isSub ? 1 : 2; // 1 为收藏,2为取消收藏
			// 发送网络请求 收藏/取消收藏当前歌单
			subSongList(t, this.id)
				.then(res => {
					// console.log(res);
					if (res.data.code == 200) {
						this.isSub = !this.isSub;
						// 重新获取用户歌单
						getUserSonglist(this.userInfo.userId).then(res => {
							this.setItem("userSongList", res.data.playlist);
							this.$store.dispatch("saveUserSongList", res.data.playlist);
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
						});
					}
				})
				.catch(err => this.$message.warning("操作失败,请重试"));
		},

		/*如果是用户喜欢的歌单，点击喜欢歌曲后更新歌单*/
		updateSonglist() {
			this.getSongListDetailBy();
			setTimeout(() => {
				this.reload();
			}, 1000);
		},
	},
	watch: {
		// 路由push相同地址不同参数时 不会自动刷新页面，这里通过watch监听路由变化，一但发生变化reload刷新
		$route(to, from) {
			if (to !== from) {
				this.reload();
			}
		},
	},
};
</script>

<style lang="less" scoped></style>
