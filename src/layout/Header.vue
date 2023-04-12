<template>
	<div id="header">
		<!-- 标题logo -->
		<div class="title">
			<div class="icon"><span class="iconfont icon-yinleyanzou"></span></div>
			<div class="text"><span>Music</span></div>
		</div>
		<!-- 操作 -->
		<div class="operation">
			<span class="iconfont icon-shangyiye" @click="goBack"></span>
			<span class="iconfont icon-xiayiye" @click="goForward"></span>
		</div>
		<!-- 搜索框 -->
		<div class="search">
			<Searchinput />
		</div>
		<!-- 右侧登录 -->
		<div class="right-login">
			<Login />
		</div>
		<!-- 主题 -->
		<div class="pifu">
			<span class="iconfont icon-pifu" v-popover:popover slot="reference"></span>
			<el-popover ref="popover" placement="bottom" width="150" trigger="click">
				<ThemePicker />
			</el-popover>
		</div>
		<div class="full">
			<span class="iconfont icon-quanping" @click="full" v-if="!isFull" title="全屏"></span>
			<span class="iconfont icon-cancel-full-screen" @click="exitFull" v-if="isFull" title="退出全屏"></span>
		</div>
	</div>
</template>

<script>
import Searchinput from "components/common/Searchinput.vue";
import Login from "components/content/login/Login.vue";
import ThemePicker from "../components/common/ThemePicker.vue";
import { requestFullScreen, exitFullscreen, isFullscreen } from "common/utils.js";
export default {
	name: "Header",
	components: { Searchinput, Login, ThemePicker },
	data() {
		return {
			isFull: false,
		};
	},
	methods: {
		goBack() {
			this.$router.go(-1);
		},
		goForward() {
			this.$router.go(1);
		},
		full() {
			requestFullScreen();
			this.isFull = true;
		},
		exitFull() {
			exitFullscreen();
			this.isFull = false;
		},
	},
	mounted() {
		window.onresize = () => {
			if (!isFullscreen()) {
				this.isFull = false;
			}
		};
		document.addEventListener("keyup", e => {
			//f11全屏
			if (e.keyCode == 122) {
				this.isFull = !this.isFull;
			}
		});
	},
};
</script>
<style lang="less" scoped>
#header {
	position: relative;
	display: flex;
	align-items: center;
	width: 100%;
	height: 60px;
	background: var(--mycompColor);
	z-index: 99;
	.title {
		flex: 2;
		display: flex;
		align-items: center;
		height: 60px;
		margin-left: 10px;
		.icon {
			width: 60px;
			height: 60px;
			text-align: center;
			line-height: 60px;
			.icon-yinleyanzou {
				color: #fff;
				font-size: 34px;
				font-weight: 700;
			}
		}
		.text {
			font-size: 22px;
			color: #fff;
			font-family: Arial, Helvetica, sans-serif;
			line-height: 60px;
		}
	}
	.operation {
		flex: 1;
		display: flex;
		justify-content: space-around;
		margin-left: 30px;
		color: #fff;
		span {
			display: block;
			width: 30px;
			height: 30px;
			text-align: center;
			line-height: 30px;
			// background: rgba(100, 149, 237, 1);
			background: rgba(105, 105, 105, 0.1);
			border-radius: 50%;
			cursor: pointer;
		}
	}
	.search {
		flex: 2;
	}
	.right-login {
		display: flex;
		justify-content: flex-end;
		align-content: center;
		flex: 12;
	}
	.pifu {
		padding-right: 15px;
		color: #fff;
		cursor: pointer;
	}
	.full {
		padding-right: 20px;
		color: #fff;
		cursor: pointer;
	}
}
</style>
