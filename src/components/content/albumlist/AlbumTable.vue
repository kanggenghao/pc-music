<template>
	<div class="album-table">
		<el-table :data="albumlist" :show-header="false" stripe style="width: 100%" @cell-click="albumClick">
			<el-table-column type="index" label="序号"></el-table-column>
			<el-table-column prop="picUrl" width="85">
				<template v-slot="scope">
					<img v-lazy="scope.row.picUrl + '?param=80y80'" alt="" width="50" height="50" />
				</template>
			</el-table-column>
			<el-table-column prop="name" label="专辑名称"></el-table-column>
			<el-table-column prop="size" label="歌曲数量">
				<template v-slot="scope">
					<span>{{ scope.row.size }}首</span>
				</template>
			</el-table-column>
			<el-table-column prop="publishTime" label="发行时间">
				<template v-slot="scope">
					<span>{{ scope.row.publishTime | showDate }}</span>
				</template>
			</el-table-column>
			<el-table-column prop="company" label="出品公司"></el-table-column>
		</el-table>
	</div>
</template>
<script>
import { formatDate } from "common/formatDate";
export default {
	name: "AlbumTable",
	props: {
		albumlist: {
			type: Array,
			default() {
				return [];
			},
		},
	},
	filters: {
		showDate(value) {
			const date = new Date(value);
			return formatDate(date, "yyyy-MM-dd");
		},
	},
	methods: {
		albumClick(event) {
			this.$router.push("/albumdetail/" + event.id);
		},
	},
};
</script>

<style lang="less" scoped>
.album-table {
	cursor: pointer;
}
</style>
