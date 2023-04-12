<template>
	<div class="playing-song-detail" ref="playingSongDetail">
		<!-- 返回顶部按钮 -->
		<el-backtop target=".playing-song-detail" :right="20" :bottom="75" id="playBackTop"></el-backtop>
		<!-- 关闭按钮 -->
		<span class="iconfont icon-down-arrow" @click="closeSongDetail"></span>
		<!-- 主要内容 -->
		<div class="main-content" v-if="Object.keys(nowSongDetail).length !== 0">
			<!-- 顶部歌词相关内容 -->
			<div class="top-lyrics">
				<!-- 左侧旋转唱片 -->
				<div class="left-cover">
					<!-- 唱片开关旋转 -->
					<div class="switchs swichsRotate" :class="{ swichsPlay: isPlaying, switchsPause: !isPlaying }">
						<img src="~assets/imgs/cp1.png" alt="" />
					</div>
					<!-- 唱片旋转 -->
					<div class="record record-rotate" :class="{ startRotate: isPlaying }" @click="isPlaying ? pausePlay() : startPlay()">
						<img class="cp2" src="~assets/imgs/cp2.png" alt="" />
						<img class="cover" :src="cover" alt="" />
					</div>
					<img :src="cover" alt="" class="song-bgImg" />
				</div>
				<!-- 右侧歌词 -->
				<div class="right-lyrics">
					<div class="hd">
						<h2>{{ nowSongDetail.name }}</h2>
						<div v-if="nowSongDetail.al.name">
							专辑：<span @click="toAlbum">{{ nowSongDetail.al.name }}</span>
						</div>
						<div>
							歌手：<span @click="toSinger">{{ nowSongDetail.ar[0].name }}</span>
						</div>
					</div>
					<div class="bd" id="scrollLyric" ref="scrollLyric">
						<!-- 有歌词时 -->
						<!-- <div class="plac" style="height: 135px"></div> -->
						<ul v-if="formatlyric.length !== 0">
							<li
								v-for="(item, index) in formatlyric"
								:key="index"
								:class="{ currentLyric: currentRow == index }"
								@click="lyricClick(item, index)"
								@mouseover="showTime(index)"
								@mouseleave="isActive = false"
							>
								<span class="playIcon" v-show="isActive && currentIndex == index">
									<i class="iconfont icon-play"></i>
								</span>
								<span class="lyric-item">{{ item.text.trim() }}</span>
								<span class="time" v-show="isActive && currentIndex == index">{{ item.time | formatDuration }}</span>
							</li>
						</ul>
						<!-- 没有歌词时 -->
						<div style="padding-top: 120px" v-else>
							<h2>暂无歌词，请您欣赏</h2>
						</div>
					</div>
				</div>
			</div>
			<!-- 底部评论 -->
			<div class="bot-content" ref="comment">
				<!-- 评论 -->
				<div class="song-comment">
					<CommentPage :comment-type="0" :commentres-id="nowSongDetail.id" @changePage="changePage" @toUserDetail="toUserDetail" />
				</div>
			</div>
		</div>
		<div class="nosongdetail" v-if="Object.keys(nowSongDetail).length == 0">
			<div>暂无音乐</div>
		</div>
	</div>
</template>

