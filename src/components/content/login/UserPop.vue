<template>
	<div>
		<div class="user-pop" ref="userpop">
			<div class="data-num">
				<div class="num-item">
					<h2>{{ userInfo.eventCount }}</h2>
					<div>动态</div>
				</div>
				<div class="num-item" @click="toFollows">
					<h2>{{ userInfo.follows }}</h2>
					<div>关注</div>
				</div>
				<div class="num-item" @click="toFansList">
					<h2>{{ userInfo.followeds | formatNum }}</h2>
					<div>粉丝</div>
				</div>
			</div>
			<div style="text-align: center">
				<el-button round size="small">签到</el-button>
			</div>
			<ul class="userinfo-list">
				<li @click="toMyhome">
					<span><i class="iconfont icon-user"></i>个人主页</span><i class="iconfont icon-xiayiye"></i>
				</li>
				<li @click="getUserRecordBy">
					<span><i class="iconfont icon-dengji"></i>听歌排行</span><i class="iconfont icon-xiayiye"></i>
				</li>
				<li>
					<span><i class="iconfont icon-shezhi"></i>个人设置</span><i class="iconfont icon-xiayiye"></i>
				</li>
				<li @click="logout">
					<span><i class="iconfont icon-tuichu"></i>退出登录</span>
				</li>
			</ul>
		</div>
	</div>
</template>

<script>
import { logout } from "network/login/login";
import { getUserDetail } from "network/userdetail/userdetail";
import { mapGetters } from "vuex";
export default {
	name: "UserPop",
	computed: {
		...mapGetters(["userInfo"]),
	},
	created() {
		this.getUserDetailBy();
	},
	methods: {
		//获取用户个人信息
		getUserDetailBy() {
			getUserDetail(this.userInfo.userId).then(res => {
				this.setItem("userInfo", res.data.profile);
				// 提交vuex 保存用户信息
				this.$store.dispatch("saveUserInfo", res.data.profile);
			});
		},
		// 点击个人主页
		toMyhome() {
			this.$router.push("/userdetail/" + this.userInfo.userId);
		},
		// 点击听歌排行去往用户播放记录页面
		getUserRecordBy() {
			this.$router.push("/userdetail/record/" + this.userInfo.userId);
		},
		//点击关注去往关注列表
		toFollows() {
			this.$router.push({
				name: "Follows",
				params: {
					uid: this.userInfo.userId,
					uname: this.userInfo.nickname,
					follows: this.userInfo.follows,
				},
			});
		},
		//点击粉丝去往粉丝列表
		toFansList() {
			this.$router.push({
				name: "FansList",
				params: { uid: this.userInfo.userId, uname: this.userInfo.nickname },
			});
		},

		// 退出登录
		logout() {
			this.$confirm("您确定退出登录吗?", "提示", {
				confirmButtonText: "确定",
				cancelButtonText: "取消",
				type: "warning",
			})
				.then(() => {
					logout().then(res => {
						this.$message({
							showClose: true,
							message: "退出成功",
							type: "success",
							center: true,
						});
						// 更新登录状态
						this.$store.dispatch("updateLogin", false);
						this.removeItem("isLogin");
						// 清空用户信息
						this.$store.dispatch("saveUserInfo", null);
						this.removeItem("userInfo");
						// 清空歌单
						this.$store.dispatch("saveUserSongList", []);
						this.removeItem("userSongList");
						// 清空用户喜欢的音乐id列表
						this.$store.dispatch("saveLikeSongIds", []);
						this.removeItem("likeSongIds");
					});
				})
				.catch(err => {
					err;
				});
		},
	},
	mounted() {
		// 点击其他区域关闭弹框
		document.addEventListener("mouseup", e => {
			let showuserpop = document.querySelector("#showuserpop");
			if (showuserpop) {
				if (!showuserpop.contains(e.target)) {
					this.$emit("closeuserPop");
				}
			}
		});
	},
};
</script>

<style lang="less" scoped>
.user-pop {
	position: absolute;
	top: 62px;
	right: 45px;
	box-shadow: 0px 0px 2px 2px #eef;
	background: #fff;
	border-radius: 5px;
	.data-num {
		display: flex;
		justify-content: center;
		margin: 10px 0;
		.num-item {
			padding: 0 15px;
			text-align: center;
			cursor: pointer;
		}
	}
	.userinfo-list {
		margin: 5px 0;
		li {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 5px 5px;
			&:hover {
				background: #eee;
				cursor: pointer;
			}
		}
	}
}
.user-pop ::after {
	position: absolute;
	top: -30px;
	left: 85px;
	content: "";
	width: 0;
	height: 0;
	border: 15px solid;
	border-left-color: transparent;
	border-top-color: transparent;
	border-right-color: transparent;
	border-bottom-color: #fff;
}
</style>
