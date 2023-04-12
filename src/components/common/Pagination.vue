<template>
	<!-- 分页器 -->
	<div class="page">
		<el-pagination v-show="total > pageSize" background :page-size="pageSize" :layout="layout" :total="total" :current-page="currentPage" @current-change="handleCurrentChange"> </el-pagination>
	</div>
</template>

<script>
export default {
	name: "Pagination",
	props: {
		total: {
			required: true,
			type: Number,
		},
		pageSize: {
			required: true,
			type: Number,
		},
		currentPage: {
			type: Number,
			default: 1,
		},
		scrollTop: {
			type: Boolean,
			default: true,
		},
		layout: {
			type: String,
			default: "total, prev, pager, next",
		},
	},
	methods: {
		handleCurrentChange(page) {
			this.$emit("handleCurrentChange", page);
			if (this.scrollTop) {
				// 返回顶部
				let view = document.querySelector(".view");
				view.scrollTop = 0;
			}
		},
	},
};
</script>

<style lang="less" scoped></style>
