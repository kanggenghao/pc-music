<template>
	<div class="search-input">
		<!-- 输入框 -->
		<el-input placeholder="请输入内容" size="small" v-model.trim="searchWord" v-popover:popover slot="reference" @keyup.enter.native="search">
			<span slot="suffix" class="el-icon-search" @click="search"></span>
		</el-input>
		<!-- 热搜弹出框 -->
		<el-popover ref="popover" placement="bottom" width="350" trigger="focus">
			<div class="list">
				<div class="history" v-if="historySearch.length != 0">
					<div class="hd">
						<h3>搜索历史</h3>
						<span @click="deleteAll" class="iconfont icon-delete">清空</span>
					</div>

					<div class="bd">
						<div class="historylist">
							<div class="historylistitem" v-for="(item, index) in historySearch" :key="index" @mouseover="showClear(index)" @mouseleave="clearIcon = false" @click="addHotWord(item)">
								<span class="icon"></span>
								<span class="txt">{{ item }}</span>
								<span class="icon"><i class="iconfont icon-guanbi" v-if="clearIcon && historySearchIndex == index" @click.stop="deleteHistory(index)"></i></span>
							</div>
						</div>
					</div>
				</div>
				<div class="hot-search-rank hot-search-pop">
					<h3>热搜榜</h3>
					<ul>
						<li v-for="(item, index) in searchList" :key="index" @click="addHotWord(item.searchWord)">
							<div class="num" :class="index < 3 ? 'hotword-num' : ''">
								{{ index + 1 }}
							</div>
							<div class="main-content">
								<div class="word">
									<span :class="index < 3 ? 'hotword' : ''">
										{{ item.searchWord }}
									</span>
									<span class="by">{{ item.score }}</span>
									<span class="icon" v-if="item.iconUrl">
										<img :src="item.iconUrl" alt="" />
									</span>
								</div>
								<p class="by" v-if="item.content">{{ item.content }}</p>
							</div>
						</li>
					</ul>
				</div>
			</div>
		</el-popover>
	</div>
</template>

<script>
import { getSearchHotWord } from "network/searchdetail/searchdeatil";
export default {
	name: "Searchinput",
	data() {
		return {
			searchWord: "",
			searchList: [],
			historySearch: this.getItem("historySearch") ? this.getItem("historySearch") : [],
			clearIcon: false,
			historySearchIndex: 0,
		};
	},
	created() {
		getSearchHotWord().then(res => {
			this.searchList = res.data.data;
		});
	},
	methods: {
		// 搜索事件
		search() {
			if (this.searchWord == "") {
				this.$message({
					showClose: true,
					message: "请输入内容",
					type: "warning",
					center: true,
				});
			} else {
				console.log("搜索");
				this.$router.push("/searchdetail/" + this.searchWord).catch(err => err);
				this.$refs.popover.doClose(); //关闭弹框
				this.addHistory(this.searchWord);
			}
		},
		// 热搜榜添加
		addHotWord(word) {
			this.$refs.popover.doClose(); //关闭弹框
			this.searchWord = word;
			this.$router.push("/searchdetail/" + this.searchWord).catch(err => err);
			this.addHistory(word);
		},
		addHistory(word) {
			if (!this.historySearch.includes(word)) {
				this.historySearch.push(word); //添加历史搜索
				this.setItem("historySearch", this.historySearch);
			}
		},
		showClear(index) {
			this.clearIcon = true;
			this.historySearchIndex = index;
		},
		deleteHistory(index) {
			this.historySearch.splice(index, 1);
			this.setItem("historySearch", this.historySearch);
		},
		deleteAll() {
			this.removeItem("historySearch");
			this.historySearch = [];
		},
	},
};
</script>

<style lang="less" scoped>
.search-input {
	position: relative;
	display: flex;
	align-items: center;
	.el-icon-search {
		cursor: pointer;
		padding-top: 10px;
		&:hover {
			color: var(--themeColor);
			font-weight: 700;
		}
	}
}
.list {
	width: 350px;
	height: 450px;
	overflow-y: scroll;
	h3 {
		padding-left: 6px;
	}
}
.history {
	padding-top: 5px;
	.hd {
		display: flex;
		align-items: center;
		.icon-delete {
			font-size: 13px;
			padding-left: 10px;
			&:hover {
				color: var(--themeColor);
				cursor: pointer;
			}
		}
	}
	.bd {
		.historylist {
			display: flex;
			flex-wrap: wrap;
			padding: 10px 5px;
			.historylistitem {
				margin-left: 5px;
				margin-bottom: 5px;
				padding: 3px 0;
				font-size: 13px;
				border-radius: 15px;
				border: 1px solid #d3d3d3;
				cursor: pointer;
				.icon {
					display: inline-block;
					width: 12px;
					height: 12px;
					margin-right: 3px;
				}
				.icon-guanbi {
					font-size: 12px;
					&:hover {
						color: var(--themeColor);
					}
				}
			}
		}
	}
}
.hot-search-rank {
	// width: 350px;
	// height: 450px;
	// overflow-y: scroll;
	cursor: pointer;
	background: #fff;
	li {
		display: flex;
		align-items: center;
		padding: 10px 5px;
		.num {
			width: 30px;
			padding-left: 5px;
		}
		.hotword-num {
			color: red;
			font-weight: 700;
		}
		.main-content {
			.word {
				span {
					padding-right: 10px;
				}
				.icon {
					display: inline-block;
					width: 30px;
					height: 20px;
					img {
						width: 100%;
					}
				}
			}
			p {
				padding-top: 5px;
			}
			.hotword {
				color: black;
				font-weight: 700;
			}
		}
	}
	li:hover {
		background: rgba(220, 220, 220, 0.4);
	}
}
</style>
