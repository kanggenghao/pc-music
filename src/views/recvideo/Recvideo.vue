<template>
	<div id="rec-video">
		<TopNav :tabitem="topnav" />
		<!-- 内容 -->
		<div class="video-content w">
			<transition name="el-fade-in-linear">
				<keep-alive>
					<router-view></router-view>
				</keep-alive>
			</transition>
		</div>
	</div>
</template>

<script>
import TopNav from "components/common/TopNav.vue";
export default {
	name: "Recvideo",
	components: { TopNav },
	data() {
		return {
			topnav: [
				{ path: "/recvideo/mv", name: "MV" },
				{ path: "/recvideo/video", name: "视频" },
			],
		};
	},
	methods: {},
	activated() {
		document.querySelector(".view").scrollTop = 0;
	},
};
</script>

<style lang="less" scoped>
.top-nav {
	display: flex;
	width: 100%;
	justify-content: center;
}
</style>
