<template>
	<div class="song-res">
		<div class="result">
			<h3>
				搜索<span>{{ this.keywords }}</span
				>,找到{{ songResCount }}首单曲
			</h3>
			<div class="match" v-if="Object.keys(matchSinger).length !== 0 || Object.keys(matchAlbum).length !== 0">
				<h3>最佳匹配</h3>
				<div class="goodMatch">
					<div class="matchitem" @click="goSingerdetail" v-if="Object.keys(matchSinger).length !== 0">
						<div class="cover">
							<img v-lazy="matchSinger.img1v1Url" alt="" />
						</div>
						<div class="iname">
							<span>歌手：{{ matchSinger.name }}</span>
							<span class="iconfont icon-xiayiye"></span>
						</div>
					</div>
					<div class="matchitem" @click="goAlbumdetail" v-if="Object.keys(matchAlbum).length !== 0">
						<div class="cover">
							<img v-lazy="matchAlbum.picUrl" alt="" />
						</div>
						<div class="iname">
							<span>专辑：{{ matchAlbum.name }}</span>
							<span class="iconfont icon-xiayiye"></span>
						</div>
					</div>
				</div>
			</div>
		</div>
		<SongTable :songs="songRes" />
		<Pagination :total="songResCount" :page-size="50" @handleCurrentChange="getSearchSongBy"/>
	</div>
</template>

<script>
/* 网络请求 */
import { getSearchSong, getGoodMatch } from "network/searchdetail/searchdeatil";
import SongTable from "components/content/SongTable.vue";
export default {
	name: "SongRes",
	components: { SongTable},
	data() {
		return {
			keywords: "", //关键词
			songRes: [], //单曲
			songResCount: 0,
			matchSinger: {}, //最佳匹配歌手
			matchAlbum: {},
		};
	},

	created() {
		// 保存搜索的关键词
		this.keywords = this.$route.params.keywords;
		// 获取搜索歌曲列表
		this.getSearchSongBy();
		// 获取最佳匹配结果
		this.getGoodMatchBy();
	},
	methods: {
		/* 
    网络请求
    */
		// 获取搜索歌曲列表
		getSearchSongBy(page = 1) {
			let offset = (page - 1) * 50;
			getSearchSong(this.keywords, offset).then(res => {
				this.songRes = res.data.result.songs;
				this.songResCount = res.data.result.songCount;
			});
		},
		// 获取最佳匹配结果
		getGoodMatchBy() {
			getGoodMatch(this.keywords)
				.then(res => {
					// console.log(res);
					this.matchSinger = res.data.result.artist[0];
					this.matchAlbum = res.data.result.album[0];
				})
				.catch(err => err);
		},

		/* 
    事件监听
    */
		// 分页事件
		// changSongPage(page) {
		// 	this.getSearchSongBy(page);
		// },

		// 最佳匹配事件
		goSingerdetail() {
			this.$router.push("/singerdetail/" + this.matchSinger.id);
		},
		goAlbumdetail() {
			this.$router.push("/albumdetail/" + this.matchAlbum.id);
		},
	},
};
</script>
<style lang="less" scoped>
.result {
	padding: 10px 15px;
	h3 {
		padding-bottom: 10px;
	}
}
.goodMatch {
	padding: 5px 0;
	display: flex;
	cursor: pointer;
	.matchitem {
		width: 20%;
		display: flex;
		align-items: center;
		margin-right: 20px;
		border: 1px solid #dddddd;
		&:hover {
			font-weight: 700;
		}
		.cover {
			flex: 1;
			img {
				width: 100%;
			}
		}
		.iname {
			display: flex;
			justify-content: space-between;
			align-items: center;
			flex: 2;
			height: 100%;
			padding: 0 5px;
			background: #f5f5f5;
		}
	}
}
</style>
