<template>
	<div songlist-res>
		<div class="result">
			<h3>
				搜索<span>{{ this.keywords }}</span
				>,找到{{ songlistResCount }}个歌单
			</h3>
		</div>
		<SongList :songlist="songlistRes" />
		<Pagination :total="songlistResCount" :page-size="30" @handleCurrentChange="getSearchSongListBy" />
	</div>
</template>

<script>
import { getSearchSongList } from "network/searchdetail/searchdeatil";
import SongList from "components/content/songlist/SongList.vue";
export default {
	name: "SongListRes",
	components: { SongList },
	data() {
		return {
			keywords: "", //关键词
			songlistRes: [], //歌单
			songlistResCount: 0,
		};
	},

	created() {
		// 保存搜索的关键词
		this.keywords = this.$route.params.keywords;
		this.getSearchSongListBy();
	},

	methods: {
		getSearchSongListBy(page = 1) {
			let offset = (page - 1) * 30;
			getSearchSongList(this.keywords, offset).then(res => {
				// console.log(res);
				this.songlistRes = res.data.result.playlists;
				this.songlistResCount = res.data.result.playlistCount;
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
