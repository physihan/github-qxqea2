export function getMessageByTalkMode({ messageList, talkMode }) {
  switch (talkMode) {
    case "1":
      return messageList.slice(0, 2).concat(messageList.slice(-2))
    default:
      return messageList
  }
}
