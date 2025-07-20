export default function Home() {
  return (
    <main className="min-h-screen flex flex-col justify-center items-center bg-gray-900 p-6">
      <h1 className="text-4xl font-extrabold text-black-800 text-center mb-4">
        Send money like a message.
      </h1>
      <p className="text-lg text-white-400 max-w-xl text-center mb-6">
        Zyra lets you chat and transfer funds instantly—across borders, with no fees or friction. Built on Stellar for speed, security, and freedom.
      </p>
      <div className="flex gap-4">
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-full font-semibold">
          Get Started
        </button>
        <button className="border-2 border-blue-500 text-blue-500 px-6 py-2 rounded-full font-semibold hover:bg-blue-50">
          Watch Demo
        </button>
      </div>
    </main>
  )
}
