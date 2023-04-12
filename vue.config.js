module.exports = {
	configureWebpack: {
		resolve: {
			alias: {
				assets: "@/assets",
				common: "@/common",
				components: "@/components",
				network: "@/network",
				layout: "@/layout",
				views: "@/views",
			},
		},
	},
	// devServer: {
	// 	proxy: {
	// 		"/api": {
	// 			target: "http://124.221.63.19:3000/",
	// 			changeOrigin: true,
	// 			ws: true,
	// 			pathRewrite: {
	// 				"^/api": "",
	// 			},
	// 		},
	// 	},
	// },
};
