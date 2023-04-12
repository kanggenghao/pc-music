<template>
	<div class="singer-list" v-if="singerlist.length !== 0">
		<SingerListItem v-for="(item, index) in singerlist" :key="index" :singeritem="item" />
	</div>
</template>
<script>
import SingerListItem from "./SingerListItem.vue";
export default {
	name: "Singerlist",
	components: { SingerListItem },
	props: {
		singerlist: {
			type: Array,
			default() {
				return [];
			},
		},
	},
};
</script>

<style lang="less" scoped>
.singer-list {
	display: grid;
	justify-content: space-between;
	align-content: space-between;
	grid-template-rows: repeat(8, auto-fill);
	grid-template-columns: repeat(6, 15%);
}
</style>
