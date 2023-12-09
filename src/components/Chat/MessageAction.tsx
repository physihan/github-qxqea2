import { createSignal, Show } from "solid-js"
import type { Role } from "~/types"

export default function MessageAction({
  role,
  edit,
  del,
  copy,
  editRaw,
  reAnswer,
  hackContent
}: {
  role: Role
  edit: () => void
  del: () => void
  copy: () => void
  reAnswer: () => void
  editRaw: () => void
  hackContent: () => void
}) {
  const [copied, setCopied] = createSignal(false)
  return (
    <div class="flex absolute items-center justify-between <sm:bottom--11 <sm:right-0  right-2 text-sm text-slate-7 dark:text-slate group-hover:opacity-100 group-focus:opacity-100 opacity-0 dark:bg-#292B32 bg-#E7EBF0 rounded">
      <Show when={role === "assistant"}>
        <ActionItem
          label="复制"
          onClick={() => {
            setCopied(true)
            copy()
            setTimeout(() => setCopied(false), 1000)
          }}
          icon={copied() ? "i-un:copied" : "i-un:copy"}
        />
      </Show>
      <Show when={role === "user"}>
        <ActionItem label="编辑" onClick={edit} icon={"i-carbon:edit"} />
      </Show>
      <ActionItem label="重新回答" onClick={reAnswer} icon={"i-carbon:reset"} />
      <ActionItem label="删除" onClick={del} icon={"i-carbon:trash-can"} />
      <ActionItem
        label="hack"
        onClick={hackContent}
        icon={"i-carbon:magic-wand"}
      />
      <ActionItem
        label="编辑原文"
        onClick={editRaw}
        icon={"i-ri:edit-2-fill"}
      />
    </div>
  )
}

function ActionItem(props: { onClick: any; icon: string; label?: string }) {
  return (
    <div
      class="flex items-center cursor-pointer p-2 hover:bg-slate/10 rounded text-2em"
      // 不能解构
      onClick={props.onClick}
      attr:tooltip={props.label}
      attr:position="top"
    >
      <button class={props.icon} title={props.label} />
    </div>
  )
}
