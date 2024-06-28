<template>
	<view class="chat">
		<scroll-view class="scroll-view" :style="{ height: `${windowHeight - inputHeight}rpx` }" id="scrollview"
			scroll-y="true" :scroll-top="scrollTop" @scrolltoupper="topRefresh" @click="touchClose">
			<view id="msglistview" class="chat-body">

				<ChatContent v-for="(item, index) in msgList" :key="item.sendUserId" :item="item" :userId="userId"
					v-model:showBoxId="showBoxId" :index="index" :cancelMsg="cancelMsg" />
			</view>
		</scroll-view>
		<view class="chat-bottom" :style="{ height: `${inputHeight}rpx` }">
			<view class="send-msg" :style="{ bottom: `${keyboardHeight}rpx` }">
				<view class="uni-textarea">

					<Icon name="voice" size="24" class="pr-4" @click="changeInputType" />
					<view class="out_textarea_box">
						<textarea placeholder-class="textarea_placeholder"
							:style="{ textAlign: (textareaConf.disabled ? 'center' : undefined) }" v-model="chatMsg"
							maxlength="250" confirm-type="send" auto-height :placeholder="textareaConf.text"
							:show-confirm-bar="false" :adjust-position="false" :disabled="textareaConf.disabled"
							@confirm="handleSend" @linechange="sendHeight" @focus="focus" @blur="blur"
							@touchstart="handleTouchStart" @touchmove="handleTouchMove" @touchend="handleTouchEnd"
							@keyboardheightchange="handleKeyboardHeightChange" />
					</view>
					<Icon name="sticker" size="24" class="px-4" @click="handleSend" />
					<Icon name="add2" size="24" class="px-4" @click="moreMenu" />
				</view>
			</view>
			<view :style="{ display: showMoreMenu ? 'block' : 'none' }" class="more-menu">
				<view class="inner-box">
					<view class="menu" @click="sendFile('choose', '')">
						<view>
							<img class="i-style" :src="imgConf.sendphoto" />
							<view class="t-style">照片</view>
						</view>
					</view>
					<view class="menu" @click="sendFile('shoot', '')">
						<view>
							<img class="i-style" :src="imgConf.takePhoto" />
							<view class="t-style">拍摄</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="voice-mask" v-show="voice.mask">
			<view class="inner-mask">
				<view class="voice-progress-box" :style="{ width: `${progressNum}` + 'rpx' }">
					<view class="third-icon" />
					<view class="progress-num">
						{{ voice.length }}s
					</view>
				</view>
				<view class="cancel-btn" :class="{ cancelBtn: voice.cancel }">
					<img style="width: 60rpx;height: 60rpx;" src="../static/avatar1.jpg" />
				</view>
				<view class="show-tips">
					上滑取消发送
				</view>
				<view class="bottom-area">
					<img class="img-style" :src="imgConf.voiceBtn" />
				</view>
			</view>
		</view>
	</view>
</template>


<script setup lang="ts">
import { ref, computed, onMounted, onUpdated, onUnmounted } from 'vue';
import timeMethod from '@/tools/time-method';
import ChatContent from '@/components/chat-content.vue';
import type { TMessage, TVoice } from '@/type';
import Icon from '@/components/icon.vue';

const imgConf = ref({
	emoji: "../static/avatar1.jpg",
	more: "../static/avatar1.jpg",
	sendphoto: "../static/avatar1.jpg",
	sendVideo: "../static/avatar1.jpg",
	takePhoto: "../static/avatar1.jpg",
	voiceBtn: "../static/avatar1.jpg",
	keyboard: "../static/avatar1.jpg",
	speak: "../static/avatar1.jpg",
	replayChange: "../static/avatar1.jpg",
	replay: "../static/avatar1.jpg",
	replaing: "../static/avatar1.jpgg"
});

