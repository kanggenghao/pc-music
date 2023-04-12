<template>
	<div class="singer-list-item" @click="singerClick(singeritem.id)" @mouseenter="showM" @mouseleave="closeM">
		<div class="item-img" v-lazy-container="{ selector: 'img' }">
			<img :data-src="cover" :data-loading="require('assets/imgs/singerload.png')" />
			<transition name="el-zoom-in-top">
				<div class="mask1" v-show="isShowIcon">
					<span class="iconfont icon-yinyue"></span>
					<span>{{ singeritem.musicSize }}</span>
				</div>
			</transition>
			<transition name="el-zoom-in-bottom">
				<div class="mask2" v-show="isShowIcon">
					<span class="iconfont icon-zhuanji"></span>
					<span>{{ singeritem.albumSize }}</span>
				</div>
			</transition>
			<transition name="el-fade-in-linear">
				<div class="mask3" v-show="isShowDetail">
					<div class="text">查看详情></div>
				</div>
			</transition>
		</div>
		<div class="item-name">
			<span class="iconfont">&#xe841;</span>
			<span>{{ singeritem.name }}</span>
		</div>
	</div>
</template>

<script>
export default {
	name: "SingerListItem",
	props: {
		singeritem: {
			type: Object,
			default() {
				return {};
			},
		},
	},
	data() {
		return {
			isShowIcon: true,
			isShowDetail: false,
		};
	},
	computed: {
		cover() {
			return this.singeritem.img1v1Url + "?param=200y200";
		},
	},
	methods: {
		showM() {
			this.isShowIcon = false;
			this.isShowDetail = true;
		},
		closeM() {
			this.isShowIcon = true;
			this.isShowDetail = false;
		},
		//  点击路由跳转
		singerClick(id) {
			this.$router.push("/singerdetail/" + id);
			this.isShowIcon = true;
			this.isShowDetail = false;
		},
	},
};
</script>

<style lang="less" scoped>
.singer-list-item {
	width: 100%;
	margin-bottom: 20px;
	cursor: pointer;
	.item-img {
		position: relative;
		img {
			width: 100%;
			height: 100%;
		}
		img[lazy="error"] {
			width: 100%;
		}
		.mask1 {
			position: absolute;
			top: 5px;
			width: 100%;
			color: #fff;
			height: 24px;
			line-height: 24px;
			span {
				padding-left: 5px;
			}
		}
		.mask2 {
			position: absolute;
			bottom: 5px;
			text-align: right;
			width: 100%;
			color: #fff;
			height: 24px;
			line-height: 24px;
			span {
				padding-right: 5px;
			}
		}
		.mask3 {
			position: absolute;
			top: 0%;
			display: flex;
			justify-content: center;
			align-items: center;
			width: 100%;
			height: 100%;
			background: rgba(100, 100, 100, 0.3);
			.text {
				text-align: center;
				font-size: 16px;
				color: #fff;
				padding: 8px 15px;
				border: 1px solid #fff;
			}
		}
	}

	.item-name {
		margin-top: 5px;
		span {
			padding: 0 5px;
		}
	}
}
</style>
