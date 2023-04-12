<template>
	<div class="login">
		<!-- 未登录头像 -->
		<div class="avatar" v-if="!userInfo" @click="showLogin">
			<div class="block">
				<el-avatar :size="40" :src="circleUrl"></el-avatar>
			</div>
			<div class="uname">{{ uname }}</div>
		</div>
		<!-- 已登录头像 -->
		<div class="avatar" v-else>
			<div @click="toUserDetail">
				<el-avatar :size="40" :src="userInfo.avatarUrl"></el-avatar>
			</div>
			<div class="uname" @click="showUserPop" id="showuserpop">{{ userInfo.nickname }} <i class="el-icon-caret-bottom"></i></div>
		</div>
		<!-- 登录表单弹框 -->
		<transition name="el-fade-in-linear">
			<LoginPop v-if="isShowLogin" @closeLogin="closeLogin" />
		</transition>
		<!-- 展示个人信息弹框 -->
		<transition name="el-fade-in-linear">
			<UserPop v-if="showUserpop" @closeuserPop="isShowUserPop" />
		</transition>
	</div>
</template>
<script>
import { mapGetters } from "vuex";
import LoginPop from "./LoginPop.vue";
import UserPop from "./UserPop.vue";
export default {
	name: "Login",
	components: { LoginPop, UserPop },
	computed: {
		// 将 store 中的 getter 映射到局部计算属性
		...mapGetters(["userInfo"]),
	},
	data() {
		return {
			circleUrl: "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
			uname: "点击头像登录",
			isShowLogin: false,
			showUserpop: false,
		};
	},
	methods: {
		// 显示登录框
		showLogin() {
			this.isShowLogin = true;
		},
		// 关闭登录框
		closeLogin() {
			this.isShowLogin = false;
		},
		// 打开用户信息弹框
		showUserPop() {
			this.showUserpop = !this.showUserpop;
		},
		// 关闭用户信息弹框
		isShowUserPop() {
			this.showUserpop = false;
		},
		// 点击登录后的头像
		toUserDetail() {
			this.$router.push("/userdetail/" + this.userInfo.userId).catch(err => err);
		},
	},
};
</script>

<style lang="less" scoped>
.login {
	padding-right: 2%;
}
.avatar {
	display: flex;
	align-items: center;
	color: #fff;
	cursor: pointer;
	.uname {
		padding-left: 5px;
	}
}
</style>
