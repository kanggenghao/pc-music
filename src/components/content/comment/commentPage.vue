<template>
	<div class="comment">
		<!-- 输入框 -->
		<div class="textinput">
			<el-input ref="commentContent" type="textarea" rows="3" maxlength="100" show-word-limit v-model.trim="content" :placeholder="placeholder" @blur="textareaBlur"> </el-input>
			<el-button round type="primary" size="small" icon="el-icon-position" class="el-btn" @click="submitComment">发送评论</el-button>
		</div>
		<!-- 评论列表 -->
		<div class="comment-list" ref="commentlist">
			<h2>{{ sortType === 3 ? "最新评论" : "热门评论" }}({{ commentCount | formatNum }})</h2>
			<div class="sort-category">
				<span v-for="(item, index) in sortCategory" :key="index" @click="changeSort(item.sortType, index)" :class="{ active: currentIndex === index }">{{ item.title }}</span>
			</div>
			<div class="new-comment" v-if="commentsList.length !== 0">
				<CommentItem
					v-for="(item, index) in commentsList"
					:key="index"
					:item="item"
					@toUserDetail="toUserDetail"
					@getReplyComment="getReplyComment"
					:commentType="commentType"
					:commentresId="commentresId"
				/>
				<Pagination :total="commentCount" :page-size="60" :current-page="currentPage" :scroll-top="false" @handleCurrentChange="handleCurrentChange" />
			</div>
			<div class="nocomment" v-else>
				<el-empty description="没有更多了" :image-size="200"></el-empty>
			</div>
		</div>
	</div>
