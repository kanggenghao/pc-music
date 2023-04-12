<template>
	<div class="theme">
		<div class="theme-item" v-for="(item, index) in themeList" :key="index" @click="changeTheme(item, index)">
			<div :style="{ background: item.themeColor }" class="bg">
				<span class="iconfont icon-duihao" v-if="currentIndex === index"></span>
			</div>
			<div>{{ item.title }}</div>
		</div>
	</div>
</template>

<script>
export default {
	name: "Themepicker",
	data() {
		return {
			themeList: [
				{
					title: "蓝色",
					mycompColor: "#5292fe",
					themeColor: "#409eff",
					themeRgba: "rgba(64, 158, 255, 0.8)",
					tagRgba: "rgba(100, 149, 237, 0.2)",
				},
				{
					title: "红色",
					mycompColor: "#ec4141",
					themeColor: "#ec4141",
					themeRgba: "rgba(236,65,65,.8)",
					tagRgba: "rgba(236,65,65,.1)",
				},
				{
					title: "绿色",
					mycompColor: "#2bb669",
					themeColor: "#2bb669",
					themeRgba: "rgba(43,182,105,.8)",
					tagRgba: "rgba(43,182,105,.1)",
				},
				{
					title: "橘色",
					mycompColor: "#ff8f57",
					themeColor: "#ff8f57",
					themeRgba: "rgba(255,143,87,.8)",
					tagRgba: "rgba(255,143,87,.1)",
				},
				{
					title: "粉色",
					mycompColor: "#ff5c8a",
					themeColor: "#ff5c8a",
					themeRgba: "rgba(255,92,138,.8)",
					tagRgba: "rgba(255,92,138,.1)",
				},
				{
					title: "金色",
					mycompColor: "#e2ab12",
					themeColor: "#e2ab12",
					themeRgba: "rgba(226,171,18,.8)",
					tagRgba: "rgba(226,171,18,.1)",
				},
			],
			currentIndex: this.getItem("currentThemeIndex") ? this.getItem("currentThemeIndex") : 0,
		};
	},
	created() {
		// 设置主题色
		let currentTheme = this.getItem("currentTheme") ? this.getItem("currentTheme") : null;
		if (currentTheme != null) {
			for (let k in currentTheme) {
				if (k != "title") {
					document.documentElement.style.setProperty(`--${k}`, currentTheme[k]);
				}
			}
		}
	},
	methods: {
		changeTheme(item, index) {
			for (let k in item) {
				if (k !== "title") {
					document.documentElement.style.setProperty(`--${k}`, item[k]);
				}
			}
			this.currentIndex = index;
			this.setItem("currentTheme", item);
			this.setItem("currentThemeIndex", index);
		},
	},
};
</script>

<style lang="less" scoped>
.theme {
	height: 120px;
	padding: 10px 0 0 10px;
	display: flex;
	justify-content: center;
	flex-wrap: wrap;
	.theme-item {
		margin-right: 10px;
		width: 30px;
		height: 30px;
		font-size: 12px;
		text-align: center;
		cursor: pointer;
		.bg {
			position: relative;
			width: 100%;
			height: 100%;
		}
	}
}
.icon-duihao {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	color: #fff;
	font-size: 18px;
	font-weight: 700;
}
</style>
