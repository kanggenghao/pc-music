<template>
	<div class="similar-video">
		<h2>相关推荐</h2>
		<simi-video-item :simiitem="item" v-for="(item, index) in similarvideo" :key="index"></simi-video-item>
	</div>
</template>
<script>
import SimiVideoItem from "./SimiVideoItem.vue";
export default {
	components: { SimiVideoItem },
	name: "Similarvideo",
	props: {
		similarvideo: {
			type: Array,
			default() {
				return [];
			},
		},
		type: {
			type: String,
		},
	},
};
</script>

<style lang="less" scoped></style>
