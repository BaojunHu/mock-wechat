export type TVoice = {
  mask: boolean;
  length: number;
  cancel: boolean;
  startX: number;
  startY: number;
  timer: undefined | number;
  recordInstance: any;
  finished: boolean;
  isRecord?: boolean;
};

export interface WxUser {
  nickName: string;
  headImg: string;
}

export type TMessage = {
  id: string;
  sendUserId: string;
  acceptUserId: string;
  type: string;
  content: string;
  sendTime: string;
  wxUser: WxUser;
  isShowTime?: boolean;
  soundTIme?: number;
};
