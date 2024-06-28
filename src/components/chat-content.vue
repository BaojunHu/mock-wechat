<template>

    <view>
        <view class="msg-time" v-if="item.isShowTime">
            {{ changeTime(item.sendTime) }}
        </view>
        <view :class="['item', isSelf ? 'self' : 'Ai']">
            <view :class="['msg-menu', isSelf ? 'menu-right' : 'menu-left']"
                :style="{ display: showBoxId == item.id ? 'block' : 'none' }">
                <view class="tr-icon"></view>
                <ChatMsgMenu :msgUserId="item.sendUserId" :msgId="item.id" :content="item.content" :msgSortId="index"
                    :time="item.sendTime" @cancelMsg="cancelMsg" />
            </view>
            <view @longpress="handleLongPress">
                <view class="content-text" v-if="item.type == 'text'">
                    {{ item.content }}
                </view>
                <view class="content-text" v-else-if="item.type == 'voice'">
                    <view style="display: flex;" @click="playSound(item.content)">
                        <text>{{ item.soundTIme }}''</text>
                        <Icon class="ml-10" name="voice-left" size="32" />
                    </view>
                </view>
                <view class="content-img" v-else-if="item.type == 'img'">
                    <img class="img-style" :src="item.content" mode="widthFix" :lazy-load="true" />
                </view>
                <view class="content-video" v-else-if="item.type === 'voide'">
                    <video class="video-style" :src="item.content" />
                </view>
            </view>
            <img class="avatar" :src="item.wxUser.headImg" />
        </view>
    </view>

</template>

<script lang="ts" setup>

import { ref, defineProps, defineEmits } from 'vue';
import ChatMsgMenu from './chat-msg-menu.vue';
import type { TMessage } from '@/type';
import timeMethod from '@/tools/time-method';
import Icon from './icon.vue';

// const emit = defineEmits(['update:showBoxId']);
const emit = defineEmits<{
    (event: 'update:showBoxId', id: string): void;
    // (event: 'cancelMsg', payload: number): void;
}>();

const props = defineProps<{
    item: TMessage;
    userId: string;
    index: number;
    showBoxId: string;
    cancelMsg: (idx: number) => void;
}>();

const isSelf = props.userId === props.item.sendUserId;

const handleLongPress = () => {
    emit('update:showBoxId', props.item.id);
};

const playSound = (url: string) => {
    // imgConf.value.replayChange = imgConf.value.replaing;
    // let music: UniApp.InnerAudioContext | null = uni.createInnerAudioContext();
    // music.src = url;
    // music.play();
    // music.onEnded(() => {
    // 	music = null;
    // 	imgConf.value.replayChange = imgConf.value.replay;
    // });
};


const changeTime = (time: string) => {
    let space =
        (new Date(timeMethod.timeFormat(time, "T")).getTime() -
            new Date(timeMethod.getNowTime().split("T")[0] + "T00:00:00").getTime()) /
        (1000 * 60 * 60 * 24);
    let Time = timeMethod.timeFormat(time, " ").split(" ");
    let week = timeMethod.getDateToWeek(time);
    if (space > 0 && space < 1) {
        return Time[1].slice(0, 5);
    } else if (space > -1 && space < 0) {
        return "昨天 " + Time[1].slice(0, 5);
    } else if (space < -1 && Math.abs(space) < timeMethod.getDateToWeek(timeMethod.getNowTime()).weekID - 1) {
        return week.weekName + " " + Time[1].slice(0, 5);
    } else {
        return Time[0].slice(5, 10) + " " + Time[1].slice(0, 5);
    }
};



</script>

<style scoped lang="scss">
$chatContentbgc: #aaea7a;
$sendBtnbgc: #4F7DF5;



.Ai {
    flex-direction: row-reverse;
}

.item.self {

    .tr-icon {
        right: 15rpx;
    }

    .content-text {
        background-color: $chatContentbgc;
    }

    .content-text::after {
        position: absolute;
        display: inline-block;
        content: '';
        width: 0;
        height: 0;
        left: 100%;
        top: 30rpx;
        border: 12rpx solid transparent;
        border-left: 12rpx solid $chatContentbgc;
    }
}

.item {
    display: flex;
    justify-content: flex-end;
    padding: 23rpx 30rpx;
    position: relative;


    .content-text::after {
        position: absolute;
        display: inline-block;
        content: '';
        width: 0;
        height: 0;
        top: 30rpx;
        right: 100%;
        border: 12rpx solid transparent;
        border-right: 12rpx solid #FFFFFF;
    }

    .content-text {
        background-color: #FFFFFF;
        position: relative;
        max-width: 486rpx;
        border-radius: 8rpx;
        word-wrap: break-word;
        padding: 20rpx 20rpx;
        margin: 0 24rpx;
        border-radius: 5px;
        font-size: 32rpx;
        font-family: PingFang SC;
        font-weight: 500;
        color: #333333;
        line-height: 42rpx;
    }

    .content-img {
        margin: 0 24rpx;
    }

    .content-video {
        margin: 0 24rpx;
    }

    .img-style {
        width: 400rpx;
        height: auto;
        border-radius: 10rpx;
    }

    .video-style {
        width: 400rpx;
        height: 400rpx;
    }

    .avatar {
        display: flex;
        justify-content: center;
        width: 78rpx;
        height: 78rpx;
        background: $sendBtnbgc;
        border-radius: 8rpx;
        overflow: hidden;

        image {
            align-self: center;
        }
    }

    .msg-menu {
        min-width: 100rpx;
        height: 100rpx;
        display: none;
        background: #383838;
        position: absolute;
        border-radius: 10rpx;
        z-index: 100;

        .tr-icon {
            position: absolute;
            top: 100rpx;
            width: 0;
            height: 0;
            border: 15rpx solid transparent;
            border-top: 15rpx solid #383838;
            left: 15rpx;
        }

    }

    .menu-left {
        top: -100rpx;
        left: 120rpx;

    }

    .menu-right {
        top: -100rpx;
        right: 120rpx;
    }

}
</style>