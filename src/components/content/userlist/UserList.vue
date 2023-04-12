<template>
	<div class="user-list">
		<UserListItem v-for="(item, index) in userlist" :key="index" :userlistitem="item" />
	</div>
</template>

<script>
import UserListItem from "./UserListItem.vue";
export default {
	name: "UserList",
	components: { UserListItem },
	props: {
		userlist: {
			type: Array,
			default() {
				return [];
			},
		},
	},
};
</script>

<style lang="less" scoped>
.user-list {
	display: grid;
	justify-content: space-between;
	align-content: space-between;
	grid-template-rows: repeat(12, auto-fill);
	grid-template-columns: repeat(4, 24%);
}
</style>
