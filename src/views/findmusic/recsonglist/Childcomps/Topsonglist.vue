<template>
	<div class="topsonglist" v-if="topsonglist.length !== 0" @mouseover="showPlay" @mouseleave="closePlay" @click="topSongClick">
		<div class="image">
			<img v-lazy="topsonglist[0].coverImgUrl + '?param=200y200'" />
			<!-- <img v-lazy="topsonglist[0].coverImgUrl + '?param=200y200'" class="bgImg" /> -->
			<transition name="el-fade-in-linear">
				<div class="mask-playicon" v-show="isShowPlay">
					<span class="iconfont icon-play"></span>
				</div>
			</transition>
		</div>
		<div class="info">
			<div class="hd">
				<el-divider content-position="left"><h2>精品歌单</h2></el-divider>
			</div>
			<div class="title">
				{{ topsonglist[0].name }}
			</div>
			<div class="desc">
				{{ topsonglist[0].description }}
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: "Topsonglist",
	props: {
		topsonglist: {
			type: Array,
			default() {
				return [];
			},
		},
	},
	data() {
		return {
			isShowPlay: false,
		};
	},
	methods: {
		showPlay() {
			//鼠标经过时显示播放图标
			this.isShowPlay = true;
		},
		closePlay() {
			//鼠标离开时隐藏播放图标
			this.isShowPlay = false;
		},
		topSongClick() {
			this.$router.push("/songlistdetail/" + this.topsonglist[0].id);
		},
	},
};
</script>

<style lang="less" scoped>
.topsonglist {
	position: relative;
	display: flex;
	justify-content: space-between;
	width: 100%;
	.image {
		position: relative;
		width: 16%;
		cursor: pointer;
		img {
			width: 100%;
		}
	}
	.info {
		width: 80%;
		.title {
			font-size: 16px;
			padding-bottom: 5px;
		}
		.desc {
			height: 110px;
			font-size: 12px;
			color: #909399;
			overflow-y: scroll;
		}
	}
}
::-webkit-scrollbar {
	width: 3px;
	height: 12px;
	background-color: #fff;
}
</style>
