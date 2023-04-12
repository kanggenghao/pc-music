<template>
	<div class="song-table">
		<el-table style="width: 100%" :data="songs" empty-text="数据加载中~" @row-dblclick="playMusic" :row-class-name="tableRowClassName">
			<!-- 索引或者小喇叭 -->
			<el-table-column width="50">
				<template v-slot="scope">
					<span class="iconfont" :class="isPlaying ? ' icon-voice' : 'icon-jingyin_laba'" v-if="scope.row.id == nowSongDetail.id"></span>
					<span v-else>{{ scope.row.index | formatIndex }}</span>
				</template>
			</el-table-column>
			<!-- 操作按钮 -->
			<el-table-column width="120">
				<template v-slot="scope">
					<div class="operation">
						<span
							@click="likeSong(scope.row)"
							:class="likeSongIds.indexOf(scope.row.id) !== -1 ? 'iconfont icon-xihuan2' : 'iconfont icon-xihuan'"
							:title="likeSongIds.indexOf(scope.row.id) !== -1 ? '取消喜欢' : '喜欢'"
						>
						</span>
						<span class="iconfont icon-xiazai" @click="downloadCurrentMusic(scope.row)" title="下载"></span>
						<span class="el-icon-plus" @click="addSong(scope.row)" title="添加到播放列表"></span>
					</div>
				</template>
			</el-table-column>
			<!-- 歌曲名和mv图标 -->
			<el-table-column prop="name" label="歌曲" width="300" :show-overflow-tooltip="true">
				<template v-slot="scope">
					<div class="songname">
						{{ scope.row.name }}
						<i class="iconfont icon-vip" v-if="scope.row.fee == 1"></i>
						<i class="iconfont icon-mv" v-if="scope.row.mv != 0" @click="toMvDetail(scope.row.mv)"></i>
					</div>
				</template>
			</el-table-column>
			<!-- 专辑名 -->
			<el-table-column prop="al.name" label="专辑" :show-overflow-tooltip="true">
				<template v-slot="scope">
					<span @click="toAlbum(scope.row.al.id)" class="sthover">
						{{ scope.row.al.name }}
					</span>
				</template>
			</el-table-column>
			<!-- 歌手名 -->
			<el-table-column prop="ar[0].name" label="歌手" :show-overflow-tooltip="true">
				<template v-slot="scope">
					<span @click="toSinger(scope.row.ar[0].id)" class="sthover">
						{{ scope.row.ar[0].name }}
					</span>
				</template>
			</el-table-column>
			<!-- 时长 -->
			<el-table-column prop="dt" label="时长">
				<template v-slot="scope">
					<span>
						{{ scope.row.dt | formatDuration }}
					</span>
				</template>
			</el-table-column>
		</el-table>
	</div>
</template>

