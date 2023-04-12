<template>
	<div id="user-detail" class="w">
		<div class="logined" v-if="$store.state.isLogin">
			<!-- 顶部基本信息 -->
			<div class="top-userinfo">
				<div class="left-avatar">
					<img :src="currentUserInfo.avatarUrl" alt="" />
				</div>
				<div class="right-info">
					<!-- 第一栏 -->
					<div class="row1">
						<!-- 用户名 -->
						<div class="uname">
							<h2>{{ currentUserInfo.nickname }}</h2>
							<div class="gender">
								<span class="iconfont icon-nan" v-if="currentUserInfo.gender == 1"></span>
								<span class="iconfont icon-nv" v-else-if="currentUserInfo.gender == 2"></span>
							</div>
							<el-tag size="small" effect="light">Lv:{{ currentUserInfo.level }}</el-tag>
						</div>
						<!-- 关注按钮 -->
						<el-button
							size="small"
							v-if="uid != $store.state.userInfo.userId"
							class="subuser"
							:icon="isSub ? 'el-icon-check' : 'el-icon-plus'"
							:type="isSub ? 'primary' : 'default'"
							@click="subUserBy"
							>{{ isSub ? "已关注" : "关注" }}</el-button
						>
					</div>
					<!--第二栏 歌手身份 -->
					<div class="singer" v-if="currentUserInfo.identify">
						<span><img :src="currentUserInfo.identify.imageUrl" alt=""/></span>
						<i>{{ currentUserInfo.identify.imageDesc }}</i>
					</div>
					<!-- 第三栏 粉丝动态数据-->
					<div class="my-data">
						<div class="data-info">
							<div class="data-num">
								<div class="num-item" style="padding-left: 0">
									<h2>{{ currentUserInfo.eventCount }}</h2>
									<div>动态</div>
								</div>
								<div class="num-item" style="border-right: solid 1px #dddddd; border-left: solid 1px #dddddd" @click="toFollows">
									<h2>{{ currentUserInfo.follows }}</h2>
									<div>关注</div>
								</div>
								<div class="num-item" @click="toFansList">
									<h2>{{ currentUserInfo.followeds | formatNum }}</h2>
									<div>粉丝</div>
								</div>
							</div>
							<div class="base-info">
								<div>
									用户ID：<span>{{ uid }}</span>
								</div>
								<div>
									个人介绍：<span>{{ currentUserInfo.signature == "" ? "暂无介绍" : currentUserInfo.signature }}</span>
								</div>
							</div>
						</div>
						<div class="my-record" @click="toRecord">
							<div class="iconfont icon-paixingbang"></div>
							<div>听歌排行</div>
						</div>
					</div>
				</div>
			</div>
			<!-- 底部歌单 -->
			<div class="mycreat" v-if="createdSongList.length !== 0">
				<el-divider content-position="left"
					><h2>
						<span>{{ currentUserInfo.nickname }}</span
						>创建的歌单({{ createdSongList.length }})
					</h2></el-divider
				>
				<SongList :songlist="createdSongList" />
			</div>
			<div class="mycollect" v-if="collectSongList.length !== 0">
				<el-divider content-position="left"
					><h2>
						<span>{{ currentUserInfo.nickname }}</span
						>收藏的歌单({{ collectSongList.length }})
					</h2></el-divider
				>
				<SongList :songlist="collectSongList" />
			</div>
		</div>
		<div class="nologin" v-else>
			<el-empty description="登录后才能查看" :image-size="200"></el-empty>
		</div>
	</div>
</template>

