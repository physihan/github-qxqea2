import logo from "/assets/logo.svg?raw"
import ThemeToggle from "./ThemeToggle"
import { RootStore, loadSession } from "~/store"
import { Show, createMemo, createSignal } from "solid-js"
import { useNavigate } from "solid-start"
import Modal from "./Modal"
import IndexedDBComponent from "./IndexModal"

function splitEmoji(text: string) {
  const [icon, title] = text
    .split(
      /^([\u{1F300}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1F1E0}-\u{1F1FF}])\s*(.+)$/u
    )
    .filter(Boolean)
  if (title)
    return {
      icon,
      title
    }
  return {
    icon: undefined,
    title: icon
  }
}

function scrollTo(selector: string, yOffset = 0) {
  const el = document.querySelector(selector) as HTMLElement
  const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset
  window.scrollTo({ top: y, behavior: "smooth" })
}

export default function Header() {
  const { store } = RootStore
  const navigate = useNavigate()
  const iconTitle = createMemo(() => splitEmoji(store.sessionSettings.title))
  const [isOpen, setIsOpen] = createSignal(false)
  const save = () => {
    store.messageList
  }
  const load = () => {}
  return (
    <>
      <div
        id="logo"
        class="pl-1em cursor-pointer inline-block"
        onClick={() => {
          navigate("/", { replace: true })
          loadSession("index")
        }}
      >
        <Show
          when={iconTitle().icon}
          fallback={<div class="w-8em h-8em" innerHTML={logo} />}
        >
          <div class="text-7em h-1em mb-8">{iconTitle().icon}</div>
        </Show>
      </div>
      <header class="px-4 py-2 sticky top-0 z-99 flex justify-between items-center">
        <div
          class="flex items-center text-2xl cursor-pointer"
          onClick={() => {
            scrollTo("main", -48)
          }}
        >
          <Show
            when={iconTitle().title}
            fallback={
              <>
                <span class="text-transparent font-extrabold bg-clip-text bg-gradient-to-r dark:from-yellow-300 from-yellow-600 dark:to-red-700 to-red-700 mr-1">
                  ChatGPT
                </span>
                <span class="ml-1 font-extrabold text-slate-7 dark:text-slate">
                  Vercel
                </span>
                <a
                  class="ml-2 <sm:hidden"
                  href="https://github.com/ourongxing/chatgpt-vercel"
                >
                  <img
                    alt="GitHub forks badge"
                    src="https://img.shields.io/github/stars/ourongxing/chatgpt-vercel?logo=github"
                  />
                </a>
              </>
            }
          >
            <span class="ml-1 font-extrabold text-slate-7 dark:text-slate">
              {iconTitle().title}
            </span>
          </Show>
        </div>
        <p
          onClick={() => {
            setIsOpen(true)
          }}
        >
          加载预设
        </p>
        <p
          onClick={() => {
            try {
              const presets = JSON.parse(
                localStorage.getItem("presets") || "[]"
              )
              const lockedMessage = store.messageList.filter(
                k => k.type === "locked"
              )
              if (lockedMessage.length > 0) {
                presets.push(lockedMessage)
              }
              localStorage.setItem("presets", JSON.stringify(presets))
            } catch {}
          }}
        >
          保存预设
        </p>
        {/* <Modal isOpen={isOpen()}></Modal> */}
        <IndexedDBComponent {...{ isOpen, setIsOpen }} />
        <ThemeToggle />
      </header>
    </>
  )
}
