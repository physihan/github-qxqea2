export function getMessageByTalkMode({ messageList, talkMode }) {
  switch (talkMode) {
    case "1":
      return messageList.slice(0, 2).concat(messageList.slice(-2))
    case "1000":
      console.log(messageList)
      return messageList
        .filter(message => message.type === "locked")
        .concat(messageList.slice(-1))
    default:
      return messageList
  }
}
