<template>
	<div class="rank-global">
		<div class="hd">
			<el-divider content-position="left"><h2>全球榜</h2></el-divider>
		</div>
		<div class="bd">
			<SongList :songlist="rankglobal" />
		</div>
	</div>
</template>

<script>
import SongList from "components/content/songlist/SongList.vue";
export default {
	components: { SongList },
	name: "Rankglobal",
	props: {
		rankglobal: {
			type: Array,
			default() {
				return [];
			},
		},
	},
};
</script>

<style lang="less" scoped></style>
