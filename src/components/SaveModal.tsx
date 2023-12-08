import { createSignal } from "solid-js"
import Modal from "./Modal" // Assuming Modal component is in the same directory
import { RootStore } from "~/store"

interface SaveModalProps {
  isOpen: () => boolean
  setIsOpen: (isOpen: boolean) => void
}

const SaveModal = (props: SaveModalProps) => {
  const { isOpen, setIsOpen } = props
  const [name, setName] = createSignal("")
  const { store } = RootStore

  return (
    <Modal
      desdroyOnClose={true}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      onCancel={() => {}}
      onOk={() => {
        console.log("sss")
        try {
          const presets = JSON.parse(localStorage.getItem("presets") || "[]")
          const lockedMessage = store.messageList.filter(
            k => k.type === "locked"
          )
          if (lockedMessage.length > 0) {
            presets.push({ name: name(), content: lockedMessage })
          }
          localStorage.setItem("presets", JSON.stringify(presets))
        } catch (err) {
          console.log(err)
        }
      }}
    >
      <div>
        <label
          class="block mb-2 text-sm font-bold text-gray-700"
          htmlFor="name"
        >
          Name:
        </label>
        <input
          class="w-full border rounded-md py-2 px-3 text-gray-700"
          type="text"
          id="name"
          value={name()}
          onInput={e => setName(e.target.value)}
        />
      </div>
    </Modal>
  )
}

export default SaveModal
