<template>
	<div class="bd">
		<div class="left-img" @click="rankClick(item.id)" @mouseenter="showIcon" @mouseleave="closeIcon">
			<transition name="el-fade-in-linear">
				<div class="mask-playicon" v-show="isShowPlay">
					<span class="iconfont icon-play"></span>
				</div>
			</transition>
			<div class="time">{{ item.updateTime | showDate }}更新</div>
			<img :src="item.coverImgUrl" alt="" />
		</div>
		<!-- 右侧歌曲列表 -->
		<div class="right-songlist">
			<div v-if="songs.length != 0">
				<el-table size="small" :data="songs" stripe style="width: 100%" :show-header="false" @row-dblclick="playMusic" :row-class-name="tableRowClassName">
					<el-table-column label="序号" width="20">
						<template v-slot="scope">
							<span :class="{ hot: scope.row.index < 3 }">{{ scope.row.index | formatIndex }}</span>
						</template>
					</el-table-column>
					<el-table-column prop="name" label="歌曲" :show-overflow-tooltip="true"></el-table-column>
					<el-table-column prop="ar[0].name" align="right" label="歌手" :show-overflow-tooltip="true">
						<template v-slot="scope">
							<span class="by">{{ scope.row.ar[0].name }}</span>
						</template>
					</el-table-column>
				</el-table>
				<div class="more by" @click="rankClick(item.id)">查看全部<span class="iconfont icon-xiayiye"></span></div>
			</div>
			<div v-else>
				<el-skeleton :rows="6" animated />
			</div>
		</div>
	</div>
</template>

<script>
import { getSongListDetail } from "network/songlistdetail/songlistdetail";
import { getSongUrl, checkMusic } from "network/playmusic/playmusic.js";
import { formatDate } from "common/formatDate";
export default {
	name: "RankfeatureChild",
	props: {
		item: {
			type: Object,
			default() {
				return {};
			},
		},
	},
	data() {
		return {
			isShowPlay: false,
			songs: [],
		};
	},
	created() {
		getSongListDetail(this.item.id).then(res => {
			this.songs = res.data.playlist.tracks.slice(0, 5);
		});
	},
	filters: {
		formatIndex(index) {
			return index + 1;
		},
		showDate(value) {
			const date = new Date(value);
			return formatDate(date, "yyyy-MM-dd");
		},
	},
	methods: {
		rankClick(id) {
			//点击后根据歌单id 跳转歌单详情页
			this.$router.push("/songlistdetail/" + id);
			this.isShowPlay = false;
		},
		showIcon() {
			this.isShowPlay = true;
		},
		closeIcon() {
			this.isShowPlay = false;
		},
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
.bd {
	display: flex;
	height: 230px;
	.left-img {
		position: relative;
		width: 200px;
		height: 200px;
		cursor: pointer;
		img {
			height: 100%;
		}
		.time {
			position: absolute;
			top: 130px;
			width: 100%;
			text-align: center;
			color: #fff;
			font-size: 12px;
		}
	}
	.right-songlist {
		width: 84%;
		padding-left: 20px;
		height: 230px;
		.more {
			cursor: pointer;
			font-size: 12px;
			.icon-xiayiye {
				font-size: 12px;
			}
		}
	}
}
.hot {
	color: var(--themeColor);
}
</style>
