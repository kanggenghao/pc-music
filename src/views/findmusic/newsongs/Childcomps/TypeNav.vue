<template>
	<!-- 分类导航 -->
	<div class="type-nav">
		<el-menu mode="horizontal" :default-active="activeCode">
			<el-menu-item v-for="(item, i) in typeitem" :key="i" :index="item.code" @click="typeItemClick(item.code)">
				{{ item.type }}
			</el-menu-item>
		</el-menu>
	</div>
</template>

<script>
export default {
	name: "TypeNav",
	props: {
		typeitem: {
			type: Array,
			default() {
				return [];
			},
		},
	},
	data() {
		return {
			activeCode: this.typeitem[0].code, //当前选中的类型代码,
		};
	},
	methods: {
		typeItemClick(code) {
			this.$emit("typeItemClick", code);
		},
	},
};
</script>

<style lang="less" scoped>
.type-nav {
	.el-menu-item {
		color: #303133;
		height: 30px;
		line-height: 30px;
		padding: 0 8px;
	}
	.el-menu--horizontal > .el-menu-item.is-active {
		border-bottom: 2px solid #000;
		color: #000;
	}
}
</style>
