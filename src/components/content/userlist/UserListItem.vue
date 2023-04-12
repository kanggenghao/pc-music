<template>
	<div class="user-list-item" @click="toUserDetail">
		<div class="left-avatar">
			<img v-lazy="userlistitem.avatarUrl + '?param=80y80'" alt="" />
		</div>
		<div class="right-uname">
			<p class="uname">{{ userlistitem.nickname }}</p>
			<p class="by">
				{{ userlistitem.signature == " " ? "" : userlistitem.signature }}
			</p>
			<p class="info" v-if="userlistitem.playlistCount">
				<span>歌单:{{ userlistitem.playlistCount }}</span>
				<span>粉丝:{{ userlistitem.followeds }}</span>
			</p>
		</div>
	</div>
</template>

<script>
export default {
	name: "UserListItem",
	props: {
		userlistitem: {
			type: Object,
			default() {
				return {};
			},
		},
	},
	methods: {
		toUserDetail() {
			this.$router.push("/userdetail/" + this.userlistitem.userId);
		},
	},
};
</script>

<style lang="less" scoped>
.user-list-item {
	display: flex;
	align-items: center;
	width: 100%;
	padding: 10px 5px;
	cursor: pointer;
	&:hover {
		background: rgb(245, 245, 245, 0.3);
		border-radius: 5px;
	}
	.left-avatar {
		width: 25%;
		img {
			width: 100%;
			border-radius: 50%;
		}
	}
	.right-uname {
		width: 75%;
		padding-left: 10px;
		p {
			padding: 3px 0;
			span {
				padding-right: 5px;
			}
		}
		.by {
			width: 100%;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
	}
}
</style>
