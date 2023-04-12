<template>
	<div class="singer-res">
		<div class="result">
			<h3>
				搜索<span>{{ this.keywords }}</span
				>,找到{{ singerResCount }}位歌手
			</h3>
		</div>
		<Singerlist :singerlist="singerRes" />
		<Pagination :total="singerResCount" :page-size="30" @handleCurrentChange="getSearchSingerBy" />
	</div>
</template>

<script>
import { getSearchSinger } from "network/searchdetail/searchdeatil";
import Singerlist from "components/content/singerlist/Singerlist.vue";
export default {
	name: "SingerRes",
	components: { Singerlist },
	data() {
		return {
			keywords: "", //关键词
			singerRes: [], //歌手
			singerResCount: 0,
		};
	},

	created() {
		// 保存搜索的关键词
		this.keywords = this.$route.params.keywords;
		this.getSearchSingerBy();
	},

	methods: {
		getSearchSingerBy(page = 1) {
			let offset = (page - 1) * 30;
			getSearchSinger(this.keywords, offset).then(res => {
				this.singerRes = res.data.result.artists;
				this.singerResCount = res.data.result.artistCount;
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
