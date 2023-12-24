import { createEffect, createSignal, onMount } from "solid-js"
import Modal from "./Modal"
import { RootStore } from "~/store"

const IndexedDBComponent = props => {
  const { store, setStore } = RootStore
  const { isOpen, setIsOpen } = props
  const [data, setData] = createSignal([])
  const [input, setInput] = createSignal("")
  const [selectedValue, setSelectedValue] = createSignal(null)
  const [editingIndex, setEditingIndex] = createSignal(-1) // Index of the item being edited

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

  const handleEdit = index => {
    setEditingIndex(index)
  }

  const handleDelete = index => {
    const updatedData = data().filter((_, i) => i !== index)
    setData(updatedData)
    localStorage.setItem("presets", JSON.stringify(updatedData))
    setEditingIndex(-1)
  }

  const handleSave = index => {
    const updatedData = [...data()]
    if (Array.isArray(updatedData[index])) {
      updatedData[index] = { name: input(), content: updatedData[index] }
    } else {
      updatedData[index].name = input()
    }
    setData(updatedData)
    localStorage.setItem("presets", JSON.stringify(updatedData))
    setEditingIndex(-1) // Reset editing index after saving
  }

  const handleRadioChange = index => {
    setSelectedValue(index)
  }

  return (
    <>
      <Modal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        onOk={() => {
          const target: any = data()[selectedValue() ?? 0]
          if (Array.isArray(target)) {
            setStore("messageList", target)
          } else {
            setStore("messageList", target.content)
          }
        }}
      >
        <ul class="list-disc pl-4 max-h-300px overflow-y-auto">
          {data().map((item, index) => {
            let name
            if (Array.isArray(item)) {
              name = index
            } else {
              name = item.name
            }
            return (
              <li key={index} class="flex items-center justify-between mb-2">
                <label class="flex items-center w-10  flex grow">
                  <input
                    type="radio"
                    class="mr-2"
                    name="selectedItem"
                    value={index}
                    checked={selectedValue() === index}
                    onChange={() => handleRadioChange(index)}
                  />
                  {editingIndex() === index ? (
                    <input
                      type="text"
                      class="border border-gray-300 rounded px-2 w-full py-1 focus:outline-none"
                      value={name}
                      onInput={e => setInput(e.target.value)}
                    />
                  ) : (
                    <span>{name}</span>
                  )}
                </label>
                <div class="w-104px shrink-0">
                  {editingIndex() !== index ? (
                    <button
                      class="mr-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline"
                      onClick={() => handleEdit(index)}
                    >
                      编辑
                    </button>
                  ) : (
                    <button
                      class="mr-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline"
                      onClick={() => handleSave(index)}
                    >
                      保存
                    </button>
                  )}
                  <button
                    class="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline"
                    onDblClick={() => handleDelete(index)}
                  >
                    删除
                  </button>
                </div>
              </li>
            )
          })}
        </ul>
      </Modal>
    </>
  )
}

export default IndexedDBComponent
