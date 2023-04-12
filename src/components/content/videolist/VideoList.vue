<template>
	<div class="video-list">
		<video-list-item v-for="(item, index) in videolist" :key="index" :videolistitem="item"></video-list-item>
	</div>
</template>

<script>
import VideoListItem from "./VideoListItem.vue";
export default {
	name: "Videolist",
	components: { VideoListItem },
	props: {
		videolist: {
			type: Array,
			default() {
				return [];
			},
		},
	},
};
</script>

<style lang="less" scoped>
.video-list {
	display: grid;
	justify-content: space-between;
	grid-template-rows: repeat(10, auto-fill);
	grid-template-columns: repeat(4, 24%);
}
</style>
