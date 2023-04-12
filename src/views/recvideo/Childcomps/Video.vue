<template>
	<div class="video">
		<div class="logined" v-if="$store.state.isLogin">
			<!-- 标签导航 -->
			<TagsNav :all-tag="allTag" :hot-tag="hotTag" @tagClick="tagClick" />
			<!-- 视频列表 -->
			<div class="video-list" v-if="videoList.length != 0">
				<VideoList :videolist="videoList" />
			</div>
			<div class="novideo" v-else>
				<el-empty description="暂无视频" :image-size="200"></el-empty>
			</div>
		</div>
		<div class="nologin" v-if="!$store.state.isLogin">
			<el-empty description="登录后才能查看" :image-size="200"></el-empty>
		</div>
	</div>
</template>

<script>
/* 网络请求 */
import { geAllVideoTags, geHotVideoTags, getGroupVideoList } from "network/recvideo/recvideo";
/* 子组件 */
import TagsNav from "components/content/TagsNav.vue";
import VideoList from "components/content/videolist/VideoList.vue";
export default {
	name: "Video",
	components: { TagsNav, VideoList },
	data() {
		return {
			allTag: [],
			hotTag: [],
			videoList: [{}],
			tagId: "", //标签id
			offset: 0,
		};
	},
	created() {
		if (!this.$store.state.isLogin) {
			this.$message({
				type: "warning",
				message: "登录后才能查看",
				showClose: true,
				center: true,
			});
			return;
		}
		// 获取全部视频标签
		this.geAllVideoTagsBy();
		//获取热门视频标签
		this.geHotVideoTagsBy();
	},
	methods: {
		/*
    网络请求事件
    */
		// 获取全部视频标签
		geAllVideoTagsBy() {
			geAllVideoTags().then(res => {
				this.allTag = res.data.data;
			});
		},
		//获取热门视频标签
		geHotVideoTagsBy() {
			geHotVideoTags().then(res => {
				this.hotTag = res.data.data;
				this.tagId = this.hotTag[0].id;
				// 默认获取 现场 分类视频列表
				this.getGroupVideoListBy(this.tagId);
			});
		},
		//  获取分类视频列表
		getGroupVideoListBy(id) {
			getGroupVideoList(id, this.offset).then(res => {
				if (res.data.hasmore) {
					this.videoList.push(...res.data.datas);
					this.offset += 1;
					if (this.offset < 4) {
						this.getGroupVideoListBy(this.tagId);
					}
				}
			});
		},

		/*
    事件监听
    */
		// 标签点击事件
		tagClick(tagName, id) {
			this.offset = 0;
			this.videoList = []; //清空视频列表
			this.tagId = id; //保存标签id
			this.getGroupVideoListBy(id);
		},
		more() {
			let view = document.querySelector(".view");
			if (Math.ceil(view.scrollTop) + view.clientHeight >= view.scrollHeight) {
				//滚动卷去的高度+当前可视高度 >=总高度 即代表滑动到底部
				this.getGroupVideoListBy(this.tagId);
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
.video-list {
	margin-top: 30px;
}
</style>
