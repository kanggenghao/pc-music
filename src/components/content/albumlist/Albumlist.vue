<template>
	<div class="album-list">
		<AlbumListItem v-for="(item, index) in albumlist" :key="index" :albumlistitem="item" />
	</div>
</template>
<script>
import AlbumListItem from "./AlbumListItem.vue";
export default {
	name: "Albumlist",
	components: { AlbumListItem },
	props: {
		albumlist: {
			type: Array,
			default() {
				return [];
			},
		},
	},
};
</script>

<style lang="less" scoped>
.album-list {
	display: grid;
	justify-content: space-evenly;
	align-content: space-between;
	grid-template-rows: repeat(8, auto-fill);
	grid-template-columns: repeat(5, 20%);
}
</style>
