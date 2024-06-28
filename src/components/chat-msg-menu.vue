<template>
	<view class="menu-box">
		<view v-for="(item, index) in menuList" :key="item.id">
			<view class="menu-box-inner" v-if="msgUserId === userId || !item.isShowSelf"
				@click="clickMenu(item.type, content)">
				<image class="menu-icon" :src="item.icon" />
				<view class="text-style">{{ item.name }}</view>
			</view>
		</view>
	</view>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface MenuItem {
	id: number;
	isShowSelf: boolean;
	name: string;
	type: string;
	icon: string;
}

const emit = defineEmits<{
  (event: 'cancelMsg', payload: number): void;
}>();


const props = defineProps({
	msgUserId: {
		type: String,
		default: ""
	},
	msgId: {
		type: String,
		default: undefined
	},
	msgSortId: {
		type: Number,
		default: 0
	},
	content: {
		type: String,
		default: ""
	},
	time: {
		type: String,
		default: ""
	}
});

const userId = ref(uni.getStorageSync("userId"));

const menuList = ref<MenuItem[]>([
	{ id: 1, isShowSelf: true, name: "撤回", type: "cancel", icon: "../static/avatar1.jpg" },
	{ id: 2, isShowSelf: false, name: "复制", type: "copy", icon: "../static/avatar1.jpg" },
	{ id: 3, isShowSelf: false, name: "引用", type: "quote", icon: "../static/avatar1.jpg" }
]);

const clickMenu = (type: string, text: string) => {
	switch (type) {
		case "cancel":
			delMsg();
			break;
		case "copy":
			copyText(text);
			break;
		default:
			console.log(type);
	}
};

const delMsg = () => {
	// 请求撤回消息的逻辑
	// this.$request("/msg/delMsg", "DELETE", { "msgId": props.msgId }, { "Content-Type": "application/x-www-form-urlencoded" }).then(res => {
	//   if (res.data.status == "ok") {
	//     uni.showToast({
	//       icon: "none",
	//       title: "消息已撤回",
	//       duration: 1000
	//     });
	//     emit("cancelMsg", props.msgSortId);
	//   }
	// });

	// 模拟撤回消息行为
	uni.showToast({
		icon: "none",
		title: "消息已撤回",
		duration: 1000
	});
	emit("cancelMsg", props.msgSortId);
};

const copyText = (text: string) => {
	// wx.setClipboardData({
	// 	data: text,
	// 	success() {
	// 		wx.getClipboardData({
	// 			success() {
	// 				uni.showToast({
	// 					icon: 'none',
	// 					title: "复制成功",
	// 					duration: 1000
	// 				});
	// 			}
	// 		});
	// 	}
	// });
};

</script>

<style scoped lang="scss">
.center {
	display: flex;
	align-items: center;
	justify-content: center;
}

.menu-box {
	min-width: 100rpx;
	height: 100rpx;
	@extend .center;
}

.menu-box-inner {
	width: 90rpx;
	@extend .center;
	flex-direction: column;
}

.menu-icon {
	width: 45rpx;
	height: 45rpx;
}

.text-style {
	font-size: 23rpx;
	color: #e6e6e6;
}
</style>