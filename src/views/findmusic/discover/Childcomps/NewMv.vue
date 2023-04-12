<template>
	<div class="newmv" v-if="newmv.length !== 0">
		<div class="hd">
			<el-divider content-position="left"><h2>最新MV</h2></el-divider>
		</div>
		<div class="bd">
			<VideoList :videolist="newmv" />
		</div>
	</div>
</template>
<script>
import VideoList from "components/content/videolist/VideoList.vue";
export default {
	name: "Newmv",
	components: { VideoList },
	props: {
		newmv: {
			type: Array,
			default() {
				return [];
			},
		},
	},
	methods: {
		videoItemClick(id) {
			this.$router.push("/videolistdetail/" + id);
		},
	},
};
</script>

<style lang="less" scoped></style>
