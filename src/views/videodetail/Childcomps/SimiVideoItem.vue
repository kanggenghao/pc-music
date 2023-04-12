<template>
	<div class="simiitem" @click="simiVideoClick">
		<div class="item-img">
			<img :src="simiitem.cover || simiitem.coverUrl" alt="" class="bgImg" />
			<img :src="simiitem.cover || simiitem.coverUrl" alt="" />
			<div class="play-icon">
				<span class="iconfont icon-play-square"></span>
				{{ simiitem.playCount || simiitem.playTime | formatNum }}
			</div>
			<div class="playduration">
				<span>{{ simiitem.duration || simiitem.durationms | formatDuration }}</span>
			</div>
		</div>
		<div class="item-text">
			<div class="tname">{{ simiitem.name || simiitem.title }}</div>
			<p class="by">by {{ simiitem.artistName || simiitem.creator[0].userName }}</p>
		</div>
	</div>
</template>

<script>
export default {
	name: "Simivideoitem",
	props: {
		simiitem: {
			type: Object,
			default() {
				return {};
			},
		},
	},
	methods: {
		simiVideoClick() {
			if (this.$route.params.type == "mv") {
				this.$router.push({
					name: "VideoDetail",
					params: { id: this.simiitem.id, type: "mv" },
				});
			} else if (this.$route.params.type == "video") {
				this.$router.push({
					name: "VideoDetail",
					params: { id: this.simiitem.vid, type: "video" },
				});
			}
		},
	},
};
</script>

<style lang="less" scoped>
.simiitem {
	display: flex;
	align-items: center;
	padding: 10px 5px;
	cursor: pointer;
}
.item-img {
	position: relative;
	flex: 4;
	img {
		width: 100%;
	}
	.play-icon {
		position: absolute;
		top: 0;
		right: 0;
		color: #fff;
		background: rgba(100, 100, 100, 0.5);
		padding: 0 5px;
	}
	.playduration {
		position: absolute;
		bottom: 0;
		left: 0;
		background: rgba(100, 100, 100, 0.5);
		color: #fff;
		span {
			padding: 5px;
		}
	}
}
.item-text {
	flex: 2;
	padding-left: 30px;
	.tname {
		padding-bottom: 10px;
		overflow: hidden;
		text-overflow: ellipsis;
	}
}
</style>
