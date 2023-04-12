<template>
	<div class="fans-list w">
		<el-divider content-position="left"
			><h2>{{ $route.params.uname }}的粉丝</h2></el-divider
		>
		<UserList :userlist="fanslist" v-if="fanslist.length !== 0" />
		<div style="width: 100%; text-align: center" v-else>
			<el-empty description="还没有粉丝" :image-size="200"></el-empty>
		</div>
		<!-- 分页器 -->
		<Pagination :total="fansCount" :page-size="48" @handleCurrentChange="getUserFollowedsBy" />
	</div>
</template>

<script>
import { getUserFolloweds } from "network/userdetail/userdetail";
import UserList from "components/content/userlist/UserList.vue";
export default {
	name: "FansList",
	components: { UserList },
	data() {
		return {
			fanslist: [{}],
			fansCount: 0,
		};
	},
	created() {
		this.uid = this.$route.params.uid;
		this.getUserFollowedsBy();
	},
	methods: {
		//   获取粉丝列表
		getUserFollowedsBy(page = 1) {
			let offset = (page - 1) * 50;
			getUserFolloweds(this.uid, offset).then(res => {
				this.fanslist = res.data.followeds || [];
				this.fansCount = res.data.size;
			});
		},
	},
};
</script>

<style lang="less" scoped></style>
