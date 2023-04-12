<template>
	<div class="singer-album">
		<!-- 切换显示模式按钮 -->
		<div class="btn">
			<el-tooltip effect="dark" content="大图模式" placement="left">
				<span class="iconfont icon-card" @click="showList" :class="{ active: isShowList }"></span>
			</el-tooltip>
			<el-tooltip effect="dark" content="列表模式" placement="right">
				<span class="iconfont icon-biaogebeifen" @click="showTable" :class="{ active: isShowTable }"></span>
			</el-tooltip>
		</div>
		<!-- 显示专辑 -->
		<AlbumTable :albumlist="albumlist" v-if="isShowTable" />
		<Albumlist :albumlist="albumlist" v-else-if="isShowList" />
	</div>
</template>

<script>
import Albumlist from "components/content/albumlist/Albumlist.vue";
import AlbumTable from "components/content/albumlist/AlbumTable.vue";
export default {
	name: "SingerAlbum",
	components: { Albumlist, AlbumTable },
	props: {
		albumlist: {
			type: Array,
			default() {
				return [];
			},
		},
	},
	data() {
		return {
			isShowTable: false, //专辑表格显示
			isShowList: true, //专辑列表显示
		};
	},

	methods: {
		/* 切换专辑显示模式 */
		showTable() {
			this.isShowList = false;
			this.isShowTable = true;
		},
		showList() {
			this.isShowList = true;
			this.isShowTable = false;
		},
	},
};
</script>

<style lang="less" scoped>
.btn {
	cursor: pointer;
	padding-bottom: 10px;
	span {
		padding-left: 10px;
	}
	.iconfont {
		font-size: 22px;
	}
	.active {
		color: var(--themeColor);
	}
}
</style>
