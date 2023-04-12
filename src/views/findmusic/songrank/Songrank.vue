<template>
	<div id="song-rank">
		<Rankfeature :rankfeature="rankfeature" v-if="rankfeature.length != 0" />
		<Rankglobal :rankglobal="rankglobal" v-if="rankglobal.length != 0" />
	</div>
</template>

<script>
/* 网络请求 */
import { getAllRank } from "network/findmusic/songrank/songrank";
/* 子组件 */
import Rankfeature from "./Childcomps/Rankfeature";
import Rankglobal from "./Childcomps/Rankglobal";
export default {
	name: "Songrank",
	components: { Rankfeature, Rankglobal },
	data() {
		return {
			rankfeature: [],
			rankglobal: [],
		};
	},
	created() {
		getAllRank().then(res => {
			// 处理榜单数据 分为两个数组
			let allRankInfo = res.data.list;
			this.rankfeature = allRankInfo.slice(0, 4);
			this.rankglobal = allRankInfo.slice(4, allRankInfo.length);
		});
	},
};
</script>

<style lang="less" scoped></style>
