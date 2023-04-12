<template>
	<div class="rec-newsong" v-if="newsong.length !== 0">
		<div class="hd">
			<el-divider content-position="left"><h2>最新音乐</h2></el-divider>
		</div>
		<div class="bd">
			<div class="item" v-for="(item, index) in newsong" :key="index" @dblclick="playMusic(item)">
				<div class="item-img" @click="playMusic(item)">
					<img v-lazy="item.picUrl+'?param=80y80'" alt="" />
					<div class="icon">
						<span class="iconfont icon-play1"></span>
					</div>
				</div>
				<div class="item-text">
					<p class="sname">{{ item.name }}</p>
					<p class="by">{{ item.song.artists[0].name }}</p>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { getSongUrl, checkMusic } from "network/playmusic/playmusic.js";
import { getEverySongDetail } from "network/songlistdetail/songlistdetail";
export default {
	name: "RecNewSong",
	props: {
		newsong: {
			type: Array,
			default() {
				return [];
			},
		},
	},
	data() {
		return {
			songurl: "",
			song: [],
		};
	},
	methods: {
		playMusic(song) {
			checkMusic(song.id)
				.then(res => {
					// 获取歌曲url
					getSongUrl(song.id).then(res => {
						this.songurl = res.data.data[0].url;
						this.$store.dispatch("saveSongUrl", this.songurl);
					});
					/* 根据歌曲id获取每首歌的信息*/
					getEverySongDetail(song.id).then(res => {
						this.song = res.data.songs[0];
						// 提交vuex保存当前歌曲详情
						this.$store.dispatch("saveSongDetail", this.song);
						// 提交vuex添加到播放列表
						this.$store.dispatch("addPlayinglist", this.song);
					});
				})
				.catch(err => {
					this.$message({
						message: "暂时无法播放，换首试试",
						type: "warning",
						center: true,
					});
				});
		},
	},
};
</script>

<style lang="less" scoped>
.rec-newsong {
	.bd {
		display: flex;
		flex-wrap: wrap;
		width: 100%;
		.item {
			display: flex;
			align-items: center;
			width: 33%;
			margin-bottom: 10px;
			&:hover {
				background: rgb(245, 245, 245, 0.3);
			}
			.item-img {
				position: relative;
				flex: 1;
				img {
					width: 100%;
				}
				.icon {
					position: absolute;
					top: 0;
					left: 0;
					display: flex;
					align-items: center;
					justify-content: center;
					width: 100%;
					height: 100%;
					cursor: pointer;
					.iconfont {
						font-size: 32px;
						color: #fff;
						cursor: pointer;
						&:hover {
							background: rgba(100, 100, 100, 0.7);
							border-radius: 50%;
						}
					}
				}
			}
			.item-text {
				flex: 4;
				padding-left: 10px;
				.sname {
					width: 200px;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}
				.by {
					padding-top: 5px;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}
			}
		}
	}
}
</style>
