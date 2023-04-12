<template>
	<!-- 歌单列表的每一项 -->
	<div class="item" v-if="Object.keys(songlistitem).length !== 0" @click="listItemClick">
		<!--歌单图片 -->
		<div class="item-img" @mouseenter="showIcon" @mouseleave="closeIcon">
			<!-- 图片上的播放图标 鼠标经过时显示 -->
			<transition name="el-fade-in-linear">
				<div class="mask-playicon" v-show="isShowPlay">
					<span class="iconfont icon-play"></span>
				</div>
			</transition>
			<!-- 图片上方遮罩层1 显示歌单播放量 -->
			<transition name="el-zoom-in-top">
				<div class="mask1" v-show="isShowIcon" v-if="songlistitem.playCount">
					<span class="iconfont icon-yinle"></span>
					<span>{{ songlistitem.playCount | formatNum }}</span>
				</div>
			</transition>
			<!-- 图片下方遮罩层2 显示歌单作者名 -->
			<transition name="el-zoom-in-bottom">
				<div class="mask2" v-if="songlistitem.creator" v-show="isShowIcon">
					<span class="iconfont">&#xe841;</span>
					<span>{{ songlistitem.creator.nickname }}</span>
				</div>
			</transition>
			<!-- 图片本身 使用懒加载 -->
			<img v-lazy="showImg" alt="" />
		</div>
		<!-- 歌单下的文字描述 -->
		<div class="item-text">
			<div>{{ songlistitem.name }}</div>
		</div>
	</div>
</template>

<script>
export default {
	name: "SongListItem",
	props: {
		songlistitem: {
			type: Object,
			default() {
				return {};
			},
		},
	},
	data() {
		return {
			isShowIcon: true, //播放量显示与隐藏
			isShowPlay: false, //播放图标遮罩层的显示与隐藏
		};
	},

	computed: {
		showImg() {
			//用于显示正确的图片
			return this.songlistitem.picUrl || this.songlistitem.coverImgUrl;
		},
	},

	methods: {
		showIcon() {
			this.isShowIcon = false;
			this.isShowPlay = true;
		},
		closeIcon() {
			this.isShowIcon = true;
			this.isShowPlay = false;
		},
		/* 
    歌单点击事件
     */
		listItemClick() {
			//点击后根据歌单id 跳转歌单详情页
			this.$router.push("/songlistdetail/" + this.songlistitem.id);
			// 遮罩显示
			this.isShowPlay = false;
			this.isShowIcon = true;
		},
	},
};
</script>

<style lang="less" scoped>
.item {
	width: 100%;
	height: 100%;
	cursor: pointer;
	margin-bottom: 15px;
	.item-img {
		position: relative;
		img {
			width: 100%;
		}
		.mask1 {
			position: absolute;
			top: 0;
			width: 100%;
			height: 30px;
			line-height: 30px;
			text-align: right;
			color: #fff;
			font-size: 13px;
			padding-right: 7px;
			span {
				padding-left: 5px;
			}
		}
		.mask2 {
			position: absolute;
			bottom: 0;
			width: 100%;
			height: 30px;
			line-height: 30px;
			text-align: left;
			color: #fff;
			font-size: 13px;
			padding-left: 7px;
			span {
				padding-right: 5px;
			}
		}
	}
	.item-text {
		margin: 5px 0;
	}
}
</style>
