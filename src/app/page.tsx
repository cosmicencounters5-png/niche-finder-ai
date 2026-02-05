export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      
      <h1 className="text-4xl font-bold mb-4">
        Find Hidden Niches Instantly
      </h1>

      <p className="text-gray-500 mb-8 max-w-md">
        Paste your startup idea and discover overlooked niche opportunities your competitors miss.
      </p>

      <textarea
        placeholder="Describe your idea..."
        className="w-full max-w-xl p-4 border rounded-lg mb-4"
        rows={5}
      />

      <button className="bg-black text-white px-6 py-3 rounded-lg">
        Find Hidden Niches
      </button>

    </main>
  );
}