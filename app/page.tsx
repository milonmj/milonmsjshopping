export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 text-gray-800">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-emerald-600">Milon M&J Shopping</h1>
          <a
            href="https://wa.me/"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-green-600 transition"
          >
            WhatsApp অর্ডার
          </a>
        </div>
      </header>

      <section className="bg-emerald-600 text-white py-12 px-4 text-center">
        <h2 className="text-2xl font-bold mb-2">মিলন এম অ্যান্ড জে শপিং-এ স্বাগতম</h2>
        <p className="text-sm opacity-90">আপনার পছন্দের সেরা লাইফস্টাইল ও ফ্যাশন কালেকশন</p>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-10">
        <h3 className="text-lg font-bold mb-6 text-gray-900 border-b pb-2">আমাদের নতুন প্রোডাক্ট</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-center">
            <div className="w-full h-40 bg-gray-100 rounded-lg mb-3 flex items-center justify-center text-gray-400">
              প্রোডাক্ট ছবি
            </div>
            <h4 className="font-semibold text-sm">থ্রি পিস কালেকশন</h4>
            <p className="text-emerald-600 font-bold text-sm mt-1">৳ ১,৫০০</p>
          </div>
        </div>
      </section>
    </main>
  );
}
