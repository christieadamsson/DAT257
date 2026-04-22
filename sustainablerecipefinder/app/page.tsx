export default function Page() {
  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-4xl rounded-2xl bg-white p-8 shadow">
        <h1 className="text-3xl font-bold text-gray-900">Find recipe</h1>
        <p className="mt-2 text-gray-600">
          Write in your ingredients to get recipe suggestions. 
        </p>

        <div className="mt-8 space-y-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Ingredients
            </label>
            <input
              type="text"
              placeholder="For example: tomato, pasta, onion"
              className="w-full rounded-xl border border-gray-300 px-4 py-3"
            />
          </div>

        

          <button className="rounded-xl bg-black px-5 py-3 font-medium text-white">
            Search recipe
          </button>

          <div className="rounded-xl border border-gray-200 p-4">
            This is where the result will be. 
          </div>
        </div>
      </div>
    </main>
  );
}