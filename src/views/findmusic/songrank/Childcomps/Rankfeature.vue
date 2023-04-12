<template>
	<div class="rank-feature">
		<div class="hd">
			<el-divider content-position="left"><h2>流行榜</h2></el-divider>
		</div>
		<div v-for="(item, index) in rankfeature" :key="index">
			<RankfeatureChild :item="item"/>
		</div>
	</div>
</template>

<script>
import RankfeatureChild from "./RankfeatureChild.vue";
export default {
	name: "Rankfeature",
	components: { RankfeatureChild },
	props: {
		rankfeature: {
			type: Array,
			default() {
				return [];
			},
		},
	},
	data() {
		return {
			isShowPlay: false,
		};
	},
	methods: {
		rankClick(id) {
			//点击后根据歌单id 跳转歌单详情页
			this.$router.push("/songlistdetail/" + id);
		},
		showIcon() {
			this.isShowPlay = true;
		},
		closeIcon() {
			this.isShowPlay = false;
		},
	},
};
</script>

<style lang="less" scoped></style>
