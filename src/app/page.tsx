"use client";

import SpackForm from "@/components/SpackForm";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-100 text-gray-800">
      <header className="bg-blue-700 text-white py-6 shadow-md">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold">StackSmith</h1>
          <p className="text-sm text-blue-200">
            Build Spack environments with a click.
          </p>
        </div>
      </header>

      <section className="container mx-auto px-4 py-12">
        <SpackForm />
      </section>
      <footer className="text-center text-gray-500 text-sm py-6">
        Made with ❤️ by Jaxz | MIT License
      </footer>
    </main>
  );
}
