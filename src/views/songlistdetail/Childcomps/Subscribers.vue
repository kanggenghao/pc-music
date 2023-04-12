<template>
	<div class="subscribers">
		<UserList :userlist="subscribers" v-if="subscribers.length !== 0" />
		<!-- 分页器 -->
		<Pagination :total="totalcount" :page-size="48" @handleCurrentChange="handleCurrentChange" />
		<div class="no" v-if="subscribers.length == 0">
			<el-empty description="暂无收藏者" :image-size="200"></el-empty>
		</div>
	</div>
</template>

<script>
import UserList from "components/content/userlist/UserList.vue";
export default {
	name: "Subscribers",
	components: { UserList },
	props: {
		subscribers: {
			type: Array,
			default() {
				return [];
			},
		},
		totalcount: {
			type: Number,
			default:0
		},
	},
	methods: {
		toUserDetail(uid) {
			this.$router.push("/userdetail/" + uid);
		},
		handleCurrentChange(page) {
			this.$emit("handlePage", page);
		},
	},
};
</script>

<style lang="less" scoped>
.no {
	width: 100%;
	display: flex;
	justify-content: center;
	font-size: 24px;
}
</style>
