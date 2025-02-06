import { useState } from "react";
import { FaBars } from "react-icons/fa";
import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaWhatsapp,
  FaExternalLinkAlt,
} from "react-icons/fa";
import { MdEmail, MdPhone, MdLocationOn } from "react-icons/md";

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="bg-white min-h-screen flex flex-col w-[100vw] ">
      {/* Header */}
      <header
        className="relative bg-white  py-2 px-6 md:px-12  flex items-center justify-between"
        style={{ boxShadow: "5px 10px 15px rgba(0,0,0,0.1)", zIndex: "10" }}
      >
        <div className="flex  ">
          <img className="w-20 h-20" src="/img/logo.png" alt="" />
        </div>
        <Link
          to="/login"
          className="hidden md:block px-4 py-2   bg-blue-600 text-white font-extrabold rounded-lg shadow transition duration-300"
        >
          <strong className="shadow-stone-300">Login</strong>
        </Link>

        <div className="text-blue-600 md:hidden ">
          <FaBars className="text-2xl cursor-pointer" onClick={toggleMenu} />
        </div>
      </header>

      <div
        className={` absolute  end-5 ${
          isMenuOpen ? "top-28" : "top-0"
        } rounded bg-blue-600 text-white transition-all duration-500 shadow-2xl shadow-blue-500`}
        style={{ zIndex: "0" }}
      >
        <ul className="w-32 px-5 py-3 text-center ">
          <li>
            <Link to="/login">Login</Link>
          </li>
        </ul>
      </div>

      {/* Hero Section */}
      <main className="flex-grow flex flex-col items-center justify-center text-center px-4 md:px-12 bg-white mt-32">
        <section className="mb-12 mt-3">
          <h2 className="text-4xl md:text-5xl font-extrabold text-blue-800 mb-6">
            BTN Easy-Doc
          </h2>
          <p className="text-lg text-blue-600 max-w-2xl mx-auto">
            Nikmati kemudahan layanan untuk peluanasan dan pengambilan dokumen lebih cepat dan tepat.
            {/* <img
              src="/img/logo.png"
              className="mx-1 justify-center w-10 h-10 inline-block mt-[-5px]"
            ></img> */}
          </p>
        </section>

        {/* Call-to-Action Card */}
        <div className="bg-blue-50 shadow-lg rounded-lg overflow-hidden w-full md:w-2/3 lg:w-1/2">
          <div className="p-6">
            <h3 className="text-2xl font-bold text-blue-800 mb-4">
              Ingin Memulai?
            </h3>
            <p className="text-blue-600 mb-6">Klik tombol di bawah ini</p>
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
      <footer className="bg-blue-600 text-white py-8 px-4 md:px-12 mt-20">
        <div className="container mx-auto">
          {/* Info Bank */}
          <div className="text-center md:text-left">
            <h2 className="text-lg font-bold">BANK BTN KC SIDOARJO</h2>
            <div className="flex flex-col items-center md:items-start gap-2 mt-4">
              <div className="flex items-center">
                <MdLocationOn className="text-xl mr-2" />
                <span>
                  Jl. Ahmad Yani No.15, Rw1, Sidokumpul, Kec. Sidoarjo,
                  Kabupaten Sidoarjo, Jawa Timur 61212{" "}
                </span>
              </div>
              <div className="flex items-center">
                <MdEmail className="text-xl mr-2" />
                <span>
                  <a href="mailto:kc.sidoarjo@btn.co.id">
                    kc.sidoarjo@btn.co.id
                  </a>
                </span>
              </div>
              <div className="flex items-center">
                <MdPhone className="text-xl mr-2" />
                <span>031-8929211</span>
              </div>
            </div>
          </div>

          {/* Ekosistem Digital */}
          {/* <div className="mt-6 text-center md:text-left">
            <h2 className="text-lg font-bold">EKOSISTEM DIGITAL</h2>
            <ul className="mt-4 flex flex-col items-center md:items-start gap-2">
              <li>
                <a href="#" className="flex items-center">
                  BTN Properti <FaExternalLinkAlt className="ml-2" />
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center">
                  Rumah Murah BTN <FaExternalLinkAlt className="ml-2" />
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center">
                  Smart Residence <FaExternalLinkAlt className="ml-2" />
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center">
                  balé by BTN <FaExternalLinkAlt className="ml-2" />
                </a>
              </li>
            </ul>
          </div> */}

          {/* Sosial Media */}
          {/* <div className="mt-6 text-center">
            <h2 className="text-lg font-bold">HUBUNGI KAMI</h2>
            <div className="flex justify-center gap-4 mt-4">
              <a href="#" className="text-white text-2xl">
                <FaFacebookF />
              </a>
              <a href="#" className="text-white text-2xl">
                <FaTwitter />
              </a>
              <a href="#" className="text-white text-2xl">
                <FaInstagram />
              </a>
              <a href="#" className="text-white text-2xl">
                <FaLinkedin />
              </a>
              <a href="#" className="text-white text-2xl">
                <FaWhatsapp />
              </a>
            </div>
          </div> */}

          {/* Copyright */}
          <div className="mt-16 text-center">
            <p>© 2025 Copyright</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
