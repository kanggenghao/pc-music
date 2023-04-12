<template>
	<div class="newsongs">
		<div class="top-nav">
			<TabBar :tabitems="tabitems" @tabItemClick="tabItemClick" />
		</div>
		<div class="new-content">
			<NewMusic v-if="activeItem == 0" />
			<NewAlbum v-if="activeItem == 1" />
		</div>
	</div>
</template>

<script>
import TabBar from "components/common/TabBar.vue";
import NewMusic from "./Childcomps/NewMusic.vue";
import NewAlbum from "./Childcomps/NewAlbum.vue";
export default {
	name: "NewSongs",
	components: { TabBar, NewMusic, NewAlbum },
	data() {
		return {
			tabitems: [{ name: "新歌速递" }, { name: "新碟上架" }],
			activeItem: 0,
		};
	},
	created() {},
	methods: {
		/* 
    事件监听
     */
		tabItemClick(index) {
			this.activeItem = index;
		},
	},
};
</script>

<style lang="less" scoped>
.top-nav {
	width: 100%;
	display: flex;
	justify-content: center;
}
</style>
>