const changeLogUrl = ref("../static/avatar1.jpg");
const loading = ref(false);
const keyboardHeight = ref(0);
const bottomHeight = ref(0);
const scrollTop = ref(0);
const chatMsg = ref("");
const userId = ref("20220328001");
const userHeadImg = ref("");
const toUserId = ref("20220328007");
const toUserHeadImg = ref("");
const pageSize = ref(20);
const pageNum = ref(1);
const returnPageNum = ref(0);
const msgList = ref<TMessage[]>([]);
const judgeScrollToBottom = ref(true);
const startTime = ref("");
const msgID = ref(0);
const showBoxId = ref("");
const showBoxUserId = ref("");
const showMoreMenu = ref(false);
const textareaConf = ref({
	disabled: false,
	text: ""
});
const voice = ref<TVoice>({
	mask: false,
	length: 0,
	cancel: false,
	startX: 0,
	startY: 0,
	timer: null as any,
	recordInstance: null as any,
	finished: false
});
const msgConf = ref({
	showTimeSpace: 120
});

onMounted(() => {
	// 你的 mounted 逻辑
	getUserInfo();
	getMessage();
	readedMsg();
});

onUpdated(() => {
	if (judgeScrollToBottom.value) {
		scrollToBottom();
	}
});

onUnmounted(() => {
	// 关闭 socket 连接
	uni.closeSocket({
		code: 200,
		success() {
			console.log("正常关闭");
		}
	});
});

const windowHeight = computed(() => {
	return rpxTopx(uni.getSystemInfoSync().windowHeight);
});

const inputHeight = computed(() => {
	return bottomHeight.value + keyboardHeight.value;
});

const progressNum = computed(() => {
	return voice.value.length * 2 + 250;
});

const handleKeyboardHeightChange = (event: any) => {
	keyboardHeight.value = rpxTopx(event.detail.height);
	if (keyboardHeight.value <= 0) {
		keyboardHeight.value = 0;
		showMoreMenu.value = false;
	}
};

const topRefresh = () => {
	if (pageNum.value < returnPageNum.value) {
		pageNum.value++;
		judgeScrollToBottom.value = false;
		loading.value = true;
		getMessage();
	}
};

const getMessage = () => {
	const data: TMessage[] = [{
		"id": '30',
		"sendUserId": "20220328007",
		"acceptUserId": "20220328001",
		"type": "text",
		"content": "666",
		"sendTime": "2023-11-11 13:48:25",
		"wxUser": {
			"nickName": "Andy",
			"headImg": "../static/avatar2.jpg"
		}
	}, {
		"id": '29',
		"sendUserId": "20220328001",
		"acceptUserId": "20220328007",
		"type": "text",
		"content": "555",
		"sendTime": "2023-11-11 13:48:25",
		"wxUser": {
			"nickName": "Andy",
			"headImg": "../static/avatar1.jpg"
		}
	},
	{
		"id": '28',
		"sendUserId": "20220328001",
		"acceptUserId": "20220328007",
		"type": "voice",
		"soundTIme": 60,
		"content": "http://xxx/static/images/779e2a63-9d30-4db1-bace-a1d50ecb3866.mp3",
		"sendTime": "2023-11-11 13:48:24",
		"wxUser": {
			"nickName": "Andy",
			"headImg": "../static/avatar1.jpg"
		}
	},
	{
		"id": '2843729847239',
		"sendUserId": "20220328007",
		"acceptUserId": "20220328001",
		"type": "voice",
		"soundTIme": 60,
		"content": "http://xxx/static/images/779e2a63-9d30-4db1-bace-a1d50ecb3866.mp3",
		"sendTime": "2023-11-11 13:48:24",
		"wxUser": {
			"nickName": "Andy",
			"headImg": "../static/avatar2.jpg"
		}
	},
	{
		"id": '27',
		"sendUserId": "20220328001",
		"acceptUserId": "20220328007",
		"type": "img",
		"content": "../static/avatar1.jpg",
		"sendTime": "2023-11-11 13:48:25",
		"wxUser": {
			"nickName": "Andy",
			"headImg": "../static/avatar1.jpg"
		}
	}
	];
	showMsgTime(data);
	loading.value = false;
};

