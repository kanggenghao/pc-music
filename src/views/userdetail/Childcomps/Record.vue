<template>
	<div class="record w">
		<h2><span class="iconfont icon-paixingbang"></span>听歌排行</h2>
		<div class="date-category">
			<span v-for="(item, index) in dateCategory" :key="index" @click="changeRecoed(item.type)" :class="{ active: currentIndex === index }">{{ item.title }}</span>
		</div>
		<div class="btn" v-if="recordData.length !== 0">
			<el-button type="primary" icon="el-icon-video-play" @click="playAll">播放全部</el-button>
			<el-button icon="el-icon-folder-add">收藏全部</el-button>
		</div>
		<div class="bd" v-if="recordData.length !== 0">
			<SongTable :songs="recordData" />
		</div>
		<div v-else>
			<el-empty description="暂无记录" :image-size="200"></el-empty>
		</div>
	</div>
</template>

<script>
import { getUserRecord } from "network/userdetail/userdetail";
import { getSongUrl } from "network/playmusic/playmusic.js";
import SongTable from "components/content/SongTable.vue";
export default {
	name: "Record",
	components: { SongTable },
	data() {
		return {
			uid: "",
			dateCategory: [
				{ title: "所有时间", type: 0 },
				{ title: "最近一周", type: 1 },
			],
			recordData: [],
			currentIndex: 0,
		};
	},
	created() {
		this.uid = this.$route.params.uid;
		this.getUserRecordBy(this.uid);
	},
	methods: {
		//   获取播放记录
		getUserRecordBy(uid, type = 0) {
			getUserRecord(uid, type)
				.then(res => {
					console.log(res);
					if (res.data.code == 200) {
						if (type === 0) {
							res.data.allData.forEach(item => {
								this.recordData.push(item.song);
							});
						} else if (type === 1) {
							res.data.weekData.forEach(item => {
								this.recordData.push(item.song);
							});
						}
					}
				})
				.catch(err => {
					this.$message({
						type: "warning",
						message: "暂无权限访问",
						showClose: true,
						center: true,
					});
				});
		},
		// 切换记录
		changeRecoed(type) {
			this.getUserRecordBy(this.uid, type);
			this.currentIndex = type;
		},
		playAll() {
			this.$store.dispatch("addAllSong", this.recordData);
			//默认播放第一首歌
			getSongUrl(this.recordData[0].id).then(res => {
				this.$store.dispatch("saveSongUrl", res.data.data[0].url);
			});
			//提交vuex保存当前歌曲详情
			this.$store.dispatch("saveSongDetail", this.recordData[0]);
		},
	},
};
</script>

<style lang="less" scoped>
.iconfont {
	font-size: 36px;
	padding-right: 10px;
}
.date-category {
	margin: 20px 0;
	span {
		padding-right: 10px;
		cursor: pointer;
	}
}
.active {
	font-weight: 700;
}
</style>
