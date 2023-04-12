<template>
	<div id="singer">
		<!-- 顶部分类标签 -->
		<div class="top-tags">
			<TagsBar :taglist="areaTags" @tagBarClick="areaClick" />
			<TagsBar :taglist="typeTags" @tagBarClick="typeClick" />
			<TagsBar :taglist="initialTags" @tagBarClick="initialClick" />
		</div>
		<!-- 歌手列表 -->
		<div class="singerlist">
			<Singerlist :singerlist="singerlist" />
		</div>
		<!-- 分页器 -->
		<Pagination v-if="singerlist.length !== 0" :total="total" :page-size="48" :current-page="currentPage" :scroll-top="false" @handleCurrentChange="handleCurrentChange" />
	</div>
</template>
<script>
/* 网络请求 */
import { getSinger } from "network/findmusic/singer/singer";
/* 子组件 */
import TagsBar from "components/content/TagsBar.vue";
import Singerlist from "components/content/singerlist/Singerlist.vue";
export default {
	name: "Singer",
	components: { TagsBar, Singerlist },
	data() {
		return {
			/* 分类标签 */
			areaTags: {
				category: "语种",
				list: [
					{ area: -1, name: "全部" },
					{ area: 7, name: "华语" },
					{ area: 96, name: "欧美" },
					{ area: 8, name: "日本" },
					{ area: 16, name: "韩国" },
					{ area: 0, name: "其它" },
				],
			},
			typeTags: {
				category: "分类",
				list: [
					{ type: -1, name: "全部" },
					{ type: 1, name: "男歌手" },
					{ type: 2, name: "女歌手" },
					{ type: 3, name: "乐队" },
				],
			},
			initialTags: {
				category: "筛选",
				list: [
					{ initial: -1, name: "热门" },
					{ initial: "a", name: "A" },
					{ initial: "b", name: "B" },
					{ initial: "c", name: "C" },
					{ initial: "d", name: "D" },
					{ initial: "e", name: "E" },
					{ initial: "f", name: "F" },
					{ initial: "g", name: "G" },
					{ initial: "h", name: "H" },
					{ initial: "i", name: "I" },
					{ initial: "j", name: "J" },
					{ initial: "k", name: "K" },
					{ initial: "l", name: "L" },
					{ initial: "m", name: "M" },
					{ initial: "n", name: "N" },
					{ initial: "o", name: "O" },
					{ initial: "p", name: "P" },
					{ initial: "q", name: "Q" },
					{ initial: "r", name: "R" },
					{ initial: "s", name: "S" },
					{ initial: "t", name: "T" },
					{ initial: "u", name: "U" },
					{ initial: "v", name: "V" },
					{ initial: "w", name: "W" },
					{ initial: "x", name: "X" },
					{ initial: "y", name: "Y" },
					{ initial: "z", name: "Z" },
					{ initial: 0, name: "#" },
				],
			},
			area: -1,
			type: -1,
			initial: -1,
			singerlist: [],
			currentPage: 1,
			total: 960,
		};
	},

	created() {
		// 获取歌手列表
		this.getSingerBy(this.area, this.type, this.initial, 1);
	},

	methods: {
		/* 网络请求事件 */
		getSingerBy(area, type, initial, page) {
			let offset = (page - 1) * 48;
			getSinger(area, type, initial, offset)
				.then(res => {
					this.singerlist = res.data.artists;
				})
				.catch(err => err);
		},

		/* 标签点击事件 */
		areaClick(item) {
			this.area = item.area;
			this.currentPage = 1;
			this.getSingerBy(this.area, this.type, this.initial, 1);
		},
		typeClick(item) {
			this.type = item.type;
			this.currentPage = 1;
			this.getSingerBy(this.area, this.type, this.initial, 1);
		},
		initialClick(item) {
			this.initial = item.initial;
			this.currentPage = 1;
			this.getSingerBy(this.area, this.type, this.initial, 1);
		},
		/* 分页事件 */
		handleCurrentChange(page) {
			// 当前页码改变时触发（参数是当前页码）
			this.currentPage = page;
			this.getSingerBy(this.area, this.type, this.initial, page);
			let view = document.querySelector(".view");
			view.scrollTo({
				top: 200,
			});
		},
	},
};
</script>

<style lang="less" scoped>
.singerlist {
	padding-top: 20px;
}
</style>