<script>
/* 网络请求 */
import { getNowLyric } from "network/playmusic/playmusic";
/* vuex */
import { mapGetters } from "vuex";
/* 子组件 */
import CommentPage from "components/content/comment/commentPage.vue";
export default {
	name: "PlayingSongDetail",
	components: { CommentPage },
	computed: {
		...mapGetters(["isPlaying", "nowSongDetail", "currentSecond", "isShowSongDetail", "currentRow"]),
		cover() {
			return this.nowSongDetail.al.picUrl + "?param=200y200";
		},
	},
	data() {
		return {
			formatlyric: [], //格式化后的歌词
			currentIndex: null, //当前鼠标经过的歌词索引
			isActive: false, //鼠标是否经过歌词
		};
	},
	created() {
		if (Object.keys(this.nowSongDetail).length != 0) {
			this.getNowLyricBy(this.nowSongDetail.id);
		}
	},
	methods: {
		// 关闭歌曲详情页
		closeSongDetail() {
			this.$store.commit("showSongDetail");
		},
		//   获取歌词
		getNowLyricBy(songId) {
			getNowLyric(songId).then(res => {
				if (res.data.nolyric) return; //如果没有歌词就return
				let lyric = res.data.lrc.lyric;
				this.formatLyric(lyric);
				this.$store.dispatch("saveCurrentLyric", this.formatlyric);
			});
		},
		// 格式化歌词
		formatLyric(lyric_str) {
			// 将歌词字符串 根据换行符 转换为 数组
			let lyric_arr = lyric_str.split("\n");
			// 遍历歌词数组
			for (let i = 0; i < lyric_arr.length; i++) {
				//得到每一行歌词
				let lyric_row = lyric_arr[i];
				//再将每一行歌词根据”]“分隔为时间和歌词,变为每行歌词数组
				let lyric_row_arr = lyric_row.split("]");
				// 通过pop()方法得到每行歌词文本
				let lryic_row_text = lyric_row_arr.pop();
				// 处理每行歌词时间
				lyric_row_arr.forEach((item, index) => {
					let LyricRowObj = {};
					let time_arr = item.substr(1, item.length - 1).split(":"); //去掉"[",并且分离出 分钟和秒
					// 将每行歌词时间转换为秒
					let seconds_row = time_arr[0] * 60 + Math.ceil(time_arr[1]);
					// 将每行歌词时间和文本添加到每行歌词对象中
					if (lryic_row_text.trim().length !== 0) {
						LyricRowObj.time = seconds_row;
						LyricRowObj.text = lryic_row_text;
						//再将每行歌词对象添加到数组中
						this.formatlyric.push(LyricRowObj);
					}
				});
			}
			// 根据时间对歌词排序
			this.formatlyric.sort((a, b) => {
				return a.time - b.time;
			});
		},
		// 点击歌词播放
		lyricClick(lyric) {
			let audio = document.querySelector("#audio");
			audio.currentTime = lyric.time;
			this.isActive = false;
		},
		// 歌词上是否显示时间
		showTime(index) {
			this.currentIndex = index;
			this.isActive = true;
		},
		/* 评论分页事件 */
		changePage() {
			// 返回指定位置
			this.$refs.playingSongDetail.scrollTo({
				top: this.$refs.comment.offsetTop,
			});
		},
		// 去往专辑页面
		toAlbum() {
			this.$router.push("/albumdetail/" + this.nowSongDetail.al.id);
			this.closeSongDetail(); //关闭当前歌曲详情页
		},
		// 去往歌手界面
		toSinger() {
			this.$router.push("/singerdetail/" + this.nowSongDetail.ar[0].id);
			this.closeSongDetail(); //关闭当前歌曲详情页
		},
		//去往用户界面 需要关闭当前歌曲详情页
		toUserDetail() {
			this.closeSongDetail();
		},
		pausePlay() {
			this.$store.dispatch("changePlayState", false);
			document.querySelector("#audio").pause();
		},
		startPlay() {
			this.$store.dispatch("changePlayState", true);
			document.querySelector("#audio").play();
		},
	},
	watch: {
		// 监听当前时间的变化，实现滚动
		currentSecond(currentSecond) {
			if (currentSecond != 0) {
				// 遍历格式化后的歌词数组
				this.formatlyric.forEach((item, index) => {
					// 如果歌曲当前秒数和歌词数组中的秒数相等
					// 这里写==可以在使用原生scroll实现歌词滚动的时候不抖动，如果写>=会抖动
					if (Math.ceil(currentSecond) == item.time) {
						//.1 使用位移来实现歌词滚动
						// this.$refs.scrollLyric.style.transform = `translateY(${-45 * index}px)`;
						//.2 使用原生scroll实现歌词滚动
						this.$store.commit("saveCurrentRow", index); //用于判断当前歌词高亮显示(使用vuex是因为在footer中使用到了currentRow)
						// 当鼠标经过时停止滚动
						if (!this.isActive) {
							this.$refs.scrollLyric.scrollTo({
								top: 45 * index,
								behavior: "smooth",
							});
						}
					}
				});
			}
		},
		// 监听当前歌曲变化
		nowSongDetail() {
			if (Object.keys(this.nowSongDetail).length != 0) {
				// 歌曲改变后从新获取歌词
				this.formatlyric = [];
				// this.$refs.scrollLyric.style.transform = "translateY(0px)";
				this.getNowLyricBy(this.nowSongDetail.id);
				this.$store.commit("saveCurrentRow", null);
			}
		},
		// 当打开歌曲详情页时歌词立即滚动到当前播放行
		isShowSongDetail() {
			if (this.isShowSongDetail && Object.keys(this.nowSongDetail).length != 0) {
				this.$refs.scrollLyric.scrollTop = 45 * this.currentRow;
				this.$refs.playingSongDetail.scrollTop = 0;
			}
		},
	},
};
</script>

