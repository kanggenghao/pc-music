<template>
	<div class="item" @click="listItemClick">
		<!--歌单图片 -->
		<div class="item-img" @mouseenter="showIcon" @mouseleave="closeIcon">
			<!-- 图片上的播放图标 鼠标经过时显示 加了淡入淡出的动画 -->
			<transition name="el-fade-in-linear">
				<div class="album-playicon" v-show="isShowPlay">
					<span class="iconfont icon-play1"></span>
				</div>
			</transition>
			<!-- 图片本身 使用懒加载 -->
			<div class="album-img" v-lazy-container="{ selector: 'img' }">
				<img :data-src="cover" :data-loading="require('assets/imgs/loading.png')" />
			</div>
			<!-- 唱片图 -->
			<img src="~assets/imgs/cp2.png" alt="" class="record" v-if="albumlistitem.picUrl" />
			<div class="box" v-if="albumlistitem.picUrl"></div>
		</div>
		<!-- 歌单下的文字描述 -->
		<div class="item-text">
			<p class="albumName">
				<span>{{ albumlistitem.name }}</span> <span class="by" style="padding-left: 10px">{{ albumlistitem.artists[0].name }}</span>
			</p>
			<p v-if="albumlistitem.publishTime" class="by publishtime">
				{{ albumlistitem.publishTime | showDate }}
			</p>
			<p v-if="albumlistitem.subTime" class="by">
				{{ albumlistitem.subTime | showDate }}
			</p>
		</div>
	</div>
</template>

<script>
import { formatDate } from "common/formatDate";
export default {
	name: "AlbumListItem",
	props: {
		albumlistitem: {
			type: Object,
			default() {
				return {};
			},
		},
	},
	data() {
		return {
			isShowPlay: false, //用于播放图标遮罩层的显示与隐藏
		};
	},
	computed: {
		cover() {
			return this.albumlistitem.picUrl + "?param=200y200";
		},
	},
	filters: {
		showDate(value) {
			const date = new Date(value);
			return formatDate(date, "yyyy-MM-dd");
		},
	},
	methods: {
		showIcon() {
			this.isShowPlay = true;
		},
		closeIcon() {
			this.isShowPlay = false;
		},
		listItemClick() {
			this.$router.push("/albumdetail/" + this.albumlistitem.id);
			this.isShowPlay = false;
		},
	},
};
</script>

<style lang="less" scoped>
.item {
	width: 100%;
	cursor: pointer;
	.item-img {
		position: relative;
		width: 200px;
		height: 200px;
		.album-img {
			width: 100%;
			height: 100%;
			img {
				width: 100%;
				height: 100%;
			}
		}
		.album-playicon {
			position: absolute;
			display: flex;
			align-items: center;
			justify-content: center;
			top: 0;
			width: 100%;
			height: 100%;
			background: rgba(100, 100, 100, 0.3);
			.iconfont {
				font-size: 42px;
				color: #fff;
			}
		}
		.box {
			position: absolute;
			top: 7.5%;
			left: 36px;
			width: 85%;
			height: 85%;
			border: 1px solid #d5d5d8;
			background: rgba(100, 100, 100, 0.3);
			z-index: -1;
		}
		.record {
			position: absolute;
			top: 0px;
			left: 28px;
			width: 100%;
			height: 100%;
			z-index: -1;
		}
		img {
			width: 100%;
			height: 100%;
		}
	}
	.item-text {
		margin: 5px 0;
		font-size: 14px;
		.albumName,
		.publishtime {
			text-overflow: ellipsis;
			overflow: hidden;
			white-space: nowrap;
		}
	}
}
</style>
