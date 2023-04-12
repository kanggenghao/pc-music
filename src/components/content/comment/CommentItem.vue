<template>
	<!-- 每一条评论 -->
	<div class="coment-item">
		<div class="base-info">
			<!-- 头像 -->
			<div class="avatar" @click="toUserDetail(item.user.userId)">
				<img :src="item.user.avatarUrl" alt="" />
			</div>
			<!-- 右侧内容 -->
			<div class="right-info">
				<!-- 评论 -->
				<div class="content">
					<span @click="toUserDetail(item.user.userId)">{{ item.user.nickname }}:</span>
					{{ item.content }}
				</div>
				<!-- 被回复的评论 -->
				<div class="be-replied" v-if="item.beReplied != null && item.beReplied.length != 0">
					<div v-for="(item2, index2) in item.beReplied" :key="index2">
						<span @click="toUserDetail(item2.user.userId)">@{{ item2.user.nickname }}:</span>{{ item2.content }}
					</div>
				</div>
				<!-- 评论时间 -->
				<div class="coment-time">
					{{ item.time | showDate }}
				</div>
			</div>
		</div>
		<!-- 点赞 回复评论 -->
		<div class="like">
			<span class="iconfont icon-dianzan" :class="{ isLike: item.liked }" @click="isLikeCommentBy(item)">{{ item.likedCount | formatNum }}</span>
			<span class="iconfont icon-comment" @click="replyComment(item)"></span>
		</div>
	</div>
</template>

<script>
/* 网络请求 */
import { isLikeComment } from "network/comment/comment";
import { formatDate } from "common/formatDate";
export default {
	name: "CommentItem",
	props: {
		item: {
			type: Object,
			default() {
				return {};
			},
		},
		commentType: {
			type: Number,
		},
		// id:评论的资源id
		commentresId: {
			type: [Number, String],
		},
	},
	filters: {
		showDate(value) {
			const date = new Date(value);
			return formatDate(date, "yyyy-MM-dd   hh:mm:ss");
		},
	},
	data() {
		return {};
	},
	methods: {
		// 点击用户头像
		toUserDetail(uid) {
			this.$router.push("/userdetail/" + uid);
			// 如果在歌曲详情页点击 需要关闭歌曲详情页
			this.$emit("toUserDetail");
		},
		// 点击回复评论
		replyComment(item) {
			let replyInfo = {};
			replyInfo.commentId = item.commentId;
			replyInfo.uname = item.user.nickname;
			this.$emit("getReplyComment", replyInfo);
		},
		// 点赞评论
		isLikeCommentBy(item) {
			// 先判断登录状态
			if (!this.$store.state.isLogin) {
				this.$message({
					type: "warning",
					message: "登录后才能点赞",
					showClose: true,
					center: true,
				});
				return;
			}
			let t = this.item.liked ? 0 : 1;
			// 发送网络请求
			isLikeComment(this.commentresId, this.commentType, t, item.commentId)
				.then(res => {
					if (res.data.code === 200) {
						// this.isLike = !this.isLike;
						if (t == 0) {
							this.$message({
								type: "success",
								message: "已取消点赞",
								center: true,
							});
							this.item.likedCount = this.item.likedCount - 1;
							this.item.liked = !this.item.liked;
						} else {
							this.$message({
								type: "success",
								message: "点赞成功",
								center: true,
							});
							this.item.likedCount = this.item.likedCount + 1;
							this.item.liked = !this.item.liked;
						}
					} else {
						this.$message.error("点赞失败,请稍后重试!");
					}
				})
				.catch(err => {
					this.$message.error("点赞失败,请稍后重试!");
				});
		},
	},
};
</script>

<style lang="less" scoped>
.coment-item {
	border-bottom: 1px solid #eee;
	padding: 15px 0;
	.base-info {
		display: flex;
		justify-content: left;
		.avatar {
			width: 6%;
			img {
				width: 100%;
				border-radius: 50%;
			}
		}
		.right-info {
			width: 94%;
			padding-left: 15px;
			.content {
				padding-top: 10px;
				span {
					cursor: pointer;
					color: #5091ca;
				}
			}
			.be-replied {
				margin: 15px 0;
				padding: 20px 10px;
				background: #eee;
				span {
					cursor: pointer;
					color: #5091ca;
				}
			}
			.coment-time {
				padding-top: 10px;
			}
		}
	}
	.like {
		text-align: right;
		padding-right: 20px;
		span {
			padding-right: 15px;
			cursor: pointer;
			&:hover {
				font-weight: 700;
			}
		}
	}
}
.isLike {
	color: var(--themeColor);
}
</style>
