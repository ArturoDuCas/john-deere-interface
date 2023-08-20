import { useState } from "react";

export default function EstablishConnection() {
  const [id, setId] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    console.log(id);
  }
  return (
    <div className="h-screen">
      <header className="bg-green-500 p-4 border-b-2 h-1/6 flex items-center">
        <h1 className="text-2xl text-white">John Deere</h1>
      </header>

      <div className="flex flex-col justify-center items-center bg-white h-5/6 ">
        <div className="w-1/4 bg-gray-50 rounded shadow p-6 flex items-center mb-6">
          <form
            onSubmit={handleSubmit}
          >
            <label className="block text-base mb-1">ID de conexión</label>
            <input
              className="border-2 border-gray-300 rounded p-1 w-full"
              value={id}
              onChange={(e) => setId(e.target.value)}
              type="text"
              placeholder="12345"
            />

            <button
              className="bg-green-500 text-white rounded p-1 mt-4 w-full"
              type="submit"
            >
              Conectar
            </button>
          </form>
        </div>
      </div>
    </div>


  )
}