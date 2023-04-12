<template>
	<!-- 顶部导航 -->
	<div class="top-nav">
		<el-menu :default-active="$route.path" router mode="horizontal">
			<el-menu-item v-for="(item, i) in tabitem" :key="i" :index="item.path">
				{{ item.name }}
			</el-menu-item>
		</el-menu>
	</div>
</template>

<script>
export default {
	name: "TopNav",
	props: {
		tabitem: {
			type: Array,
			default() {
				return [];
			},
		},
	},
};
</script>

<style lang="less" scoped>
.top-nav {
	display: flex;
	width: 100%;
	justify-content: center;
}
.el-menu {
	border: 0;
}
.el-menu-item {
	color: #303133;
	height: 45px;
	line-height: 45px;
	font-size: 16px;
}
.el-menu--horizontal > .el-menu-item.is-active {
	border-bottom: 3px solid var(--mycompColor);
	font-size: 18px;
	color: var(--mycompColor);
}
</style>
