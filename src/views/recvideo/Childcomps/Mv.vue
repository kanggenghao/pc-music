<template>
	<div class="mv">
		<!-- 顶部分类标签 -->
		<div class="tags" ref="tagsnav">
			<TagsBar :taglist="areaList" @tagBarClick="areaClick" />
			<TagsBar :taglist="typeList" @tagBarClick="typeClick" />
			<TagsBar :taglist="orderList" @tagBarClick="orderClick" />
		</div>
		<!-- MV列表 -->
		<div class="mv-list">
			<VideoList :videolist="mvList" />
		</div>
	</div>
</template>

<script>
/* 网络请求 */
import { getAllMv } from "network/recvideo/recvideo";
/* 子组件 */
import VideoList from "components/content/videolist/VideoList.vue";
import TagsBar from "components/content/TagsBar.vue";
export default {
	components: { VideoList, TagsBar },
	name: "Mv",
	data() {
		return {
			areaList: {
				category: "地区",
				list: ["全部", "内地", "港台", "欧美", "日本", "韩国"],
			},
			typeList: {
				category: "类型",
				list: ["全部", "官方版", "原生", "现场版", "网易出品"],
			},
			orderList: {
				category: "排序",
				list: ["上升最快", "最热", "最新"],
			},
			mvList: [], //MV列表
			hasMore: false,
			area: "全部",
			type: "全部",
			order: "上升最快",
			limit: 40,
			page: 1,
		};
	},
	created() {
		//   默认请求数据
		this.getAllMvBy("全部", "全部", "上升最快", 1);
	},
	methods: {
		/* 网络请求事件 */
		getAllMvBy(area, type, order, page) {
			let offset = (page - 1) * this.limit;
			getAllMv(area, type, order, offset, this.limit).then(res => {
				if (res.data.hasMore) {
					this.mvList.push(...res.data.data);
					this.hasMore = res.data.hasMore;
					this.page += 1;
				}
			});
		},
		/* 标签点击事件 */
		areaClick(item) {
			this.page = 1;
			this.mvList = [];
			this.area = item;
			this.getAllMvBy(item, this.type, this.order, this.page);
		},
		typeClick(item) {
			this.page = 1;
			this.mvList = [];
			this.type = item;
			this.getAllMvBy(this.area, item, this.order, this.page);
		},
		orderClick(item) {
			this.page = 1;
			this.mvList = [];
			this.order = item;
			this.getAllMvBy(this.area, this.type, item, this.page);
		},

		more() {
			let view = document.querySelector(".view");
			if (Math.ceil(view.scrollTop) + view.clientHeight >= view.scrollHeight) {
				//滚动卷去的高度+当前可视高度 >=总高度 即代表滑动到底部
				this.getAllMvBy(this.area, this.type, this.order, this.page);
			}
		},
	},
	activated() {
		document.querySelector(".view").addEventListener("scroll", this.more);
	},
	deactivated() {
		document.querySelector(".view").removeEventListener("scroll", this.more);
	},
};
</script>

<style lang="less" scoped>
.mv {
	position: relative;
}
.mv-list {
	padding-top: 30px;
}
</style>
