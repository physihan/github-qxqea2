import { type Accessor, For, Show, createEffect, createMemo } from "solid-js"
import { RootStore, defaultMessage } from "~/store"
import { scrollToBottom } from "~/utils"
import MessageItem from "./MessageItem"
import { defaultInputBoxHeight } from "./InputBox"
import { TransitionGroup } from "solid-transition-group"
import "~/styles/transition.css"
// 在组件中定义备选聊天数据
const presetMessages = [
  {
    title: "继续",
    content: "继续"
  },
  {
    title: "细节",
    content: "继续描述细节"
  },
  // ... 其他备选聊天数据
];
export default function ({
  sendMessage,
  inputBoxHeight
}: {
  sendMessage(value?: string): void
  inputBoxHeight: Accessor<number>
}) {
  const { store } = RootStore
  // 防止重新设置高度时页面跳动
  const paddingBottom = createMemo(
    k =>
      inputBoxHeight() === defaultInputBoxHeight - 1 ? k : inputBoxHeight(),
    defaultInputBoxHeight
  )

  createEffect((prev: number | undefined) => {
    if (prev !== undefined && store.messageList.length > prev) {
      scrollToBottom()
    }
    return store.messageList.length
  })

  createEffect(prev => {
    if (store.currentAssistantMessage) scrollToBottom()
  })

  createEffect(prev => {
    inputBoxHeight()
    if (prev && paddingBottom() !== defaultInputBoxHeight) {
      scrollToBottom()
    }
    return true
  })

  const shownTokens = (token: number) => {
    if (token > 1000) return (token / 1000).toFixed(1) + "k"
    else return token
  }

  return (
    <div
      class="px-1em"
      id="message-container"
      style={{
        "margin-bottom": `calc(6em + ${paddingBottom() + "px"})`
      }}
    >
      <div id="message-container-img" class="px-1em">
        <Show when={!store.messageList.length}>
          <MessageItem hiddenAction={true} message={defaultMessage} />
        </Show>
        <TransitionGroup name="transition-group">
          <For each={store.messageList}>
            {(message, index) => (
              <MessageItem
                message={message}
                hiddenAction={store.loading || message.type === "temporary"}
                index={index()}
                sendMessage={sendMessage}
              />
            )}
          </For>
          <div class="grid grid-cols-2 gap-2">
          <Show when={!store.loading}>
            <div class="mt-4 flex gap-2">

          {presetMessages.map((message, index) => (
            <button
            onClick={() => sendMessage(message.content)}
            class="bg-gray-300 hover:bg-blue-300 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
          {message.title}
        </button>
      ))}
      </div>
        </Show>

    </div>
        </TransitionGroup>
      </div>
      <Show
        when={!store.loading && (store.contextToken || store.inputContentToken)}
      >
        <div class="flex items-center px-1em text-0.8em">
          <hr class="flex-1 border-slate/40" />
          <Show
            when={store.inputContentToken}
            fallback={
              <span class="mx-1 text-slate/40">
                {`有效上下文 Tokens : ${shownTokens(
                  store.contextToken
                )}/$${store.contextToken$.toFixed(4)}`}
              </span>
            }
          >
            <span class="mx-1 text-slate/40">
              {`有效上下文+提问 Tokens : ${shownTokens(
                store.contextToken + store.inputContentToken
              )}(`}
              <span
                classList={{
                  "text-red-500": store.remainingToken < 0
                }}
              >
                {shownTokens(store.remainingToken)}
              </span>
              {`)/$${(store.contextToken$ + store.inputContentToken$).toFixed(
                4
              )}`}
            </span>
          </Show>
          <hr class="flex-1  border-slate/30" />
        </div>
      </Show>
    </div>
  )
}