const showMsgTime = (data: any[]) => {
	data.forEach((e) => {
		e.isShowTime = false;
		e.sendTime = timeMethod.timeFormat(e.sendTime, "T");
		msgID.value++;
		if (startTime.value != "") {
			if (
				Math.abs(timeMethod.calculateTime(e.sendTime, startTime.value)) / 1000 >
				msgConf.value.showTimeSpace
			) {
				msgList.value.slice(0 - msgID.value)[0].isShowTime = true;
			}
		}
		startTime.value = e.sendTime;
		msgList.value.unshift(e);
	});
	if (pageNum.value == returnPageNum.value) {
		msgList.value[0].isShowTime = true;
	}
};



const getUserInfo = () => {
	// 获取用户信息的逻辑
};

const focus = () => {
	scrollToBottom();
};

const blur = () => {
	scrollToBottom();
};

const rpxTopx = (px: number) => {
	let deviceWidth = uni.getSystemInfoSync().windowWidth;
	let rpx = (750 / deviceWidth) * Number(px);
	return Math.floor(rpx);
};

const sendHeight = () => {
	setTimeout(() => {
		let query = uni.createSelectorQuery();
		query.select('.send-msg').boundingClientRect();
		query.exec((res: any) => {
			bottomHeight.value = rpxTopx(res[0].height);
		});
	}, 200);
};

const scrollToBottom = (e?: any) => {
	setTimeout(() => {
		let query = uni.createSelectorQuery().in(this);
		query.select('#scrollview').boundingClientRect();
		query.select('#msglistview').boundingClientRect();
		query.exec((res: any) => {
			if (res[1].height > res[0].height) {
				scrollTop.value = rpxTopx(res[1].height - res[0].height);
			}
		});
	}, 200);
};

const handleSend = () => {
	judgeScrollToBottom.value = true;
	pageNum.value = 1;
	if (chatMsg.value.length !== 0) {
		// 发送消息的逻辑
	}
};

const showTime = () => {
	let time = timeMethod.getNowTime();
	if (timeMethod.calculateTime(time, msgList.value.slice(-1)[0].sendTime) / 1000 > msgConf.value.showTimeSpace) {
		return true;
	} else {
		return false;
	}
};

const readedMsg = () => {
	// 标记消息已读的逻辑
};



const cancelMsg = (idx: number) => {
	msgList.value.splice(idx, 1);
};

const changeInputType = () => {
	if (changeLogUrl.value == imgConf.value.speak) {
		changeLogUrl.value = imgConf.value.keyboard;
		textareaConf.value.disabled = true;
		textareaConf.value.text = "按住说话";
		chatMsg.value = "";
	} else {
		changeLogUrl.value = imgConf.value.speak;
		textareaConf.value.disabled = false;
		textareaConf.value.text = "";
	}
};

const touchClose = () => {
	showBoxId.value = "";
	showMoreMenu.value = false;
	keyboardHeight.value = 0;
};

const moreMenu = () => {
	keyboardHeight.value = 300;
	setTimeout(() => {
		showMoreMenu.value = true;
	}, 100);
};

const handleTouchStart = (e: TouchEvent) => {
	if (textareaConf.value.disabled) {
		voice.value.finished = false;
		uni.getSetting({
			success(res) {
				if (res.authSetting['scope.record'] === undefined) {
					console.log("第一次授权");
				} else if (!res.authSetting['scope.record']) {
					uni.showToast({
						icon: "none",
						title: "点击右上角···进入设置开启麦克风授权！",
						duration: 2000
					});
				} else {
					voice.value.recordInstance.start();
					voice.value.mask = true;
					voice.value.isRecord = true;
					voice.value.length = 1;
					voice.value.startX = e.touches[0].pageX;
					voice.value.startY = e.touches[0].pageY;
					voice.value.timer = setInterval(() => {
						voice.value.length += 1;
						if (voice.value.length >= 60) {
							clearInterval(voice.value.timer);
							handleTouchEnd();
						}
					}, 1000);
					if (voice.value.finished && voice.value.mask) {
						handleTouchEnd();
					}
				}
			}
		});
	}
};