</template>
<script>
/* 网络请求 */
import { getComment, getHotComment, getNewCommentList, sendComment, replyComment } from "network/comment/comment";
/* 子组件 */
import CommentItem from "./CommentItem.vue";
export default {
	name: "CommentPage",
	components: { CommentItem },
	props: {
		// 评论的类型
		// 0:歌曲music 1:mv 2:歌单playlist 3:专辑album 5:视频video
		commentType: {
			type: Number,
		},
		// id:评论的资源id
		commentresId: {
			type: [Number, String],
		},
	},
	data() {
		return {
			placeholder: "请输入内容", //文本框占位内容
			content: "", //评论文本框输入内容
			commentsList: [], //评论列表
			commentCount: 0, //评论数量
			sortType: 3, //评论排序方式,2:按热度排序,3:按时间排序
			// 排序标题
			sortCategory: [
				{ title: "按时间排序", sortType: 3 },
				{ title: "按热度排序", sortType: 2 },
			],
			currentIndex: 0,
			currentPage: 1, //分页器默认页数
			submitType: 1, //评论提交类型 1是发送，2回复
			replyId: "", //回复的评论id
			replyUname: "", //回复的用户名
		};
	},
	created() {
		// 获取最新评论
		this.getNewCommentBy();
	},
	watch: {
		// 资源id变化后从新获取评论
		commentresId() {
			this.getNewCommentBy();
			this.sortType = 3;
			this.currentIndex = 0;
			this.content = "";
			this.currentPage = 1;
		},
	},
	methods: {
		/* 
    获取热门评论
     */
		getHotCommentBy(page = 1) {
			let offset = (page - 1) * 60;
			getHotComment(this.commentType, this.commentresId, offset).then(res => {
				if (res.data.total != 0) {
					this.commentsList = res.data.hotComments;
					this.commentCount = res.data.total;
				} else {
					getComment(this.commentType, this.commentresId, page).then(res => {
						this.commentsList = res.data.data.comments || [];
						this.commentCount = res.data.data.totalCount;
					});
				}
			});
		},

		/* 
    获取最新评论
     */
		getNewCommentBy(page = 1) {
			let type = "";
			switch (this.commentType) {
				case 0:
					type = "music";
					break;
				case 1:
					type = "mv";
					break;
				case 2:
					type = "playlist";
					break;
				case 3:
					type = "album";
					break;
				case 5:
					type = "video";
					break;
			}
			let offset = (page - 1) * 60;
			getNewCommentList(type, this.commentresId, offset).then(res => {
				this.commentsList = res.data.comments;
				this.commentCount = res.data.total;
			});
		},
		/* 
    评论列表分类排序
    */
		changeSort(sortType, index) {
			this.currentIndex = index;
			this.sortType = sortType;
			this.currentPage = 1;
			if (sortType === 3) {
				// 获取最新评论
				this.getNewCommentBy();
			} else this.getHotCommentBy();
		},
		/* 
    评论列表分页
     */
		handleCurrentChange(page) {
			if (this.sortType === 3) {
				// 获取最新评论
				this.getNewCommentBy(page);
			} else this.getHotCommentBy(page);
			this.currentPage = page;
			this.$emit("changePage"); //用于改变页数时滚动到顶部
		},
		// 点击评论用户头像
		toUserDetail() {
			// 如果在歌曲详情页点击 需要关闭歌曲详情页
			this.$emit("toUserDetail");
		},

		/* 
    评论功能相关事件
     */
		//.1 直接发送评论
		sendCommentBy() {
			sendComment(this.commentType, this.commentresId, this.content)
				.then(res => {
					// console.log(res);
					if (res.data.code === 200) {
						// 发送成功则 清空文本框
						this.content = "";
						// 刷新评论 从新请求评论数据
						setTimeout(() => {
							this.changeSort(3, 0);
						}, 1000);
						this.$message({
							type: "success",
							message: "评论成功",
							center: true,
						});
					} else this.$message.error("评论失败,请刷新后重试!");
				})
				.catch(err => {
					this.$message.error("评论失败,请刷新后重试!");
				});
		},
		//.2 回复评论
		// 2.1获取要回复的评论的id
		// 2.2滚动到输入框
		// 2.3将要回复的评论的用户名赋值给输入框占位文本
		// 2.4获取文本框焦点
		getReplyComment(replyInfo) {
			this.replyId = replyInfo.commentId;
			this.replyUname = replyInfo.uname;
			// 滚动到输入框(这里和分页的滚动一样)
			this.$emit("changePage");
			// 将要回复的评论的用户名赋值给输入框占位内容
			this.placeholder = `回复${replyInfo.uname}：`;
			// 获取文本框焦点
			this.$refs.commentContent.focus();
			// 将评论提交类型变为回复评论
			this.submitType = 2;
		},
		// 2.5 回复评论的网络请求
		replyCommentBy() {
			// 获取回复的内容(把用户名去掉)
			// let start = this.replyUname.length + 3;
			// let replyContent = this.content.slice(start);
			// 回复不能为空
			// if (replyContent.trim() === "") {
			//   this.$message({
			//     type: "warning",
			//     message: "评论失败，请重试",
			//     showClose: true,
			//     center: true,
			//   });
			// } else {
			// 发送请求
			replyComment(this.commentType, this.commentresId, this.content, this.replyId)
				.then(res => {
					if (res.data.code === 200) {
						// 回复成功则
						this.content = ""; //清空文本框
						this.placeholder = "请输入内容"; //修改占位内容
						this.submitType = 1; //修改评论提交类型
						// 刷新评论 从新请求评论数据
						setTimeout(() => {
							this.changeSort(3, 0);
						}, 1000);
						this.$message({
							type: "success",
							message: "回复成功",
							center: true,
						});
					} else this.$message.error("回复失败,请重试!");
				})
				.catch(err => {
					this.$message.error("回复失败,请稍后重试!");
				});
			// }
		},
		//.3 最后提交评论
		submitComment() {
			// 先判断登录状态
			if (!this.$store.state.isLogin) {
				this.$message({
					type: "warning",
					message: "登录后才能评论",
					showClose: true,
					center: true,
				});
				return;
			}
			// 判断评论是否为空
			if (this.content.trim() === "") {
				this.$message({
					type: "warning",
					message: "评论失败，内容不能为空",
					showClose: true,
					center: true,
				});
				return;
			} else {
				// 判断是发送评论还是回复评论
				if (this.submitType === 1) {
					// 直接发送评论
					this.sendCommentBy();
				} else {
					// 回复评论
					this.replyCommentBy();
				}
			}
		},
		// 当文本框内容为空且失去焦点时
		textareaBlur() {
			if (this.content.trim() === "") {
				this.placeholder = "请输入内容";
				this.submitType = 1;
			}
		},
	},
};
</script>

<style lang="less" scoped>
.comment {
	position: relative;
}
.textinput {
	text-align: right;
	.el-btn {
		margin-top: 10px;
	}
}
.sort-category {
	margin: 20px 0;
	span {
		padding-right: 10px;
		cursor: pointer;
	}
	.active {
		font-weight: 700;
	}
}
</style>