<script>
import { getSongUrl, checkMusic, likeNowSong, getLikSongList } from "network/playmusic/playmusic.js";
import { mapGetters } from "vuex";
export default {
	name: "SongTable",
	props: {
		songs: {
			type: Array,
			default() {
				return [];
			},
		},
	},
	data() {
		return {
			islike: false, //是否喜欢当前歌曲
			currentIndex: null,
		};
	},
	computed: {
		...mapGetters(["isPlaying", "nowSongDetail", "isLogin", "userInfo", "userSongList", "likeSongIds"]),
	},
	filters: {
		formatIndex(index) {
			if (index < 9) {
				return "0" + (index + 1);
			} else return index + 1;
		},
	},
	created() {
		// 如果没有用户的喜欢列表 就先获取
		if (this.isLogin && this.likeSongIds.length === 0) {
			this.getUserLikSongs();
		}
	},
	methods: {
		//每行歌曲双击播放
		playMusic(song) {
			// 先检查歌曲是否可用
			checkMusic(song.id)
				.then(res => {
					// 获取歌曲url
					getSongUrl(song.id).then(res => {
						this.$store.dispatch("saveSongUrl", res.data.data[0].url);
					});
					// 更新播放状态
					this.$store.dispatch("changePlayState", true);
					//提交vuex保存当前歌曲详情
					this.$store.dispatch("saveSongDetail", song);
					// 提交vuex添加到播放列表
					this.$store.dispatch("addPlayinglist", song);
				})
				.catch(err => {
					this.$message({
						message: "暂时无法播放，换首试试",
						type: "warning",
						center: true,
					});
				});
		},

		//获取用户喜欢的音乐id列表
		getUserLikSongs() {
			getLikSongList(this.userInfo.userId).then(res => {
				if (Array.isArray(res.data.ids) && res.data.ids.length != 0) {
					this.$store.dispatch("saveLikeSongIds", res.data.ids);
				}
			});
		},
		//点击喜欢按钮事件
		likeSong(song) {
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
			// 判断传入参数是喜欢还是不喜欢
			let like = this.likeSongIds.indexOf(song.id) !== -1 ? false : true;
			// 如果是在用户喜欢的歌单点击的取消喜欢
			// 需要确认并从新获取用户歌单数据
			if (this.userSongList[0].id == this.$route.params.id) {
				this.$confirm("确定将选中歌曲从我喜欢的音乐中删除吗?", "提示", {
					confirmButtonText: "确定",
					cancelButtonText: "取消",
					type: "warning",
					confirmButtonClass: "",
				})
					.then(() => {
						// 如果删除的话就调接口
						this.likeNowSongBy(song, like);
						// 更新歌单
						this.$emit("updateSonglist");
					})
					.catch(err => {
						err;
					});
				return;
			}
			// 否则不在用户喜欢的歌单 直接调接口
			else {
				this.likeNowSongBy(song, like);
			}
		},

		/* 网络请求 喜欢/不喜欢歌曲 */
		likeNowSongBy(song, like) {
			likeNowSong(song.id, like)
				.then(res => {
					// 重新获取用户喜欢的歌曲id列表
					this.getUserLikSongs();
					if (like === true) {
						this.$message({
							message: "已添加到我喜欢的音乐",
							type: "success",
							center: true,
						});
						this.islike = true;
					} else {
						this.$message({
							message: "取消喜欢成功",
							type: "success",
							center: true,
						});
						this.islike = false;
					}
				})
				.catch(err => {
					this.$message.warning("操作失败,请重试");
				});
		},

		// 点击下载按钮的回调
		downloadCurrentMusic(song) {
			checkMusic(song.id)
				.then(res => {
					// 获取歌曲url
					getSongUrl(song.id).then(res => {
						let songUrl = res.data.data[0].url;
						// 下载的歌曲信息
						let downloadMusicInfo = {
							url: songUrl,
							name: song.name + " - " + song.ar[0].name,
						};
						this.$store.commit("updateDownloadMusicInfo", downloadMusicInfo);
					});
				})
				.catch(err => {
					this.$message({
						message: "暂无版权，无法下载",
						type: "warning",
						center: true,
					});
				});
		},

		// 点击添加按钮
		addSong(song) {
			// 提交vuex添加到播放列表
			this.$store.dispatch("addPlayinglist", song);
			this.$message({
				message: "已添加到播放列表",
				type: "success",
				center: true,
			});
		},
		// 点击歌手 去往歌手页面
		toSinger(id) {
			this.$router.push("/singerdetail/" + id);
		},
		// 去往专辑页面
		toAlbum(id) {
			this.$router.push("/albumdetail/" + id);
		},
		// 去往MV页面
		toMvDetail(id) {
			this.$router.push({
				name: "VideoDetail",
				params: { id, type: "mv" },
			});
		},
		// 实现当前播放歌曲行显示小喇叭
		tableRowClassName({ row, rowIndex }) {
			row.index = rowIndex;
			if (rowIndex % 2 !== 0) {
				return "rowEven";
			}
		},
	},
};
</script>

<style lang="less" scoped>
.operation {
	.icon-xihuan,
	.el-icon-plus {
		font-size: 15px;
		color: #999;
		font-weight: 700;
	}
	.icon-xihuan2 {
		font-size: 16px;
		color: var(--themeColor);
	}
	.icon-xiazai {
		font-weight: 700;
		color: #999;
	}
	.icon-xihuan,
	.icon-xihuan2,
	.icon-xiazai {
		display: inline-block;
		width: 30px;
	}

	span {
		cursor: pointer;
		&:hover {
			color: var(--themeColor);
		}
	}
}
.icon-voice,
.icon-jingyin_laba {
	color: var(--themeColor);
}
.icon-mv {
	font-size: 22px;
	color: var(--themeColor);
	cursor: pointer;
	padding-left: 5px;
}
.icon-vip {
	color: var(--themeColor);
	font-size: 18px;
	font-weight: 400;
	padding-left: 5px;
}
.sthover:hover {
	display: inline-block;
	color: var(--themeColor);
	width: 100%;
	cursor: pointer;
}
.no {
	width: 100%;
	text-align: center;
	font-size: 24px;
	font-weight: 700;
}
.confirmButtonClass {
	background-color: var(--themeColor) !important;
	border-color: var(--themeColor) !important;
}
</style>
