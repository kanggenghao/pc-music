<template>
	<div class="hot-song">
		<SongTable :songs="hotsong" />
	</div>
</template>

<script>
import SongTable from "components/content/SongTable.vue";
export default {
	name: "SingerHotsong",
	components: { SongTable },
	props: {
		hotsong: {
			type: Array,
			default() {
				return [];
			},
		},
	},
	data() {
		return {};
	},
};
</script>

<style lang="less" scoped></style>
