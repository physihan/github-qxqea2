import { createSignal, JSX } from "solid-js"

interface ModalProps {
  isOpen: () => boolean
  setIsOpen: (isOpen: boolean) => void
  onOk?: () => void
  onCancel?: () => void
  children?: JSX.Element
}

const Modal = (props: ModalProps) => {
  const { isOpen, setIsOpen, onOk, onCancel, children } = props

  return (
    <div
      class={`${
        isOpen() ? "block" : "hidden"
      } fixed z-10 inset-0 overflow-y-auto`}
    >
      <div class="flex items-center justify-center min-h-screen">
        <div class="fixed inset-0 bg-black opacity-50" onClick={onCancel}></div>
        <div class="relative bg-white p-8 rounded shadow-lg w-full max-w-lg">
          <div class="mb-4">{children}</div>
          <div class="flex justify-end">
            <button
              class="mr-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              onClick={() => {
                setIsOpen(false)
              }}
            >
              Cancel
            </button>
            <button
              class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              onClick={() => {
                onOk && onOk()
                setIsOpen(false)
              }}
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Modal
