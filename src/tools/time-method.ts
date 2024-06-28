class TimeMethod {
    constructor() {}

    // 日期格式化
    addZero(data: number | string): string {
        if (parseInt(data as string) < 10) {
            return "0" + String(data);
        }
        return String(data);
    }

    /**
     * 获取当前日期
     */
    getNowTime(): string {
        const myDate = new Date();
        const year = myDate.getFullYear();
        const month = this.addZero(myDate.getMonth() + 1);  // 修正月份
        const day = this.addZero(myDate.getDate());
        const hour = this.addZero(myDate.getHours());
        const minute = this.addZero(myDate.getMinutes());
        const second = this.addZero(myDate.getSeconds());
        return `${year}-${month}-${day}T${hour}:${minute}:${second}`;
    }

    /**
     * 时间戳转时间
     * @param timestamp 时间戳
     * @param type 转换类型
     */
    timestampToTime(timestamp: number, type: "date" | "datetime"): string {
        const date = new Date(timestamp * (String(timestamp).length === 10 ? 1000 : 1));
        const Y = date.getFullYear() + '-';
        const M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        const D = this.addZero(date.getDate()) + ' ';
        const h = this.addZero(date.getHours()) + ':';
        const m = this.addZero(date.getMinutes()) + ':';
        const s = this.addZero(date.getSeconds());
        
        if (type === "date") {
            return Y + M + D.trim();
        } else {
            return Y + M + D + h + m + s;
        }
    }

    /**
     * 时间转时间戳
     * @param time 时间字符串
     */
    timeToTimestamp(time: string): number {
        return new Date(time).getTime();
    }

    /**
     * 日期计算
     * @param startTime 开始时间
     * @param endTime 结束时间
     */
    calculateTime(startTime: string, endTime: string): number {
        return new Date(startTime).getTime() - new Date(endTime).getTime();
    }

    /**
     * 日期转星期
     * @param time 日期字符串
     */
    getDateToWeek(time: string): { weekID: number, weekName: string } {
        const weekArrayList = [
            { weekID: 7, weekName: "星期日" },
            { weekID: 1, weekName: "星期一" },
            { weekID: 2, weekName: "星期二" },
            { weekID: 3, weekName: "星期三" },
            { weekID: 4, weekName: "星期四" },
            { weekID: 5, weekName: "星期五" },
            { weekID: 6, weekName: "星期六" }
        ];
        return weekArrayList[new Date(time).getDay()];
    }

    /**
     * yyyy-MM-dd HH:mm:ss转为 yyyy-MM-ddTHH:mm:ss
     * @param date 日期字符串
     * @param type 类型
     */
    timeFormat(date: string, type: "T" | " "): string {
        if (type === "T")
            return date.replace(" ", "T");
        else
            return date.replace("T", " ");
    }

    /**
     * 定时器
     * @param time 毫秒数
     */
    async timeSleep(time: number): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, time));
    }
}

export default new TimeMethod();
