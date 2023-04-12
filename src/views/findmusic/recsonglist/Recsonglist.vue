<template>
	<div id="recsong-list">
		<!-- 顶部精品歌单 -->
		<Topsonglist :topsonglist="topsonglist" />
		<!-- 标签导航 -->
		<div class="tagsnav" ref="tagsnav">
			<TagsNav :allTag="allTag" :hotTag="hotTag" @tagClick="tagClick" />
		</div>
		<!-- 歌单列表 -->
		<div class="songlist">
			<SongList :songlist="songlist" />
		</div>
		<!-- 分页器 -->
		<Pagination :total="songlistCount" :page-size="48" :current-page="currentPage" :scroll-top="false" @handleCurrentChange="handleCurrentChange" />
	</div>
</template>

<script>
// 网络请求模块
import { getTopHighqualityTag, getTopHighquality, getAllTag, getHotTag, getSongList } from "network/findmusic/recsonglist/recsonglist";
// 随机数
import { getRandom } from "common/getRandom";
// 子组件
import Topsonglist from "./Childcomps/Topsonglist.vue";
import SongList from "components/content/songlist/SongList.vue";
import TagsNav from "components/content/TagsNav.vue";
export default {
	naem: "Recsonglist",
	components: { Topsonglist, SongList, TagsNav },
	data() {
		return {
			tags: [], //精品歌单标签列表
			topsonglist: [], //顶部精品歌单
			allTag: [], //所有歌单标签
			hotTag: [], //热门标签
			songlist: [], //歌单列表
			songlistCount: 0, //歌单数量
			currentPage: 1, //分页器默认当前页数
			tagName: "华语",
			page: 1, //默认页码
		};
	},

	/* 
  生命周期函数 发送网络请求 
  */
	created() {
		// 获取所有歌单分类标签
		this.getAllTagBy();
		//  获取热门歌单分类标签
		this.getHotTagBy();
		// 随机获取一个顶部精品歌单
		this.getTopHighQualityRandom();
		// 默认获取华语歌单列表
		this.getSongListBy(this.tagName, this.page);
	},
	methods: {
		/* 
    网络请求事件
    */
		// 获取所有歌单分类标签
		getAllTagBy() {
			getAllTag().then(res => {
				this.allTag = res.data.sub;
			});
		},
		//  获取热门歌单分类标签
		getHotTagBy() {
			getHotTag().then(res => {
				this.hotTag = res.data.tags;
			});
		},
		// 随机获取一个顶部精品歌单
		getTopHighQualityRandom() {
			getTopHighqualityTag().then(res => {
				// 获取精品歌单所有标签
				this.tags = res.data.tags;
				// 获取一个随机精品歌单标签
				let randomTag = this.tags[getRandom(0, this.tags.length)].name;
				// 根据随机精品歌单标签,随机获取顶部精品歌单
				getTopHighquality(randomTag).then(res => {
					this.topsonglist = res.data.playlists;
				});
			});
		},
		// 获取歌单列表
		getSongListBy(tagName, page) {
			let offset = (page - 1) * 48;
			getSongList(tagName, offset).then(res => {
				this.songlist = res.data.playlists;
				this.songlistCount = res.data.total;
			});
		},

		/* 
    tags标签导航事件监听
    点击tag标签后从新发送网络请求
    */
		tagClick(tagName) {
			this.tagName = tagName; // 保存当前标签名
			// 根据标签名从新获取顶部精品歌单( 单击的标签名可能不存在精品歌单标签列表里面，判断一下)
			if (this.tags.find(item => item.name == tagName)) {
				getTopHighquality(tagName, 1).then(res => {
					this.topsonglist = res.data.playlists;
				});
			}
			// 根据标签名获取歌单列表(默认取第一页数据)，如果当前不在第一页，点击完后应该让分页器调到第一页
			this.getSongListBy(tagName, this.page);
			this.currentPage = 1;
		},

		/* 分页事件 */
		handleCurrentChange(page) {
			this.currentPage = page;
			this.getSongListBy(this.tagName, page);
			// 滚动返回指定位置
			let view = document.querySelector(".view");
			view.scrollTo({
				top: this.$refs.tagsnav.offsetTop - this.$refs.tagsnav.offsetHeight,
			});
		},
	},
};
</script>

<style lang="less" scoped>
.tagsnav {
	margin-top: 30px;
}
.songlist {
	margin-top: 20px;
}
</style>
