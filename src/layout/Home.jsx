import { Link } from "react-router-dom"

export default function Home()
{
    return (
        <div className="bg-blue-50 min-h-screen flex flex-col w-[100vw]">
      {/* Header */}
      <header className="bg-yellow-400 text-white py-4 px-6 md:px-12 shadow-md flex items-center justify-between">
        <div className="flex  ">
          <img className="w-20 h-20" src="/img/logo.png" alt="" /> 
          <h2 className="text-3xl text-blue-600 mt-7 ms-1 font-extrabold"><strong>Easy-Doc</strong></h2>
        </div>
        <Link
          to="/login"
          className="px-4 py-2   bg-blue-600 text-white font-extrabold rounded-lg shadow transition duration-300"
        >
          <strong className="shadow-stone-300">
          Login
          </strong>
        </Link>
      </header>

      {/* Hero Section */}
      <main className="flex-grow flex flex-col items-center justify-center text-center px-4 md:px-12 bg-white">
        <section className="mb-12">
          <h2 className="text-4xl md:text-5xl font-extrabold text-blue-800 mb-6">
            Kemudahan Dokumen Bersama BTN Easy-Doc
          </h2>
          <p className="text-lg text-blue-600 max-w-2xl mx-auto">
            Pelunasan & Pengambilan dokumen lebih mudah, cepat, dan aman bersama 
            <img src="/img/logo.png" className="mx-1 justify-center w-10 h-10 inline-block mt-[-5px]"></img>
          </p>
        </section>


        {/* Call-to-Action Card */}
        <div className="bg-blue-50 shadow-lg rounded-lg overflow-hidden w-full md:w-2/3 lg:w-1/2">
          <div className="p-6">
            <h3 className="text-2xl font-bold text-blue-800 mb-4">
              Ingin Memulai?
            </h3>
            <p className="text-blue-600 mb-6">
              Klik tombol di bawah ini
            </p>
            <Link
              to="/form"
              className="inline-block px-8 py-3 bg-blue-600 text-white font-extrabold rounded-lg shadow hover:bg-blue-500 transition duration-300"
            >
              BTN Easy-Doc
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-blue-600 text-white py-6 mt-0">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
          <p className="text-sm">
            &copy; 2025 BTN Easy-Doc. Semua hak dilindungi undang-undang.
          </p>
          <nav className="flex space-x-4 mt-4 md:mt-0">
            <Link to="#" className="hover:underline">
              Kebijakan Privasi
            </Link>
            <Link to="#" className="hover:underline">
              Syarat & Ketentuan
            </Link>
            <Link to="#" className="hover:underline">
              Hubungi Kami
            </Link>
          </nav>
        </div>
      </footer>
    </div>
    )
}