<style lang="less" scoped>
.playing-song-detail {
	position: absolute;
	bottom: 70px;
	left: 0;
	right: 0;
	width: 100%;
	height: calc(100vh - 70px);
	background: #fff;
	z-index: 99;
	overflow-y: scroll;
	// 关闭页面按钮
	.icon-down-arrow {
		position: fixed;
		top: 10px;
		left: 20px;
		font-size: 32px;
		font-weight: 700;
		cursor: pointer;
	}
	// 音乐详情
	.main-content {
		position: relative;
		width: 1350px;
		height: 100%;
		margin: 0 auto;
		.top-lyrics {
			display: flex;
			justify-content: center;
			align-items: center;
			width: 70%;
			height: 500px;
			margin: 0px auto;
			// 旋转唱片
			.left-cover {
				position: relative;
				display: flex;
				justify-content: center;
				align-items: center;
				height: 100%;
				width: 30%;
				.switchs {
					position: absolute;
					left: 50%;
					top: 8%;
					z-index: 2;
					width: 40%;
					transform-origin: 0 0; //设置旋转元素的基点位置
					img {
						width: 100%;
					}
				}
				.record {
					position: relative;
					width: 100%;
					.cp2 {
						width: 100%;
					}
					.cover {
						position: absolute;
						left: 50%;
						top: 50%;
						transform: translate(-50%, -50%);
						z-index: -1;
						width: 70%;
						border-radius: 50%;
					}
				}
				.song-bgImg {
					position: absolute;
					top: 50%;
					left: -90%;
					z-index: -1;
					width: 300%;
					border-radius: 20%;
					transform: translate(10%, -50%);
					filter: blur(350px) brightness(100%);
				}
			}
			// 右侧歌词
			.right-lyrics {
				width: 55%;
				.hd {
					text-align: center;
					div {
						padding-top: 10px;
						span {
							cursor: pointer;
							color: #5091ca;
						}
					}
				}
				.bd {
					margin-top: 20px;
					height: 315px;
					text-align: center;
					overflow-y: auto;
					// 有歌词
					ul {
						padding: 135px 0;
						// overflow: auto;
						// transform: translateY(0);
						// transition: all 0.5s;
						li {
							display: flex;
							height: 45px;
							transition: all 0.3s ease-in;
							// line-height: 45px;
							// white-space: nowrap;
							// overflow: hidden;
							// text-overflow: ellipsis;
							&:hover {
								cursor: pointer;
								// font-weight: 700;
							}
							.lyric-item {
								flex: 1;
							}
							.time,
							.playIcon {
								display: inline-block;
								width: 50px;
								height: 50px;
							}
						}
						.currentLyric {
							font-size: 18px;
							font-weight: 700;
						}
					}
				}
				::-webkit-scrollbar {
					width: 0px;
				}
			}
		}
		.bot-content {
			margin: 15px auto;
			width: 70%;
			.song-comment {
				padding-bottom: 15px;
			}
		}
	}
	// 暂无音乐
	.nosongdetail {
		display: flex;
		height: 100%;
		justify-content: center;
		align-items: center;
		font-size: 24px;
		font-weight: 700;
	}
}
// 唱片开关旋转动画
.swichsRotate {
	animation-play-state: paused;
}
.swichsPlay,
.switchsPause {
	animation-timing-function: linear;
	animation-duration: 0.35s;
	animation-fill-mode: forwards;
	animation-play-state: running;
}
.swichsPlay {
	animation-name: switchsPlay;
}
.switchsPause {
	animation-name: switchsPause;
}
@keyframes switchsPlay {
	0% {
		transform: rotate(-5deg);
	}
	100% {
		transform: rotate(20deg);
	}
}
@keyframes switchsPause {
	0% {
		transform: rotate(20deg);
	}
	100% {
		transform: rotate(-5deg);
	}
}
// 唱片旋转
.record-rotate {
	animation-name: recordRotate;
	animation-duration: 20s;
	animation-timing-function: linear;
	animation-iteration-count: infinite;
	animation-play-state: paused;
}
.startRotate {
	animation-play-state: running;
}
@keyframes recordRotate {
	0% {
		transform: rotate(0deg);
	}
	100% {
		transform: rotate(360deg);
	}
}
</style>