<script>
/* 网络请求 */
import { getUserDetail, getUserSonglist, getUserFollows, subUser, getUserEvent } from "network/userdetail/userdetail";
import { mapGetters } from "vuex";
import SongList from "components/content/songlist/SongList.vue";
export default {
	inject: ["reload"],
	name: "UserDetail",
	components: { SongList },
	data() {
		return {
			uid: null,
			currentUserInfo: {}, //当前用户信息
			userSongList: [],
			collectSongList: [], //收藏的歌单
			createdSongList: [], //创建的歌单
			isSub: false, //是否关注了当前用户
		};
	},
	computed: {
		...mapGetters(["userFollowsList", "userInfo"]),
	},
	created() {
		if (!this.$store.state.isLogin) {
			this.$message({
				type: "warning",
				message: "登录后才能查看",
				showClose: true,
				center: true,
			});
			return;
		}
		this.uid = this.$route.params.uid;
		// 获取用户信息
		this.getUserDetailBy();
		// 获取用户歌单
		this.getUserSonglistBy();
		// 获取登录用户的关注列表
		if (this.userFollowsList.length === 0) {
			this.getLoginUserFollows();
			return;
		}
		// 判断是否关注了当前用户
		this.isSubUser();
	},
	methods: {
		/* 
    网络请求
    */
		// 获取用户信息
		getUserDetailBy() {
			getUserDetail(this.uid).then(res => {
				res.data.profile.level = res.data.level;
				// 如果是歌手 添加歌手身份
				if (res.data.identify) {
					res.data.profile.identify = res.data.identify;
				}
				this.currentUserInfo = res.data.profile;
			});
		},
		// 获取用户歌单
		getUserSonglistBy() {
			getUserSonglist(this.uid).then(res => {
				this.userSongList = res.data.playlist;
				// 找到用户收藏的第一个歌单的索引号
				let collectIndex = this.userSongList.findIndex(item => item.creator.userId != this.uid);
				// 截取用户创建的歌单
				this.createdSongList = this.userSongList.slice(0, collectIndex);
				// console.log(this.createdSongList);
				// 截取用户收藏的歌单
				this.collectSongList = this.userSongList.slice(collectIndex);
			});
		},

		/* 
   事件监听
   */
		//点击关注去往关注列表
		toFollows() {
			this.$router.push({
				name: "Follows",
				params: {
					uid: this.uid,
					uname: this.currentUserInfo.nickname,
					follows: this.currentUserInfo.follows,
				},
			});
		},
		//点击粉丝去往粉丝列表
		toFansList() {
			this.$router.push({
				name: "FansList",
				params: { uid: this.uid, uname: this.currentUserInfo.nickname },
			});
		},
		// 用户听歌排行页面
		toRecord() {
			this.$router.push("/userdetail/record/" + this.uid);
		},
		// toEventList() {
		// 	this.$router.push("/userdetail/userevent/" + this.uid);
		// },
		/* 关注用户事件*/
		// 获取登录用户的关注列表
		getLoginUserFollows(page = 1) {
			let limit = 1000;
			let offset = (page - 1) * limit;
			getUserFollows(this.userInfo.userId, offset, limit).then(res => {
				// 提交vuex保存登录用户的关注列表
				this.$store.dispatch("saveUserFollowsList", res.data.follow);
				this.isSubUser();
			});
		},
		// 判断是否关注了当前用户
		isSubUser() {
			let index = this.userFollowsList.findIndex(item => {
				return item.userId == this.uid;
			});
			if (index == -1) {
				this.isSub = false;
			} else {
				this.isSub = true;
			}
		},
		// 点击关注按钮的回调
		subUserBy() {
			let t = !this.isSub ? 1 : 2; // 1 为收藏,其他为取消收藏
			subUser(t, this.uid)
				.then(res => {
					if (res.data.code == 200) {
						// 从新获取登录用户关注列表
						this.getLoginUserFollows();
						if (t == 1) {
							this.$message({
								type: "success",
								message: "关注成功",
								center: true,
							});
						} else {
							this.$message({
								type: "success",
								message: "已取消关注",
								center: true,
							});
						}
					}
				})
				.catch(err => this.$message.warning("操作失败,请重试"));
		},
	},
	watch: {
		// 路由push相同地址不同参数时 不会自动刷新页面，这里通过watch监听路由变化，一但发生变化reload刷新
		$route(to, from) {
			if (to !== from) {
				this.reload();
			}
		},
	},
};
</script>

<style lang="less" scoped>
.top-userinfo {
	display: flex;
	align-items: center;
	.left-avatar {
		width: 25vh;
		img {
			width: 100%;
			border-radius: 50%;
		}
	}
	.right-info {
		width: 100%;
		padding-left: 3vh;
		.row1 {
			display: flex;
			justify-content: space-between;
			.uname {
				display: flex;
				align-items: center;
				h2 {
					padding-right: 1vh;
				}
				.gender {
					padding-right: 1vh;
					.iconfont {
						font-size: 16px;
					}
				}
			}
			.subuser {
				font-size: 16px;
			}
		}
		.singer {
			display: flex;
			align-items: center;
			margin-top: 5px;
			span {
				display: inline-block;
				width: 24px;
				margin-right: 10px;
				img {
					width: 100%;
				}
			}
		}
		.my-data {
			display: flex;
			align-items: center;
			border-top: 1px solid #dddddd;
			margin-top: 10px;
			.data-info {
				width: 100%;
				.data-num {
					display: flex;
					margin-top: 2vh;
					.num-item {
						padding: 0 3vh;
						text-align: center;
						cursor: pointer;
					}
				}
				.base-info {
					margin-top: 1vh;
					span {
						color: #909399;
					}
				}
			}
			.my-record {
				margin-top: 20px;
				height: 100px;
				width: 100px;
				text-align: center;
				cursor: pointer;
				// color: #909399;
				color: #000;
				.iconfont {
					height: 65px;
					width: 65px;
					line-height: 65px;
					margin: 0 auto;
					font-size: 50px;
				}
				&:hover {
					color: var(--themeColor);
				}
			}
		}
	}
}
.mycreat,
.mycollect {
	margin-top: 50px;
}

.sub {
	background: var(--themeColor);
	color: #fff;
}
</style>