const handleTouchMove = (e: TouchEvent) => {
	if (textareaConf.value.disabled) {
		if (voice.value.startY - e.touches[0].pageY > 100) {
			voice.value.cancel = true;
		} else {
			voice.value.cancel = false;
		}
	}
};

const handleTouchEnd = () => {
	if (textareaConf.value.disabled) {
		voice.value.finished = true;
		voice.value.mask = false;
		clearInterval(voice.value.timer);
		voice.value.recordInstance.stop();
		voice.value.recordInstance.onStop((res: any) => {
			const message = {
				voice: res.tempFilePath,
				length: voice.value.length
			};
			if (!voice.value.cancel) {
				if (voice.value.length > 1) {
					sendFile("voice", message);
				} else {
					uni.showToast({
						icon: 'none',
						title: "语音时间太短",
						duration: 1000
					});
				}
			} else {
				voice.value.cancel = false;
			}
		});
	}
};

const sendFile = (type: string, data: any) => {
	if (type == "choose") {
		uni.chooseMedia({
			count: 1,
			mediaType: ['image', 'video'],
			sourceType: ['album'],
			maxDuration: 30,
			success(res) {
				let mediaType = res.tempFiles[0].fileType == 'image' ? 'img' : 'video';
				uploadFile(res.tempFiles[0].tempFilePath, mediaType);
			}
		});
	} else if (type == "shoot") {
		uni.chooseMedia({
			count: 1,
			mediaType: ['image', 'video'],
			sourceType: ['camera'],
			maxDuration: 30,
			success(res) {
				let mediaType = res.tempFiles[0].fileType == 'image' ? 'img' : 'video';
				uploadFile(res.tempFiles[0].tempFilePath, mediaType);
			}
		});
	} else {
		uploadFile(data.voice, 'voice');
	}
};

const uploadFile = (path: string, type: string) => {
	let data = {
		sendUserId: userId.value,
		acceptUserId: toUserId.value,
		type,
		time: 0,
	};

	if (type == 'voice') {
		data = {
			...data,
			time: voice.value.length
		};
	}

	uni.uploadFile({
		url: '接口地址',
		filePath: path,
		name: 'file',
		formData: data,
		header: {
			"token": '' // 可以从 vuex 或其他地方获取 token
		},
		success(res) {
			let newMsg = JSON.parse(res.data);
			msgList.value.push(newMsg.data);
		}
	});
};
</script>



<style lang="scss">
$chatContentbgc: #aaea7a;
$sendBtnbgc: #4F7DF5;

center {
	display: flex;
	align-items: center;
	justify-content: center;
}

