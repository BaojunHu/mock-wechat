<template>
    <span :class="[isSvg ? '' : 'iconfont', cls, className]" :style="{ fontSize: size, color }"></span>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';


const typeList = ["add-friends",
    "add",
    "add2",
    "album",
    "arrow",
    "at",
    "back",
    "back2",
    "bellring-off",
    "belling-on",
    "camera",
    "cellphone",
    "clip",
    "close",
    "close2",
    "comment",
    "contacts",
    "copy",
    "delete-on",
    "delete",
    "discover",
    "display",
    "done",
    "done2",
    "download",
    "email",
    "error",
    "eyes-off",
    "eyes-on",
    "folder",
    "group-detail",
    "help",
    "home",
    "imac",
    "info",
    "keyboard",
    "like",
    "link",
    "location",
    "lock",
    "max-window",
    "me",
    "mike",
    "mike2",
    "mobile-contacts",
    "more",
    "more2",
    "mosaic",
    "music-off",
    "music",
    "note",
    "pad",
    "pause",
    "pencil",
    "photo-wall",
    "play",
    "play2",
    "previous",
    "previous",
    "qr-code",
    "refresh",
    "report-problem",
    "search",
    "sending",
    "setting",
    "share",
    "shop",
    "star",
    "sticker",
    "tag",
    "text",
    "time",
    "transfer-text",
    "transfer",
    "transfer2",
    "video-call",
    "voice",
    "volume-down",
    "volume-off",
    "volume-up",]

const props = defineProps<{
    name: string;
    mode?: 'fill' | 'outline'
    size?: string;
    color?: string;
    className?: string;
}>();

// 默认大小为 "24px"（如果未传递 size 属性）
const size = props.size + 'rpx' || '24rpx';

// 默认颜色为 "black"（如果未传递 color 属性）
const color = props.color || '#000';

const isSvg = typeList.includes(props.name)

const cls = isSvg ? `weui-icon-${props.mode === 'fill' ? 'filled' : 'outlined'}-${props.name}` : `icon-${props.name}`
</script>

<style scoped lang="scss">
@font-face {
    font-family: "iconfont";
    /* Project id 1159948 */
    /* Color fonts */
    src:
        url('data:application/x-font-woff2;charset=utf-8;base64,d09GMgABAAAAAAJgAAwAAAAABKAAAAITAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIiojEgZgAEQKgjCCDwE2AiQDFAsSAAQgBYF8ByAbmAPINmSYhQfernwfB7IDMH93zrsuj5HcJWVSu4NqEK3qmTiXbiC7AbYX2IBmWEFF83yssEjACT6+Zls0wbcgALHcXdTm4SG1kSR+OlrqfIjJGkACiUAu2lwjUUgkGogAIoEoAATLjUbDLnHQGnGcCLQ8LecCo3EYMZcG0QDwRDK/GRsfM9ym+Fel2u5sB7Wd7YAAkMj7QDFFPSggHVWpTkdTC0TzPxIo/sGvSsdJBc7nXJn1XkTH4mgAkrHAAg5BkEbZy5ICPzE+0jmb1rPxDPL8eTD8Inj5MryuAJ8k/mAwcPP2kpeQFy9CgefZz54FZl6+3IEHPX6+/ZknFArfeP6sp2x7XSO0nfXCWShS273eybuFn0o+Td/3eG23yxW4kH8n97bvgjGceWQs6wJXTWNdbvf81gOcbN6/bq9aYrIns6c4uM3jmbhb8LGX8sDjs21j/MBt2HNh4NA3NdaAdf66ddFy2/bc5oOnmg/M3bnzYCW7GrOnsqdXlP2EzqmM3xNJnf+j1fbxl3Nl9+Ls3c529UdtByKRA8qTRtKwm0T157gKKJcc/5HdolCmyA52I2xPqkBj2hbJGAqhYxAkQ/YliVoBUtFMIakpJkBGkMvqdZEUc5QFzLCMpcwN563GxxzmsYbFTLGSOqqp5UwHY4z7dENH+6Aq3bDGVcwOMYeVrGJBb/GEtkQ9BaU6V/gTGQA=') format('woff2'),
        url('//at.alicdn.com/t/c/font_1159948_7bqs8hfimjk.woff?t=1719563084910') format('woff'),
        url('//at.alicdn.com/t/c/font_1159948_7bqs8hfimjk.ttf?t=1719563084910') format('truetype');
}

.iconfont {
    font-family: "iconfont" !important;
    font-size: 16px;
    font-style: normal;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}

.icon-voice-left:before {
    content: "\e600";
}

.icon-voice-right:before {
    content: "\e826";
}
</style>