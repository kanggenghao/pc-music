<template>
	<div class="privatecontent" v-if="privatecontent.length !== 0">
		<div class="hd">
			<el-divider content-position="left"><h2>独家放送</h2></el-divider>
		</div>
		<div class="bd">
			<div class="item" v-for="(item, index) in privatecontent" :key="index" @click="videoItemClick(item.id)">
				<div class="item-img">
					<img :src="item.sPicUrl" alt="" />
					<div class="icon">
						<span class="iconfont icon-play-square"></span>
					</div>
				</div>
				<div class="item-text">
					{{ item.name }}
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: "Privatecontent",
	props: {
		privatecontent: {
			type: Array,
			default() {
				return [];
			},
		},
	},
	methods: {
		videoItemClick(id) {
			this.$router.push({ name: "VideoDetail", params: { id, type: "mv" } });
		},
	},
};
</script>

<style lang="less" scoped>
.privatecontent {
	.bd {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		width: 100%;
		.item {
			width: 30%;
			.item-img {
				position: relative;
				img {
					width: 100%;
				}
				.icon {
					position: absolute;
					top: 5px;
					right: 5px;
					color: #fff;
					.iconfont {
						font-size: 32px;
					}
				}
			}
			.item-text {
				padding-top: 5px;
				font-size: 14px;
			}
		}
	}
}
</style>
