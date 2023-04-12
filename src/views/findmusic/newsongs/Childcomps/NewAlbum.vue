<template>
	<div>
		<div class="hd">
			<TypeNav :typeitem="typeitem" @typeItemClick="typeItemClick" />
		</div>
		<div class="bd" v-if="newalbum.length != 0">
			<Albumlist :albumlist="newalbum" />
			<Pagination :total="albumCount" :page-size="50" :current-page="currentPage" @handleCurrentChange="changAlbumPage" />
		</div>
	</div>
</template>

<script>
import { getNewAlbum } from "network/findmusic/newsongs/newsongs";
import TypeNav from "./TypeNav.vue";
import Albumlist from "components/content/albumlist/Albumlist.vue";
export default {
	name: "NewAlbum",
	components: { TypeNav, Albumlist },
	data() {
		return {
			typeitem: [
				{ type: "全部", code: "ALL" },
				{ type: "华语", code: "ZH" },
				{ type: "欧美", code: "EA" },
				{ type: "日本", code: "JP" },
				{ type: "韩国", code: "KR" },
			],
			currentArea: "ALL", //当前分类区域
			newalbum: [],
			albumCount: 0,
			currentPage: 1,
		};
	},
	created() {
		this.getNewAlbumBy();
	},
	methods: {
		/* 
    网络请求
    */
		//默认获取全部分类的专辑
		getNewAlbumBy(area = "ALL", page = 1) {
			let offset = (page - 1) * 50;
			getNewAlbum(offset, area).then(res => {
				this.newalbum = res.data.albums;
				this.albumCount = res.data.total;
			});
		},
		/* 
     事件监听
     */
		// 分类导航点击事件
		typeItemClick(area) {
			this.currentArea = area;
			this.getNewAlbumBy(area);
			this.currentPage = 1;
		},
		// 分页事件
		changAlbumPage(page) {
			this.currentPage = page;
			this.getNewAlbumBy(this.currentArea, page);
		},
	},
};
</script>

<style lang="less" scoped>
.bd {
	margin-top: 30px;
}
</style>
