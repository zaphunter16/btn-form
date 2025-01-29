import { useEffect, useState } from "react";
import {
  getFirestore,
  collection,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [formData, setFormData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortedData, setSortedData] = useState([]);
  const [sortDirection, setSortDirection] = useState("asc");
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  const navigate = useNavigate();
  const db = getFirestore();

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("user"));

    if (!loggedInUser) {
      navigate("/login");
    } else {
      fetchFormData();
    }
  }, []);

  const fetchFormData = async () => {
    const dataCollection = collection(db, "formData");
    const snapshot = await getDocs(dataCollection);
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setFormData(data);
    setSortedData(data);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus data ini?")) {
      await deleteDoc(doc(db, "formData", id));
      fetchFormData();
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    const filteredData = formData.filter(
      (item) =>
        item.rekening.toLowerCase().includes(e.target.value.toLowerCase()) ||
        item.firstName.toLowerCase().includes(e.target.value.toLowerCase()) ||
        item.lastName.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setSortedData(filteredData);
  };

  const handleSort = (field) => {
    const direction = sortDirection === "asc" ? "desc" : "asc";
    const sorted = [...sortedData].sort((a, b) => {
      if (a[field] < b[field]) return direction === "asc" ? -1 : 1;
      if (a[field] > b[field]) return direction === "asc" ? 1 : -1;
      return 0;
    });
    setSortedData(sorted);
    setSortDirection(direction);
    setShowSortDropdown(false); // Tutup dropdown setelah memilih
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const formatDate = (timestamp) => {
    if (timestamp && timestamp.toDate) {
      return timestamp.toDate().toLocaleDateString("id-ID", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }
    return "-";
  };

  const [startDate, setStartDate] = useState(""); // Rentang tanggal awal
  const [endDate, setEndDate] = useState(""); // Rentang tanggal akhir
  const [filterField, setFilterField] = useState("firstName"); // Kolom yang difilter

  const applyFilters = () => {
    let filteredData = [...formData];

    // Filter berdasarkan rentang tanggal
    if (startDate || endDate) {
      filteredData = filteredData.filter((item) => {
        const dateValue = new Date(item.created_at.seconds * 1000); // Ubah Firebase timestamp ke Date
        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate) : null;

        return (!start || dateValue >= start) && (!end || dateValue <= end);
      });
    }

    // Filter berdasarkan kolom tertentu
    if (searchTerm) {
      filteredData = filteredData.filter((item) =>
        item[filterField]?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setSortedData(filteredData);
  };

  useEffect(() => {
    applyFilters();
  }, [startDate, endDate, searchTerm, filterField]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Hitung total halaman
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  // Data yang ditampilkan berdasarkan halaman saat ini
  const paginatedData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Fungsi untuk navigasi ke halaman berikutnya
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Fungsi untuk navigasi ke halaman sebelumnya
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Fungsi untuk berpindah langsung ke halaman tertentu
  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <header className="flex justify-between items-center bg-white shadow-md p-4 rounded-lg">
        <h1 className="text-2xl font-bold text-blue-600">Dashboard</h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 transition"
        >
          Logout
        </button>
      </header>

      <div className="mb-6 flex flex-wrap gap-4 items-center justify-between mt-5">
        {/* Input untuk Rentang Tanggal */}
        <div>
          <label
            htmlFor="startDate"
            className="block text-sm font-medium text-gray-700"
          >
            Dari Tanggal
          </label>
          <input
            type="date"
            id="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="endDate"
            className="block text-sm font-medium text-gray-700"
          >
            Sampai Tanggal
          </label>
          <input
            type="date"
            id="endDate"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Dropdown untuk Filter Berdasarkan Kolom */}
        <div>
          <label
            htmlFor="filterField"
            className="block text-sm font-medium text-gray-700"
          >
            Filter Berdasarkan
          </label>
          <select
            id="filterField"
            value={filterField}
            onChange={(e) => setFilterField(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="firstName">Nama Depan</option>
            <option value="lastName">Nama Belakang</option>
            <option value="rekening">Nomor Rekening</option>
            <option value="tanggalPelunasan">Tanggal Pelunasan</option>
            <option value="tanggalPengambilan">Tanggal Pengambilan</option>
          </select>
        </div>
      </div>

      <main className="mt-6">
        <div className="mb-4">
          <input
            type="text"
            placeholder="Cari berdasarkan nama atau nomor rekening"
            value={searchTerm}
            onChange={handleSearch}
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th
                  className="py-2 px-4 text-left cursor-pointer"
                  onClick={() => handleSort("firstName")}
                >
                  Nama
                </th>
                <th
                  className="py-2 px-4 text-left cursor-pointer"
                  onClick={() => handleSort("rekening")}
                >
                  Rekening
                </th>
                <th className="py-2 px-4 text-left cursor-pointer">Telepon</th>
                <th className="py-2 px-4 text-left cursor-pointer">Email</th>
                <th
                  className="py-2 px-4 text-left cursor-pointer"
                  onClick={() => handleSort("tanggalPelunasan")}
                >
                  Tanggal Pelunasan
                </th>
                <th
                  className="py-2 px-4 text-left cursor-pointer"
                  onClick={() => handleSort("tanggalPengambilan")}
                >
                  Tanggal Pengambilan
                </th>
                <th
                  className="py-2 px-4 text-left cursor-pointer"
                  onClick={() => handleSort("created_at")}
                >
                  Dibuat Pada
                </th>
                <th className="py-2 px-4 text-left">Bukti Pelunasan</th>
                <th className="py-2 px-4 text-left">Foto KTP</th>
                <th className="py-2 px-4 text-left">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((item) => (
                <tr key={item.id} className="hover:bg-gray-100">
                  <td className="py-2 px-4">{`${item.firstName} ${item.lastName}`}</td>
                  <td className="py-2 px-4">{item.rekening}</td>
                  <td className="py-2 px-4">{item.phone}</td>
                  <td className="py-2 px-4">
                   {(() => {
                    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
                    const emailLink = isMobile
                      ? `mailto:${item.email}`
                      : `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(item.email)}`;
                    
                    return (
                      <a href={emailLink} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                        {item.email ?? "Tidak Ada"}
                      </a>
                    );
                   })()}
                  </td>
                  <td className="py-2 px-4">{item.tanggalPelunasan}</td>
                  <td className="py-2 px-4">{item.tanggalPengambilan}</td>
                  <td className="py-2 px-4">{formatDate(item.created_at)}</td>
                  <td className="py-2 px-4">
                    <a
                      href={item.buktiURL}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src={item.buktiURL}
                        alt="Bukti Pelunasan"
                        className="w-20 h-20 object-cover"
                      />
                    </a>
                  </td>
                  <td className="py-2 px-4">
                    <a
                      href={item.ktpURL}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src={item.ktpURL}
                        alt="Foto KTP"
                        className="w-20 h-20 object-cover"
                      />
                    </a>
                  </td>
                  <td className="py-2 px-4">
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 transition"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
              {sortedData.length === 0 && (
                <tr>
                  <td colSpan="8" className="py-4 text-center text-gray-600">
                    Tidak ada data ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Paginasi Data */}
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={prevPage}
              disabled={currentPage === 1}
              className={`px-4 py-2 bg-blue-500 text-white rounded-lg ${
                currentPage === 1
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-blue-600"
              }`}
            >
              Prev
            </button>

            <div className="flex space-x-2">
              {[...Array(totalPages).keys()].map((number) => (
                <button
                  key={number + 1}
                  onClick={() => goToPage(number + 1)}
                  className={`px-3 py-1 rounded-md ${
                    currentPage === number + 1
                      ? "bg-blue-600 text-white"
                      : "bg-gray-300 text-black hover:bg-gray-400"
                  }`}
                >
                  {number + 1}
                </button>
              ))}
            </div>

            <button
              onClick={nextPage}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 bg-blue-500 text-white rounded-lg ${
                currentPage === totalPages
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-blue-600"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
