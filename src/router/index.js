import Vue from "vue";
import VueRouter from "vue-router";
Vue.use(VueRouter);

/* 1 发现音乐 */
const Findmusic = () => import("../views/findmusic/Findmusic.vue");
// 个性推荐
const Discover = () => import("../views/findmusic/discover/Discover.vue");
// 推荐歌单
const Recsonglist = () => import("../views/findmusic/recsonglist/Recsonglist.vue");
// 排行榜
const Songrank = () => import("../views/findmusic/songrank/Songrank.vue");
// 歌手
const Singer = () => import("../views/findmusic/signer/Singer.vue");
// 最新音乐
const Newsongs = () => import("../views/findmusic/newsongs/Newsongs.vue");
// 歌单详情
const Songlistdetail = () => import("../views/songlistdetail/Songlistdetail.vue");
// 歌手详情
const Singerdetail = () => import("../views/singerdetail/Singerdetail.vue");
// 专辑详情
const Albumdetail = () => import("../views/zhuanjidetail/Albumdetail.vue");

/* 2 推荐视频 */
const Recvideo = () => import("../views/recvideo/Recvideo.vue");
// MV
const Mv = () => import("../views/recvideo/Childcomps/Mv.vue");
// 视频
const Video = () => import("../views/recvideo/Childcomps/Video.vue");
// MV,视频详情页
const VideoDetail = () => import("../views/videodetail/VideoDetail.vue");

/* 3 我的收藏 */
const MyFavorite = () => import("../views/myfavorite/MyFavorite.vue");
const FavoriteAlbum = () => import("../views/myfavorite/Childcomps/FavoriteAlbum.vue");
const FavoriteSinger = () => import("../views/myfavorite/Childcomps/FavoriteSinger.vue");
const FavoriteMv = () => import("../views/myfavorite/Childcomps/FavoriteMv.vue");
/* 4 每日推荐 */
const RecEveryDay = () => import("../views/receveryday/RecEveryDay.vue");

/* 搜索详情页 */
const Searchdetail = () => import("../views/searchdetail/Searchdetail.vue");
const SongRes = () => import("../views/searchdetail/Childcomps/SongRes.vue");
const AlbumRes = () => import("../views/searchdetail/Childcomps/AlbumRes.vue");
const SingerRes = () => import("../views/searchdetail/Childcomps/SingerRes.vue");
const SongListRes = () => import("../views/searchdetail/Childcomps/SongListRes.vue");
const MvRes = () => import("../views/searchdetail/Childcomps/MvRes.vue");
const VideoRes = () => import("../views/searchdetail/Childcomps/VideoRes.vue");

/* 用户详情 */
const UserDetail = () => import("../views/userdetail/UserDetail.vue");
const Follows = () => import("../views/userdetail/Childcomps/Follows.vue");
const FansList = () => import("../views/userdetail/Childcomps/FansList.vue");
const Record = () => import("../views/userdetail/Childcomps/Record.vue");
const UserEvent = () => import("../views/userdetail/Childcomps/UserEvent.vue");
const routes = [
	/* 1 发现音乐 */
	{
		path: "/",
		redirect: "/findmusic",
	},
	{
		path: "/findmusic",
		component: Findmusic,
		name: "Findmusic",
		redirect: "/findmusic/discover",
		children: [
			{
				path: "discover",
				name: "Discover",
				component: Discover,
			},
			{
				path: "recsonglist",
				name: "Recsonglist",
				component: Recsonglist,
			},
			{
				path: "songrank",
				name: "Songrank",
				component: Songrank,
			},
			{
				path: "singer",
				name: "Singer",
				component: Singer,
			},
			{
				path: "newsongs",
				name: "Newsongs",
				component: Newsongs,
			},
		],
	},

	/* 歌单详情 */
	{
		path: "/songlistdetail/:id",
		name: "Songlistdetail",
		component: Songlistdetail,
	},
	/* 歌手详情 */
	{
		path: "/singerdetail/:id",
		name: "Singerdetail",
		component: Singerdetail,
	},
	/* 专辑详情 */
	{
		path: "/albumdetail/:id",
		name: "Albumdetail",
		component: Albumdetail,
	},

	/* 2 推荐视频 */
	{
		path: "/recvideo",
		component: Recvideo,
		name: "Recvideo",
		redirect: "/recvideo/mv",
		children: [
			{
				path: "mv",
				name: "Mv",
				component: Mv,
			},
			{
				path: "video",
				name: "Video",
				component: Video,
			},
		],
	},

	/* 视频详情 */
	{
		path: "/videolistdetail/:id/:type",
		name: "VideoDetail",
		component: VideoDetail,
	},

	/*3 我的收藏  */
	{
		path: "/myfavorite",
		component: MyFavorite,
		name: "MyFavorite",
		redirect: "/myfavorite/album",
		children: [
			{
				path: "/myfavorite/album",
				name: "FavoriteAlbum",
				component: FavoriteAlbum,
			},
			{
				path: "/myfavorite/singer",
				name: "FavoriteSinger",
				component: FavoriteSinger,
			},
			{
				path: "/myfavorite/mv",
				name: "FavoriteMv",
				component: FavoriteMv,
			},
		],
	},

	/* 4 每日推荐 */
	{
		path: "/receveryday",
		name: "RecEveryDay",
		component: RecEveryDay,
	},

	/* 搜索详情*/
	{
		path: "/searchdetail/:keywords",
		component: Searchdetail,
		redirect: "/searchdetail/songres/:keywords",
		children: [
			{
				path: "/searchdetail/songres/:keywords",
				name: "SongRes",
				component: SongRes,
			},
			{
				path: "/searchdetail/albumres/:keywords",
				name: "AlbumRes",
				component: AlbumRes,
			},
			{
				path: "/searchdetail/singerres/:keywords",
				name: "SingerRes",
				component: SingerRes,
			},
			{
				path: "/searchdetail/songlistres/:keywords",
				name: "SongListRes",
				component: SongListRes,
			},
			{
				path: "/searchdetail/mvres/:keywords",
				name: "MvRes",
				component: MvRes,
			},
			{
				path: "/searchdetail/videores/:keywords",
				name: "VideoRes",
				component: VideoRes,
			},
		],
	},

	/* 用户详情 */
	{
		path: "/userdetail/:uid",
		name: "UserDetail",
		component: UserDetail,
	},
	// 关注
	{
		path: "/userdetail/follows/:uid/:uname/:follows",
		name: "Follows",
		component: Follows,
	},
	// 粉丝
	{
		path: "/userdetail/fanslist/:uid/:uname",
		name: "FansList",
		component: FansList,
	},
	// 听歌排行
	{
		path: "/userdetail/record/:uid",
		name: "Record",
		component: Record,
	},
	{
		path: "/userdetail/userevent/:uid/",
		name: "UserEvent",
		component: UserEvent,
	},
];

const router = new VueRouter({
	mode: "hash",
	routes,
});

export default router;
