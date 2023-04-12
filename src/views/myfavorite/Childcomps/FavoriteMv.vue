<template>
	<div class="favorite-mv">
		<el-divider content-position="left"
			><h2>我收藏的视频和MV({{ mvcount }})</h2></el-divider
		>
		<VideoList :videolist="favoriteMv" />
		<div v-if="favoriteMv.length == 0">
			<el-empty description="还没有收藏的视频" :image-size="200"></el-empty>
		</div>
	</div>
</template>

<script>
import { getSubMv } from "network/myfavorite/myfavorite";
import { mapGetters } from "vuex";
import VideoList from "components/content/videolist/VideoList.vue";
export default {
	name: "FavoriteMv",
	components: { VideoList },
	computed: {
		...mapGetters(["subMvlist"]),
	},
	data() {
		return {
			favoriteMv: [],
			mvcount: 0,
		};
	},
	methods: {
		getSubMvBy() {
			getSubMv().then(res => {
				this.favoriteMv = res.data.data;
				this.mvcount = res.data.count;
				this.$store.dispatch("saveFavoriteMv", res.data.data);
			});
		},
	},
	created() {
		if (this.subMvlist.length == 0) {
			this.getSubMvBy();
		} else {
			this.favoriteMv = this.subMvlist;
			this.mvcount = this.subMvlist.length;
		}
	},
};
</script>

<style lang="less" scoped></style>