/* 聊天消息 */
.chat {

	.topTabbar {
		width: 100%;
		height: 90rpx;
		line-height: 90rpx;
		display: flex;
		margin-top: 80rpx;
		justify-content: space-between;

		.icon {
			margin-left: 20rpx;
		}

		.text {
			margin: auto;
			font-size: 16px;
			font-weight: 700;
		}

		.button {
			width: 10%;
			margin: auto 20rpx auto 0rpx;
		}
	}

	.scroll-view {
		::-webkit-scrollbar {
			display: none;
			width: 0 !important;
			height: 0 !important;
			-webkit-appearance: none;
			background: transparent;
			color: transparent;
			z-index: 0;
		}

		background-color: #ededed;

		.chat-body {
			display: flex;
			flex-direction: column;
			padding-top: 23rpx;



		}

		.msg-time {
			font-size: 24rpx;
			text-align: center;
			color: #737373;
		}
	}

	.chat-bottom {
		width: 100%;
		height: auto;
		background: #F4F5F7;
		transition: all 0.25s ease;

		.send-msg {
			display: flex;
			align-items: flex-end;
			padding: 16rpx 10rpx;
			width: 100%;
			min-height: 150rpx;
			position: fixed;
			bottom: 0;
			background: #f6f6f6;
			transition: all 0.25s ease;

			.uni-textarea {
				width: 100%;
				padding-bottom: 40rpx;
				display: flex;
				align-items: center;

				.icon-font {
					padding: 0 10rpx;
				}


				.out_textarea_box {
					// width: 65%;
					flex: 1;
					min-height: 76rpx;
					max-height: 200rpx;
					border-radius: 4rpx;
					background: #fff;
					display: flex;
					justify-content: center;
					align-items: center;
					margin: 0 10rpx;

					textarea {
						width: 86%;
						min-height: 42rpx;
						max-height: 200rpx;
						background: #fff;
						font-size: 32rpx;
						font-family: PingFang SC;
						color: #333333;
					}
				}
			}
		}
	}

	.more-menu {
		width: 100%;
		min-height: 300rpx;
		margin-top: 150rpx;
		display: none;
		position: fixed;
		bottom: 0rpx;

		.inner-box {
			width: 98%;
			height: 280rpx;
			margin: 10rpx 1%;
			display: flex;

			.menu {
				width: 120rpx;
				height: 130rpx;
				background: #ffffff;
				margin: 20rpx;
				border-radius: 20rpx;
				display: flex;
				align-items: center;
				justify-content: center;

				.i-style {
					width: 80rpx;
					height: 80rpx;
				}

				.t-style {
					font-size: 22rpx;
					font-weight: 600;
					text-align: center;
				}
			}
		}
	}

	.voice-mask {
		position: fixed;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		background-color: rgba(0, 0, 0, 0.8);

		.inner-mask {
			display: flex;
			flex-direction: column;
			align-items: center;

			.voice-progress-box {
				min-width: 250rpx;
				height: 150rpx;
				margin-top: 60%;
				border-radius: 50rpx;
				background: #4df861;
				position: relative;
				@extend center;

				.third-icon {
					width: 0;
					height: 0;
					border: 15rpx solid transparent;
					border-top: 15rpx solid #4df861;
					position: absolute;
					top: 100%;
					left: 45%;
				}

				.progress-num {
					font-size: 50rpx;
					font-weight: 600;
				}
			}

			.cancel-btn {
				width: 120rpx;
				height: 120rpx;
				clip-path: circle();
				margin-top: 50%;
				background: #080808;
				@extend center;
			}

			.cancelBtn {
				width: 150rpx;
				height: 150rpx;

			}

			.show-tips {
				width: 100%;
				margin-top: 80rpx;
				text-align: center;
				color: white;
				animation: 4s opacity2 1s infinite;
				font-size: 30rpx;
				font-weight: 400;
				font-family: sans-serif;
			}

			@keyframes opacity2 {
				0% {
					opacity: 0
				}

				50% {
					opacity: .8;
				}

				100% {
					opacity: 0;
				}
			}

			.bottom-area {
				position: fixed;
				bottom: 0rpx;
				width: 100%;
				height: 190rpx;
				border-top: #BABABB 8rpx solid;
				border-radius: 300rpx 300rpx 0 0;
				background-image: linear-gradient(#949794, #e1e3e1);
				@extend center;

				.img-style {
					width: 50rpx;
					height: 50rpx;
				}
			}
		}
	}
}

view,
button,
text,
input,
textarea {
	margin: 0;
	padding: 0;
	box-sizing: border-box;
}

//去除scroll-view的滑动条
::-webkit-scrollbar {
	display: none;
	width: 0 !important;
	height: 0 !important;
	-webkit-appearance: none;
	background: transparent;
}
</style>