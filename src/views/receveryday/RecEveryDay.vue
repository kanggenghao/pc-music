<template>
	<div class="rec-everyday w">
		<div class="logined" v-if="$store.state.isLogin">
			<div class="hd">
				<div class="nowdata">
					<div class="left-date">
						<p>{{ getNowDay }}</p>
						<div class="nowday">{{ getNowDate }}</div>
					</div>
					<div class="right-text">
						<h2>每日歌曲推荐</h2>
						<div>根据你的音乐口味生成，每天6:00更新</div>
					</div>
				</div>
				<div class="btn">
					<el-button type="primary" icon="el-icon-video-play" @click="playAll">播放全部</el-button>
					<el-button icon="el-icon-folder-add">收藏全部</el-button>
				</div>
			</div>
			<div class="bd">
				<SongTable :songs="recsongs" />
			</div>
		</div>
		<div class="nologin" v-else>
			<el-empty description="登录后才能查看" :image-size="200"></el-empty>
		</div>
	</div>
</template>

<script>
import { getRecSongs } from "network/receveryday/receveryday";
import { getSongUrl } from "network/playmusic/playmusic.js";
import SongTable from "components/content/SongTable.vue";
export default {
	name: "RecEveryDay",
	components: { SongTable },
	data() {
		return {
			recsongs: [],
		};
	},
	computed: {
		getNowDate() {
			// 创建日期对象
			var date = new Date();
			var dates = date.getDate(); //返回的是几号
			return dates;
		},
		getNowDay() {
			// 创建日期对象
			var date = new Date();
			var day = date.getDay(); // 返回的是0-6，其中0代表星期日
			// 将星期一到星期日存放到数组中 通过返回的数字当做索引号 取出对应的星期几 其中0代表星期日 所以放在第一个位置
			var arr = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
			return arr[day];
		},
	},
	created() {
		if (!this.$store.state.isLogin) {
			this.$message({
				type: "warning",
				message: "登录后才能查看",
				showClose: true,
				center: true,
			});
			return;
		}
		// 获取每日推荐歌曲
		getRecSongs().then(res => {
			this.recsongs = res.data.data.dailySongs;
		});
	},
	methods: {
		playAll() {
			this.$store.dispatch("addAllSong", this.recsongs);
			//默认播放第一首歌
			getSongUrl(this.recsongs[0].id).then(res => {
				this.$store.dispatch("saveSongUrl", res.data.data[0].url);
			});
			//提交vuex保存当前歌曲详情
			this.$store.dispatch("saveSongDetail", this.recsongs[0]);
		},
	},
	activated() {
		document.querySelector(".view").scrollTop = 0;
	},
};
</script>

<style lang="less" scoped>
.nowdata {
	display: flex;
	.left-date {
		width: 100px;
		height: 100px;
		border: 1px solid #ddd;
		text-align: center;
		p {
			font-size: 16px;
			padding: 3px 0;
		}
		.nowday {
			font-size: 52px;
			color: var(--themeColor);
		}
	}
	.right-text {
		padding-left: 20px;
		h2 {
			padding-bottom: 20px;
		}
	}
}
.btn {
	margin: 20px 0;
}
</style>
