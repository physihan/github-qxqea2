import { createEffect, createSignal } from "solid-js"
import Modal from "./Modal"

const IndexedDBComponent = () => {
  const [isModalOpen, setIsModalOpen] = createSignal(true)
  const [data, setData] = createSignal([])
  const [selectedValue, setSelectedValue] = createSignal(null)

  const fetchIndexedDBData = () => {
    const dbName = "YourDatabaseName"
    const storeName = "YourStoreName"

    const openRequest = window.indexedDB.open(dbName, 1)

    openRequest.onerror = event => {
      console.error("IndexedDB error:", event.target.errorCode)
    }

    openRequest.onsuccess = event => {
      const db = event.target.result
      const transaction = db.transaction(storeName, "readonly")
      const objectStore = transaction.objectStore(storeName)
      const getRequest = objectStore.getAll()

      getRequest.onsuccess = event => {
        const result = event.target.result
        setData(result)
        setIsModalOpen(true) // Open the modal after data fetch
      }

      transaction.oncomplete = () => {
        db.close()
      }
    }
  }

  createEffect(() => {
    if (isModalOpen()) {
      fetchIndexedDBData()
    }
  })

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  const handleSelectChange = event => {
    setSelectedValue(event.target.value)
  }

  return (
    <>
      <Modal
        isOpen={isModalOpen()}
        setIsOpen={setIsModalOpen}
        onClose={handleCloseModal}
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
            <option value={item.id} key={index}>
              {item.name}
            </option>
          ))}
        </select>
      </Modal>
    </>
  )
}

export default IndexedDBComponent
