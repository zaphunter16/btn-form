import React, { useState, useEffect } from "react";
import {
  collection,
  doc,
  getDoc,
  setDoc,
  query,
  where,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../database/firebase";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { id } from "date-fns/locale";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import "react-image-crop/dist/ReactCrop.css"; // Import CSS untuk react-image-crop
import ReactCrop from "react-image-crop"; // Import react-image-crop
import { FaTrashAlt } from "react-icons/fa"; // Ikon hapus\\

import withReactContent from "sweetalert2-react-content";
import Loader from "./Loader";
import { useNavigate } from "react-router-dom";

const MySwal = withReactContent(Swal);

const Form = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    rekening: "",
    phone: "",
    tanggalPelunasan: "",
    tanggalPengambilan: "",
    sesi: "",
  });
  const [buktiPelunasan, setBuktiPelunasan] = useState(null);
  const [fotoKTP, setFotoKTP] = useState(null);
  const [sesiOptions, setSesiOptions] = useState([]);
  const [agree, setAgree] = useState(false);
  const [allowedDates, setAllowedDates] = useState({ start: null, end: null });
  const [loading, setLoading] = useState(false);
  const [zoomedImage, setZoomedImage] = useState(null); // Untuk modal zoom gambar
  const navigate = useNavigate()


  const handleSweetAlert = () => {
    let isAgreed = false; // Local variable untuk persetujuan

    MySwal.fire({
      title: (
        <div>
          <h2 className="text-lg font-bold">
            Terima Kasih Telah Melengkapi BTN Easy-Doc
          </h2>
          <p className="text-sm text-gray-600">
            Pengambilan Sertifikat & Dokumen Pokok dilakukan H+5 Hari Kerja
            setelah pelunasan.
          </p>
        </div>
      ),
      html: (
        <div className="text-left text-sm">
          <h3 className="font-bold text-gray-700">Persyaratan:</h3>
          <ul className="list-disc pl-5 text-gray-600">
            <li>Bukti Pelunasan Asli</li>
            <li>
              KTP, Kartu Keluarga, Surat Nikah (Asli + Fotocopy masing-masing 1
              lembar)
            </li>
            <li>Materai Rp 10.000,- (2 lembar)</li>
            <li>
              <b>Dokumen Tambahan:</b>
              <ul className="list-disc pl-5 mt-2">
                <li>
                  <b>Pengambilan Dokumen oleh Pihak ke-3 (Bukan Debitur):</b>{" "}
                  Wajib melampirkan ASLI Akta Kuasa Pengambilan Sertifikat
                  berupa AKTA NOTARIIL dari Notaris. Membawa KTP & Kartu
                  Keluarga (Asli+Fotocopy).
                </li>
                <li>
                  <b>Pengambilan Dokumen oleh Ahli Waris:</b>
                  <ul className="list-disc pl-5">
                    <li>
                      KTP Debitur & KTP seluruh ahli waris (Asli+Fotocopy)
                    </li>
                    <li>Kartu Keluarga & Surat Nikah (Asli+Fotocopy)</li>
                    <li>Akta kelahiran seluruh ahli waris (Asli+Fotocopy)</li>
                    <li>Akta Kematian (Asli+Fotocopy)</li>
                    <li>Surat Keterangan Ahli Waris (Asli/Legalisir)</li>
                    <li>
                      Pengambilan dokumen wajib dilakukan oleh seluruh ahli
                      waris, dan apabila salah satu/beberapa ahli waris tidak
                      dapat hadir, maka wajib melampirkan Surat Kuasa
                      bermaterai.
                    </li>
                  </ul>
                </li>
              </ul>
            </li>
          </ul>
          <h3 className="font-bold text-gray-700 mt-4">Biaya Lain:</h3>
          <ul className="list-disc pl-5 text-gray-600">
            <li>Surat Roya Rp 350.000,-</li>
            <li>
              Surat Keterangan Lunas: Rp 150.000 (KPR Non-Subsidi), Rp 100.000,-
              (KPR Subsidi)
            </li>
            <li>
              Biaya Pengambilan dokumen lebih dari 14 hari kalender: Rp
              500.000,-/bulan (KPR Non-Subsidi), Rp 300.000,-/bulan (KPR
              Subsidi)
            </li>
            <li>
              Pengambilan dokumen dengan Akta Notariil dari Notaris: Rp
              500.000,-
            </li>
          </ul>
          <p className="mt-4 text-gray-600">
            Harap simpan persyaratan tersebut. Terima Kasih.
          </p>

          <div className="flex items-start mt-3">
            <input
              type="checkbox"
              id="agree"
              className="mr-2"
              onChange={(e) => (isAgreed = e.target.checked)} // Perbarui variabel lokal
            />
            <label htmlFor="agree" className="text-gray-700">
              Saya setuju dengan persyaratan yang ada.
            </label>
          </div>
        </div>
      ),
      showCloseButton: true,
      showCancelButton: true,
      cancelButtonText: "Unduh PDF Petunjuk",
      confirmButtonText: "Submit",
      reverseButtons: true,
      cancelButtonColor: "#3085d6",
      confirmButtonColor: "#d33",
      didClose: () => setAgree(false), // Reset persetujuan jika modal ditutup tanpa submit
      preConfirm: () => {
        if (!isAgreed) {
          Swal.showValidationMessage("Anda harus menyetujui persyaratan!");
        }
        return isAgreed; // Return status persetujuan
      },
    }).then((result) => {
      if (result.isConfirmed && isAgreed) {
        setAgree(true);
        // Gunakan fungsi arrow untuk memanggil handleSubmit dengan benar
        // handleSubmit(); // Simulasi preventDefault
        setLoading(true);
        submitDataToFirebse();
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // Aksi untuk unduh PDF
        // window.open(
        //   "/img/persetujuan.jpg",
        //   "download"
        // );
        // Aksi untuk unduh file
        const fileUrl = "/img/persetujuan.jpg"; // Ganti dengan path file Anda
        const anchor = document.createElement("a");
        anchor.href = fileUrl;
        anchor.download = "persetujuan.jpg";
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
      }
    });
  };

  const checkDuplicateRekening = async (rekening) => {
    const currentDate = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const q = query(
      collection(db, "formData"),
      where("rekening", "==", rekening)
    );

    const querySnapshot = await getDocs(q);

    for (const docSnapshot of querySnapshot.docs) {
      const data = docSnapshot.data();
      const createdAt = data.created_at?.toDate(); // Ambil `created_at` sebagai timestamp

      if (createdAt && createdAt > oneMonthAgo && createdAt <= currentDate) {
        return true; // Data duplikat ditemukan
      }
    }

    return false; // Tidak ada data duplikat
  };

  useEffect(() => {
    if (formData.tanggalPelunasan) {
      const pelunasanDate = new Date(formData.tanggalPelunasan);
      const startDate = new Date(pelunasanDate);
      startDate.setDate(startDate.getDate() + 7); // H+7
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 7); // H+14
      setAllowedDates({ start: startDate, end: endDate });
      // fetchSesiOptions(startDate.toISOString().split("T")[0]);
    }
  }, [formData.tanggalPelunasan]);

  // useEffect(() => {
  //   if (formData.tanggalPelunasan) {
  //     const pelunasanDate = new Date(formData.tanggalPelunasan);

  //     // Hitung tanggal pengambilan (H+7 sampai H+14)
  //     const startDate = new Date(pelunasanDate);
  //     startDate.setDate(startDate.getDate() + 7); // H+7
  //     const endDate = new Date(startDate);
  //     endDate.setDate(endDate.getDate() + 6); // H+14

  //     setAllowedDates({ start: startDate, end: endDate });

  //     // Format `startDate` ke `yyyy-mm-dd` untuk digunakan di Firestore
  //     const formattedStartDate = startDate.toISOString().split("T")[0];

  //     fetchSesiOptions(formattedStartDate);
  //   }
  // }, [formData.tanggalPelunasan]);

  const handleDateChange = (date) => {
    const pengambilanDate = new Date(date).toISOString().split("T")[0];
    setFormData({
      ...formData,
      tanggalPengambilan: pengambilanDate,
    });

    fetchSesiOptions(pengambilanDate);
  };

  const fetchSesiOptions = async (tanggal) => {
    // Pastikan `tanggal` menggunakan format `yyyy-mm-dd`
    console.log(tanggal);
    if (typeof tanggal !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(tanggal)) {
      console.error("Format tanggal tidak valid:", tanggal);
      return;
    }

    try {
      const sesiDoc = await getDoc(doc(db, "sesi", tanggal));
      const defaultSesi = [
        { sesi: "sesi1", slots: 8 },
        { sesi: "sesi2", slots: 8 },
      ];

      if (sesiDoc.exists()) {
        const sesiData = sesiDoc.data();
        const options = defaultSesi.map((defaultSesiItem) => {
          const { sesi } = defaultSesiItem;
          const usedSlots = sesiData[sesi] || 0; // Ambil jumlah slot yang digunakan
          return {
            sesi,
            slots: defaultSesiItem.slots - usedSlots, // Hitung slot tersisa
          };
        });

        setSesiOptions(options.filter((option) => option.slots > 0)); // Hanya tampilkan sesi dengan slot tersisa
      } else {
        setSesiOptions(defaultSesi); // Jika dokumen tidak ada, gunakan default sesi
      }
    } catch (error) {
      console.error("Error fetching sesi options:", error);
    }
  };

  const handleFileUpload = async (file) => {
    const cloudName = "dhodili3d"; // Ganti dengan Cloud Name Anda
    const uploadPreset = "unsigned_preset"; // Ganti dengan Upload Preset Anda

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      if (data.secure_url) {
        console.log("Uploaded to Cloudinary:", data.secure_url);
        return data.secure_url; // URL gambar yang diunggah
      } else {
        throw new Error("Gagal mengupload gambar");
      }
    } catch (error) {
      console.error("Error uploading to Cloudinary:", error);
      throw error;
    }
  };

  const handleSubmit = async (e = { preventDefault: () => {} }) => {
    e.preventDefault();

    handleSweetAlert();
    return;
  };

  const submitDataToFirebse = async () => {
    try {
      const isDuplicate = await checkDuplicateRekening(formData.rekening);
      if (isDuplicate) {
        setLoading(false);
        Swal.fire({
          icon: "error",
          title: "Nomor Rekening Sudah Terdaftar!",
          text: "Nomor rekening ini telah digunakan dalam 1 bulan terakhir.",
          confirmButtonText: "OK",
        });
        return;
      }

      let buktiURL, ktpURL;
      try {
        buktiURL = await handleFileUpload(buktiPelunasan);
        ktpURL = await handleFileUpload(fotoKTP);
      } catch (error) {
        setLoading(false);
        Swal.fire({
          icon: "error",
          title: "Gagal Mengupload Bukti Pelunasan!",
          text: "Pastikan file yang Anda unggah valid dan koneksi stabil.",
          confirmButtonText: "OK",
        });
        return;
      }

      // Simpan data ke Firestore
      const data = {
        ...formData,
        buktiURL,
        ktpURL,
        created_at: serverTimestamp(),
      };
      await setDoc(doc(db, "formData", new Date().toISOString()), data);

      // Update sesi pengambilan
      const sesiRef = doc(db, "sesi", formData.tanggalPengambilan);
      const sesiDoc = await getDoc(sesiRef);
      if (sesiDoc.exists()) {
        const sesiData = sesiDoc.data();
        sesiData[formData.sesi] = (sesiData[formData.sesi] || 0) + 1;
        await setDoc(sesiRef, sesiData);
      } else {
        await setDoc(sesiRef, { [formData.sesi]: 1 });
      }

      setLoading(false);

      setTimeout(() => {
        Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: "Data Anda berhasil disubmit.",
          confirmButtonText: "OK",
        }).then(() => {
          // Reload halaman setelah SweetAlert ditutup
          // window.location.reload();
          navigate("/")

        });
      }, 1000);
    } catch (error) {
      console.error("Error:", error);
      alert("Terjadi kesalahan saat menyimpan data.");
      Swal.fire({
        icon: "error",
        title: "Gagal Mensubmit Data!",
        text: "Terjadi kesalahan saat menyimpan data.",
        confirmButtonText: "OK",
      });
    }
  };

  // const handleFileChange = (e, setter) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onload = (event) => {
  //       setter({ file, preview: event.target.result }); // Simpan file dan URL preview
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // };

  const handleRemoveImage = (setter) => {
    setter(null);
  };

  const handleImageZoom = (image) => {
    setZoomedImage(image);
  };

  const handleCloseZoom = () => {
    setZoomedImage(null);
  };

  return (
    <>
      {loading && <Loader />}
      <div
        className={`w-[100vw] h-full relative ${loading ? "blur-sm" : ""}`}
        style={{
          backgroundImage: `url('/img/background.png')`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div
          className={`max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg relative   top-10  mb-20 `}
        >
          <div className="text-center mb-8">
            <img
              src="/img/logo.png"
              alt="BTN Logo"
              className="mx-auto mb-4 h-20 w-20"
            />
            <h1 className="text-3xl font-extrabold text-blue-700">
              Formulir BTN Easy-Doc
            </h1>
            <p className="text-gray-700">Bank Tabungan Negara Tbk.</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <motion.div
              className="flex space-x-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="w-1/2">
                <label className="block font-semibold text-gray-700 text-base mb-1">
                  Nama Depan <span className="text-red-500">*</span>
                </label>
                <input
                type="text"
                name="firstName"
                placeholder="Nama Depan"
                className="w-full p-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
                required
              />
                
              </div>

              <div className="w-1/2">
              <label className="block font-semibold text-gray-700 text-base mb-1">
                  Nama Belakang <span className="text-red-500">*</span>
                </label>
                <input
                type="text"
                name="lastName"
                placeholder="Nama Belakang"
                className="w-full p-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
                required
              />
              </div>
              

              
             
            </motion.div>
            {/* Field lainnya */}
            <div>
              <label className="block font-semibold text-gray-700">
                Nomor Rekening Kredit <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="rekening"
                placeholder="Nomor Rekening Kredit"
                className="w-full p-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.rekening}
                onChange={(e) =>
                  setFormData({ ...formData, rekening: e.target.value })
                }
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700">
                Nomor Handphone <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="phone"
                placeholder="Nomor Handphone"
                className="w-full p-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                required
              />
            </div>

            <div className="flex  space-x-4">
              {/* Tanggal Pelunasan */}
              <div className="w-full md:w-1/2 px-2">
                <label className="block font-semibold text-gray-700 text-base mb-1">
                  Tanggal Pelunasan <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="tanggalPelunasan"
                  className="w-full p-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.tanggalPelunasan}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      tanggalPelunasan: e.target.value,
                    })
                  }
                  required
                />
              </div>

              {/* Tanggal Pengambilan */}
              <div className="w-full md:w-1/2 px-2">
                <label className="block font-semibold text-gray-700 text-base mb-1">
                  Tanggal Pengambilan <span className="text-red-500">*</span>
                </label>
                <DatePicker
                  selected={formData.tanggalPengambilan}
                  onChange={(date) => handleDateChange(date)}
                  minDate={allowedDates.start} // H+7 dari tanggal pelunasan
                  maxDate={allowedDates.end} // H+14 dari tanggal pelunasan
                  disabled={!allowedDates.start || !allowedDates.end} // Disable jika tanggal pelunasan belum diisi
                  dateFormat="dd/MM/yyyy"
                  className="w-full p-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholderText="Pilih tanggal pengambilan"
                  wrapperClassName="w-full"
                  locale={id} // Mengatur bahasa DatePicker menjadi Bahasa Indonesia
                />
                <p className="text-xs text-gray-500 mt-2">
                  Pilih tanggal pengambilan antara H+7 dan H+14 dari tanggal
                  pelunasan.
                </p>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-gray-700">
                Sesi Pengambilan <span className="text-red-500">*</span>
              </label>
              <select
                name="sesi"
                className="w-full p-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.sesi}
                onChange={(e) =>
                  setFormData({ ...formData, sesi: e.target.value })
                }
                required
                disabled={sesiOptions.length === 0} // Disable jika tidak ada opsi sesi
              >
                {sesiOptions.length === 0 ? (
                  <option value="">Tidak ada sesi tersedia</option>
                ) : (
                  <>
                    <option value="">Pilih Salah Satu</option>
                    {sesiOptions.map((option) => (
                      <option key={option.sesi} value={option.sesi}>
                        {option.sesi} ({option.slots} jumlah kuota tersedia)
                      </option>
                    ))}
                  </>
                )}
              </select>
              <p className="text-xs text-gray-500 mt-2">
                Sesi 1 (08:00 - 11:00 WIB) , Sesi 2 (12:00 - 15:00 WIB)
              </p>
            </div>

            {/* Upload Bukti Pelunasan */}
            <motion.div
              className="border border-blue-300 p-4 rounded-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <label className="block font-semibold text-blue-700 mb-2">
                Upload Bukti Pelunasan <span className="text-red-500">*</span>
              </label>
              {buktiPelunasan ? (
                <motion.div
                  className="relative cursor-pointer"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  onClick={() =>
                    handleImageZoom(URL.createObjectURL(buktiPelunasan))
                  }
                >
                  <img
                    src={URL.createObjectURL(buktiPelunasan)}
                    alt="Preview Bukti Pelunasan"
                    className="w-full h-40 object-cover rounded-lg"
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    {buktiPelunasan.name}
                  </p>
                  <button
                    className="absolute top-2 right-2 text-red-500 bg-white rounded-full p-1 shadow-md"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveImage(setBuktiPelunasan);
                    }}
                  >
                    <FaTrashAlt />
                  </button>
                </motion.div>
              ) : (
                <input
                  type="file"
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  onChange={(e) => {
                    setBuktiPelunasan(e.target.files[0]);
                  }}
                  required
                />
              )}
            </motion.div>

            {/* Upload Foto KTP */}
            <motion.div
              className="border border-blue-300 p-4 rounded-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <label className="block font-semibold text-blue-700 mb-2">
                Upload Foto KTP Asli <span className="text-red-500">*</span>
              </label>
              {fotoKTP ? (
                <motion.div
                  className="relative cursor-pointer"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  onClick={() => handleImageZoom(URL.createObjectURL(fotoKTP))}
                >
                  <img
                    src={URL.createObjectURL(fotoKTP)}
                    alt="Preview Foto KTP"
                    className="w-full h-40 object-cover rounded-lg"
                  />
                  <p className="text-sm text-gray-500 mt-2">{fotoKTP.name}</p>
                  <button
                    className="absolute top-2 right-2 text-red-500 bg-white rounded-full p-1 shadow-md"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveImage(setFotoKTP);
                    }}
                  >
                    <FaTrashAlt />
                  </button>
                </motion.div>
              ) : (
                <input
                  type="file"
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  onChange={(e) => {
                    setFotoKTP(e.target.files[0]);
                  }}
                  required
                />
              )}
            </motion.div>

            <motion.button
              type="submit"
              className={`w-full p-2 mt-4 text-white font-bold rounded-lg ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-red-500 hover:bg-red-600 transition-all"
              }`}
              disabled={loading}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {loading ? "Memproses..." : "Submit"}
            </motion.button>
          </form>

          {/* Modal Zoom */}
          {zoomedImage && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseZoom}
            >
              <motion.img
                src={zoomedImage}
                alt="Zoomed Image"
                className="max-w-full max-h-full rounded-lg"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
              />
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
};

export default Form;
