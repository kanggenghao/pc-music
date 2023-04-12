<template>
	<div class="tags-nav" v-if="allTag.length !== 0 || hotTag.length !== 0">
		<!-- 标签 -->
		<div class="tags">
			<!-- 全部标签 -->
			<div class="all" @click="showAllTag" ref="alltaglist">
				<span>{{ tagTitle }} <i class="el-icon-arrow-down"></i> </span>
			</div>
			<transition name="el-fade-in">
				<div class="all-tag-list" v-show="isShow">
					<div class="all-tag">
						<div class="all-tag-item" v-for="(item, index) in allTag" :key="index" @click="tagClickA(item.name, index, item.id)">
							<span :class="{ activeAll: currentIndexA == index }">{{ item.name }}</span>
						</div>
					</div>
				</div>
			</transition>

			<!-- 热门标签 -->
			<div class="hot-tag">
				<div class="hot-tag-item" v-for="(item, index) in hotTag" :key="index" @click="tagClickH(item.name, index, item.id)" :class="{ activeHot: currentIndexH == index }">
					{{ item.name }}
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: "TagsNav",
	props: {
		allTag: {
			type: Array,
			default() {
				return [];
			},
		},
		hotTag: {
			type: Array,
			default() {
				return [];
			},
		},
	},
	data() {
		return {
			isShow: false, //控制选项卡显示
			tagTitle: "全部分类",
			currentIndexA: null, //用于所有标签和热门标签联动
			currentIndexH: 0, //用于所有标签和热门标签联动
		};
	},
	methods: {
		// 显示所有标签分类
		showAllTag() {
			this.isShow = !this.isShow;
		},
		/* 全部标签点击事件 */
		tagClickA(tagNameA, index, id) {
			this.currentIndexA = index; //点击后绑定样式
			this.$emit("tagClick", tagNameA, id); //向父组件传递事件 用于从新发送网络请求(根据当前标签名或id获取数据)
			/* 热门和全部标签联动 */
			let indexH = this.hotTag.findIndex(item => {
				//查找热门标签里面是否存在当前点击的标签名，如果存在就返回该热门标签的索引
				return item.name == tagNameA;
			});
			this.currentIndexH = indexH; //给热门标签绑定样式
			/* 把当前点击的标签名作为标题 tagTitle */
			this.tagTitle = tagNameA;
		},

		/* 热门标签点击事件 */
		tagClickH(tagNameH, index, id) {
			this.currentIndexH = index;
			this.$emit("tagClick", tagNameH, id);
			/* 热门和全部标签联动 */
			let indexA = this.allTag.findIndex(item => {
				return item.name == tagNameH;
			});
			if (indexA == -1) {
				this.currentIndexA = null;
			} else this.currentIndexA = indexA;
			/* 把当前点击的标签名作为标题 tagTitle */
			this.tagTitle = tagNameH;
		},
	},
	mounted() {
		// 点击其他区域关闭所有标签分类
		document.addEventListener("mouseup", e => {
			let allTagList = this.$refs.alltaglist;
			if (allTagList) {
				if (!allTagList.contains(e.target)) {
					this.isShow = false;
				}
			}
		});
	},
};
</script>

<style lang="less" scoped>
// 标签
.tags {
	position: relative;
	display: flex;
	justify-content: space-between;
	cursor: pointer;
	span:hover {
		color: var(--themeColor);
	}
	.hot-tag {
		width: 70%;
		display: flex;
		justify-content: space-between;
		.hot-tag-item {
			padding: 3px 8px;
		}
	}
}
.all {
	padding: 0 10px;
	border: 1px solid #dddddd;
	border-radius: 5px;
	&:hover {
		border-color: var(--mycompColor);
		color: var(--mycompColor);
	}
}
.all-tag-list::before {
	position: absolute;
	top: -30px;
	left: 15px;
	content: "";
	width: 0;
	height: 0;
	border: 15px solid;
	border-left-color: transparent;
	border-top-color: transparent;
	border-right-color: transparent;
	border-bottom-color: #fff;
}
.all-tag-list {
	position: absolute;
	top: 40px;
	left: 25px;
	z-index: 99;
}
.all-tag {
	display: grid;
	justify-content: space-around;
	align-content: space-between;
	grid-template-columns: repeat(4, 24%);
	width: 400px;
	height: 300px;
	overflow-y: scroll;
	overflow-x: hidden;
	background: #fff;
	box-shadow: 0px 0px 8px 3px #eee;
	// padding: 10px 0px;
	.all-tag-item {
		padding: 8px 0;
		width: 90px;
		text-align: center;
		span {
			padding: 3px 5px;
		}
	}
}
.activeHot {
	color: var(--mycompColor);
	background: var(--tagRgba);
	border-radius: 5px;
}
.activeAll {
	color: var(--mycompColor);
	background: var(--tagRgba);
	border-radius: 5px;
}

// 滚动条
::-webkit-scrollbar {
	width: 5px;
	height: 5px;
	background-color: #fff;
}
</style>
