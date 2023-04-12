<template>
	<div class="similar-list">
		<Singerlist :singerlist="similarlist" />
	</div>
</template>
<script>
import Singerlist from "components/content/singerlist/Singerlist.vue";
export default {
	name: "SingerSimilar",
	components: { Singerlist },
	props: {
		similarlist: {
			type: Array,
			default() {
				return [];
			},
		},
	},
	methods: {},
};
</script>

<style lang="less" scoped></style>
