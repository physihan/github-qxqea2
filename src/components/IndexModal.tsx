import { createEffect, createSignal, onMount } from "solid-js"
import Modal from "./Modal"
import { RootStore } from "~/store"

const IndexedDBComponent = props => {
  // const [isModalOpen, setIsModalOpen] = createSignal(true)
  const { store, setStore } = RootStore
  const { isOpen, setIsOpen } = props
  const [data, setData] = createSignal([])
  const [selectedValue, setSelectedValue] = createSignal(null)

  const fetchLocalData = () => {
    try {
      const presets = JSON.parse(localStorage.getItem("presets") || "[]")
      setData(presets)
    } catch {
      setData([])
    }
  }

  onMount(() => {
    fetchLocalData()
  })
  createEffect(() => {
    if (isOpen()) {
      fetchLocalData()
    }
  })
  const handleCloseModal = () => {}

  const handleSelectChange = event => {
    setSelectedValue(event.target.value)
  }

  return (
    <>
      <Modal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        onOk={() => {
          setStore("messageList", data()[selectedValue() ?? 0])
          setIsOpen(false)
        }}
      >
        <select
          class="block appearance-none border border-gray-300 rounded px-4 py-2 w-full mb-4 focus:outline-none"
          value={selectedValue()}
          onChange={handleSelectChange}
        >
          <option value="" disabled selected>
            Select an item
          </option>
          {data().map((item, index) => (
            <option value={index} key={index}>
              {index}
            </option>
          ))}
        </select>
      </Modal>
    </>
  )
}

export default IndexedDBComponent
