<template>
	<div>动态</div>
</template>

<script>
import { getUserEvent } from "network/userdetail/userdetail";
export default {
	name: "UserEvent",

	data() {
		return {
			uid: "",
		};
	},
	created() {
		this.uid = this.$route.params.uid;
		getUserEvent(this.uid).then(res => {
			console.log(res);
		});
	},

	methods: {},
};
</script>

<style lang="less" scoped></style>
