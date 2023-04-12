<template>
	<div class="newmusic">
		<div class="hd">
			<!-- 分类导航 -->
			<TypeNav :typeitem="typeitem" @typeItemClick="typeItemClick" />
			<div class="btn">
				<el-button type="info" size="mini" icon="el-icon-video-play" @click="playAll">播放全部</el-button>
				<el-button icon="el-icon-folder-add" size="mini"><span>收藏全部</span> </el-button>
			</div>
		</div>
		<!-- 歌曲列表 -->
		<div class="bd">
			<el-table :show-header="false" style="width: 100%" :data="musiclist" @row-dblclick="playMusic" :row-class-name="tableRowClassName" empty-text="数据加载中~">
				<el-table-column width="80">
					<template v-slot="scope">
						<span class="iconfont" :class="isPlaying ? ' icon-voice' : 'icon-jingyin_laba'" v-if="scope.row.id == nowSongDetail.id"></span>
						<span v-else>{{ scope.row.index | formatIndex }}</span>
					</template>
				</el-table-column>
				<el-table-column prop="album.picUrl" label="封面" width="80">
					<template v-slot="scope">
						<div class="cover" @click="playMusic(scope.row)">
							<img v-lazy="scope.row.album.picUrl + '?param=80y80'" />
							<div class="mask"><span class="iconfont icon-play1"></span></div>
						</div>
					</template>
				</el-table-column>

				<el-table-column prop="name" label="歌曲" width="350" :show-overflow-tooltip="true">
					<template v-slot="scope">
						<span>
							{{ scope.row.name }}
							<i class="iconfont icon-mv" v-if="scope.row.mvid != 0" @click="toMvDetail(scope.row.mvid)"></i>
						</span>
					</template>
				</el-table-column>
				<el-table-column prop="artists[0].name" label="歌手" width="250" :show-overflow-tooltip="true">
					<template v-slot="scope">
						<span @click="toSinger(scope.row.artists[0].id)" class="sthover">
							{{ scope.row.artists[0].name }}
						</span>
					</template>
				</el-table-column>
				<el-table-column prop="album.name" label="专辑" width="300" :show-overflow-tooltip="true">
					<template v-slot="scope">
						<span @click="toAlbum(scope.row.album.id)" class="sthover">
							{{ scope.row.album.name }}
						</span>
					</template>
				</el-table-column>
				<el-table-column prop="duration" label="时长">
					<template v-slot="scope">
						<span>
							{{ scope.row.duration | formatDuration }}
						</span>
					</template>
				</el-table-column>
			</el-table>
		</div>
	</div>
</template>

<script>
import { getNewSongs } from "network/findmusic/newsongs/newsongs";
import { mapGetters } from "vuex";
import { getSongUrl, checkMusic } from "network/playmusic/playmusic.js";
import TypeNav from "./TypeNav.vue";
export default {
	name: "NewMusic",
	components: { TypeNav },
	data() {
		return {
			typeitem: [
				{ type: "全部", code: "0" },
				{ type: "华语", code: "7" },
				{ type: "欧美", code: "96" },
				{ type: "日本", code: "8" },
				{ type: "韩国", code: "16" },
			],
			musiclist: [],
		};
	},
	created() {
		//   默认获取全部分类的歌曲
		this.getNewSongsBy(0);
	},
	computed: {
		...mapGetters(["nowSongDetail", "isPlaying"]),
	},
	filters: {
		// 格式化索引
		formatIndex(index) {
			if (index < 9) {
				return "0" + (index + 1);
			} else return index + 1;
		},
	},
	methods: {
		/* 
    网络请求
    */
		//获取最新歌曲
		getNewSongsBy(type) {
			getNewSongs(type).then(res => {
				this.musiclist = res.data.data;
			});
		},
		/* 
    事件监听
    */
		//分类导航
		typeItemClick(code) {
			//   console.log(code);
			this.activeCode = code;
			this.getNewSongsBy(code);
		},

		// 点击播放全部按钮
		playAll() {
			let formatSongList = [];
			this.musiclist.forEach(song => {
				formatSongList.push(this.getSongInfo(song));
			});
			this.$store.dispatch("addAllSong", formatSongList);
			//默认播放第一首歌
			getSongUrl(formatSongList[0].id).then(res => {
				this.$store.dispatch("saveSongUrl", res.data.data[0].url);
			});
			//提交vuex保存当前歌曲详情
			this.$store.dispatch("saveSongDetail", formatSongList[0]);
		},
		// 提取需要的歌曲信息
		getSongInfo(song) {
			let nowSongInfo = { al: {}, ar: [{}] };
			nowSongInfo.id = song.id; //歌曲id
			nowSongInfo.name = song.name; //歌曲名
			nowSongInfo.dt = song.duration; //歌曲时长
			nowSongInfo.al.picUrl = song.album.picUrl; //专辑封面
			nowSongInfo.al.name = song.album.name; //专辑名
			nowSongInfo.al.id = song.album.id; //专辑id
			nowSongInfo.ar[0].name = song.artists[0].name; //歌手名
			nowSongInfo.ar[0].id = song.artists[0].id; //歌手id
			if (song.mvid != 0) {
				nowSongInfo.mv = song.mvid; //mv的id
			}
			return nowSongInfo;
		},
		//播放音乐
		playMusic(song) {
			checkMusic(song.id)
				.then(res => {
					// 提交歌曲url
					getSongUrl(song.id).then(res => {
						this.$store.dispatch("saveSongUrl", res.data.data[0].url);
					});
					// 更新播放状态
					this.$store.dispatch("changePlayState", true);
					//提交vuex保存当前歌曲详情
					this.$store.dispatch("saveSongDetail", this.getSongInfo(song));
					// 提交vuex添加到播放列表
					this.$store.dispatch("addPlayinglist", this.getSongInfo(song));
				})
				.catch(err => {
					this.$message({
						message: "暂时无法播放，换首试试",
						type: "warning",
						center: true,
					});
				});
		},
		// 实现当前播放歌曲行高亮
		tableRowClassName({ row, rowIndex }) {
			row.index = rowIndex;
			if (rowIndex % 2 !== 0) {
				return "rowEven";
			}
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
	},
};
</script>

<style lang="less" scoped>
.hd {
	.type-nav {
		.el-menu-item {
			color: #303133;
			height: 30px;
			line-height: 30px;
			padding: 0 8px;
		}
		.el-menu--horizontal > .el-menu-item.is-active {
			border-bottom: 2px solid #000;
			color: #000;
		}
	}
	.btn {
		display: flex;
		justify-content: space-between;
		margin: 10px 0;
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
	padding: 5px 0 0 5px;
}
.sthover:hover {
	display: inline-block;
	color: var(--themeColor);
	width: 100%;
	cursor: pointer;
}
.cover {
	position: relative;
	width: 60px;
	height: 60px;
	img {
		width: 100%;
	}
	.mask {
		position: absolute;
		top: 0;
		left: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		height: 100%;
		color: #fff;
		cursor: pointer;
		.iconfont {
			font-size: 22px;
			&:hover {
				background: rgba(100, 100, 100, 0.7);
				border-radius: 50%;
			}
		}
	}
}
</style>
