<template>
	<div class="video-res">
		<div class="result">
			<h3>
				搜索<span>{{ this.keywords }}</span
				>,找到{{ videoResCount }}个视频
			</h3>
		</div>
		<VideoList :videolist="videoRes" />
		<Pagination :total="videoResCount" :page-size="40" @handleCurrentChange="getSearchVideoBy" />
	</div>
</template>

<script>
import { getSearchVideo } from "network/searchdetail/searchdeatil";
import VideoList from "components/content/videolist/VideoList.vue";
export default {
	name: "VideoRes",
	components: { VideoList },
	data() {
		return {
			keywords: "", //关键词
			videoRes: [],
			videoResCount: 0,
		};
	},
	created() {
		// 保存搜索的关键词
		this.keywords = this.$route.params.keywords;
		this.getSearchVideoBy();
	},
	methods: {
		getSearchVideoBy(page = 1) {
			let offset = (page - 1) * 40;
			getSearchVideo(this.keywords, offset).then(res => {
				this.videoRes = res.data.result.videos;
				this.videoResCount = res.data.result.videoCount;
			});
		},
	},
};
</script>

<style lang="less" scoped>
.result {
	padding: 10px 0px 15px;
}
</style>
