<template>
	<div class="album-res">
		<div class="result">
			<h3>
				搜索<span class="key">{{ this.keywords }}</span
				>,找到{{ albumRes.albumCount }}张专辑
			</h3>
		</div>
		<SingerAlbum :albumlist="albumRes.albums" />
		<Pagination :total="albumCount" :page-size="30" @handleCurrentChange="getSearchAlbumBy" />
	</div>
</template>

<script>
import { getSearchAlbum } from "network/searchdetail/searchdeatil";
/* 子组件 */
import Albumlist from "components/content/albumlist/Albumlist.vue";
import SingerAlbum from "../../singerdetail/Childcomps/SingerAlbum.vue";
export default {
	name: "AlbumRes",
	components: { Albumlist, SingerAlbum },
	data() {
		return {
			keywords: "", //关键词
			albumRes: {}, //专辑
			albumCount:0
		};
	},
	created() {
		// 保存搜索的关键词
		this.keywords = this.$route.params.keywords;
		this.getSearchAlbumBy();
	},
	methods: {
		/* 网络请求事件 */
		getSearchAlbumBy(page=1) {
			let offset = (page - 1) * 30;
			getSearchAlbum(this.keywords, offset).then(res => {
				this.albumRes = res.data.result;
				this.albumCount=this.albumRes.albumCount;
			});
		},
	},
};
</script>

<style lang="less" scoped>
.result {
	padding: 15px 10px;
}
</style>
