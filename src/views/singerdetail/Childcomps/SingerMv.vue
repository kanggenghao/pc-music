<template>
	<div class="singer-mv">
		<div class="mv-list">
			<VideoList :videolist="mvlist" />
		</div>
		<Pagination :total="mvsize" :page-size="40" @handleCurrentChange="handleCurrentChange" />
	</div>
</template>

<script>
import VideoList from "components/content/videolist/VideoList.vue";
export default {
	name: "SingerMv",
	components: { VideoList },
	props: {
		mvlist: {
			type: Array,
			default() {
				return [];
			},
		},
		mvsize: {
			type: Number,
			default:0
		},
	},
	methods: {
		/* 分页事件 */
		handleCurrentChange(page) {
			this.$emit("changeMvPage", page);
		},
	},
};
</script>

<style lang="less" scoped>
.mv-list {
	padding-top: 10px;
}
</style>
