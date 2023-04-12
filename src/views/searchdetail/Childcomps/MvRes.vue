<template>
	<div class="mv-res">
		<div class="result">
			<h3>
				搜索<span>{{ this.keywords }}</span
				>,找到{{ mvResCount }}个MV
			</h3>
		</div>
		<VideoList :videolist="mvRes" />
		<Pagination :total="mvResCount" :page-size="40" @handleCurrentChange="getSearchMvBy" />
	</div>
</template>

<script>
import { getSearchMv } from "network/searchdetail/searchdeatil";
import VideoList from "components/content/videolist/VideoList.vue";
export default {
	name: "MvRes",
	components: { VideoList },
	data() {
		return {
			keywords: "", //关键词
			mvRes: [],
			mvResCount: 0,
		};
	},
	created() {
		// 保存搜索的关键词
		this.keywords = this.$route.params.keywords;
		this.getSearchMvBy();
	},
	methods: {
		getSearchMvBy(page = 1) {
			let offset = (page - 1) * 40;
			getSearchMv(this.keywords, offset).then(res => {
				this.mvRes = res.data.result.mvs;
				this.mvResCount = res.data.result.mvCount;
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
