<template>
	<div class="follows w">
		<el-divider content-position="left"
			><h2>{{ $route.params.uname }}关注的人</h2></el-divider
		>
		<UserList :userlist="follows" v-if="follows.length !== 0" />
		<div style="width: 100%; text-align: center" v-else>
			<el-empty description="还没有关注其他人" :image-size="200"></el-empty>
		</div>
		<!-- 分页器 -->
		<Pagination :total="followsCount" :page-size="48" @handleCurrentChange="getUserFollowsBy" />
	</div>
</template>

<script>
import { getUserFollows } from "network/userdetail/userdetail";
import UserList from "components/content/userlist/UserList.vue";
export default {
	name: "Follows",
	components: { UserList },
	data() {
		return {
			uid: null,
			follows: [{}],
			followsCount: 0,
		};
	},
	created() {
		this.uid = this.$route.params.uid;
		this.followsCount = Number(this.$route.params.follows);
		this.getUserFollowsBy();
	},
	methods: {
		//   获取当前uid的关注列表
		getUserFollowsBy(page = 1) {
			let offset = (page - 1) * 48;
			getUserFollows(this.uid, offset).then(res => {
				this.follows = res.data.follow || [];
				// 提交vuex的关注列表得是当前登录用户的关注,不能每个人的关注列表都提交保存
				if (this.$store.state.userInfo.userId === this.uid) {
					this.$store.dispatch("saveUserFollowsList", res.data.follow);
				}
			});
		},
	},
};
</script>

<style lang="less" scoped></style>
