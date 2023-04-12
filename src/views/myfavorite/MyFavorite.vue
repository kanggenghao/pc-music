<template>
	<div class="my-favorite">
		<div class="logined" v-if="$store.state.isLogin">
			<TopNav :tabitem="topnav" />
			<!-- 内容 -->
			<div class="favorite-content w">
				<router-view></router-view>
			</div>
		</div>
		<div class="nologin" v-else>
			<el-empty description="登录后才能查看" :image-size="200"></el-empty>
		</div>
	</div>
</template>
<script>
import TopNav from "components/common/TopNav.vue";
export default {
	name: "MyFavorite",
	components: { TopNav },
	data() {
		return {
			topnav: [
				{ path: "/myfavorite/album", name: "专辑" },
				{ path: "/myfavorite/singer", name: "歌手" },
				{ path: "/myfavorite/mv", name: "视频" },
			],
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
	},
	activated() {
		document.querySelector(".view").scrollTop = 0;
	},
};
</script>

<style lang="less" scoped></style>
