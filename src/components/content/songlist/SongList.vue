<template>
	<div class="songlist" v-if="songlist.length !== 0">
		<!-- 歌单列表 -->
		<div class="song-list">
			<song-list-item v-for="(item, index) in songlist" :key="index" :songlistitem="item"></song-list-item>
		</div>
	</div>
</template>

<script>
import SongListItem from "./SongListItem.vue";
export default {
	components: { SongListItem },
	name: "SongList",
	props: {
		songlist: {
			type: Array,
			default() {
				return [];
			},
		},
	},
};
</script>

<style lang="less" scoped>
// 列表
.song-list {
	display: grid;
	justify-content: space-between;
	align-content: space-between;
	grid-template-rows: repeat(8, auto-fill);
	grid-template-columns: repeat(6, 15%);
}
</style>
