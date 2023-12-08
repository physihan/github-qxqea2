import { TalkMode } from "~/types"

export function getMessageByTalkMode({ messageList, talkMode }) {
  switch (talkMode) {
    case TalkMode.HEAD_TAIL:
      console.log(messageList.slice(0, 2).concat(messageList.slice(-2)))
      return messageList.slice(0, 2).concat(messageList.slice(-2))
    case TalkMode.STANDALONE:
      console.log(messageList)
      return messageList
        .filter(message => message.type === "locked")
        .concat(messageList.slice(-1))
    default:
      return messageList
  }
}
