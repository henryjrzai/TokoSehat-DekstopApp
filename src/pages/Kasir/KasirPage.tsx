import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { searchProduk } from "../../services/produkService";
import { createTransaksi } from "../../services/transaksiService";
import { printStruk } from "../../utils/strukPrinter";
import StrukThermal from "../../components/StrukThermal";
import type { Transaksi } from "../../services/transaksiService";

interface Produk {
  id: number;
  kode_produk: string;
  nama_produk: string;
  harga_jual: number;
  harga: number;
  stok: number;
  kategori_id: number;
  satuan_id: number;
  kategori?: {
    id: number;
    nama_kategori: string;
  };
  satuan?: {
    id: number;
    nama_satuan: string;
  };
}

interface CartItem {
  produk: Produk;
  qty: number;
  subtotal: number;
}

export default function KasirPage() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Produk[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [bayar, setBayar] = useState("");
  const [loading, setLoading] = useState(false);
  const [showStruk, setShowStruk] = useState(false);
  const [transaksiData, setTransaksiData] = useState<Transaksi | null>(null);
  const [showSuccessNotif, setShowSuccessNotif] = useState(false);

  // Format rupiah helper
  const formatRupiah = (amount: number): string => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Calculate total
  const total = cart.reduce((sum, item) => sum + item.subtotal, 0);
  const bayarNum = parseFloat(bayar) || 0;
  const kembalian = bayarNum - total;

  // Search on enter - auto search with debounce
  useEffect(() => {
    const performSearch = async () => {
      if (!searchTerm.trim()) {
        setSearchResults([]);
        return;
      }

      try {
        setLoading(true);
        const response = await searchProduk(searchTerm, 10);
        // Map harga to harga_jual for consistency
        const products = response.data.map((p) => ({
          ...p,
          harga_jual: p.harga,
        }));
        setSearchResults(products);
      } catch (error) {
        console.error("Error searching product:", error);
        setSearchResults([]);
      } finally {
        setLoading(false);
      }
    };

    const delaySearch = setTimeout(() => {
      performSearch();
    }, 300);

    return () => clearTimeout(delaySearch);
  }, [searchTerm]);

  // Add to cart
  const addToCart = (produk: Produk) => {
    const existingItem = cart.find((item) => item.produk.id === produk.id);

    if (existingItem) {
      // Update quantity
      setCart(
        cart.map((item) =>
          item.produk.id === produk.id
            ? {
                ...item,
                qty: item.qty + 1,
                subtotal: (item.qty + 1) * produk.harga_jual,
              }
            : item
        )
      );
    } else {
      // Add new item
      setCart([
        ...cart,
        {
          produk,
          qty: 1,
          subtotal: produk.harga_jual,
        },
      ]);
    }

    // Clear search
    setSearchTerm("");
    setSearchResults([]);
  };

  // Update cart quantity
  const updateQty = (produkId: number, newQty: number) => {
    if (newQty <= 0) {
      removeFromCart(produkId);
      return;
    }

    setCart(
      cart.map((item) =>
        item.produk.id === produkId
          ? {
              ...item,
              qty: newQty,
              subtotal: newQty * item.produk.harga_jual,
            }
          : item
      )
    );
  };

  // Remove from cart
  const removeFromCart = (produkId: number) => {
    setCart(cart.filter((item) => item.produk.id !== produkId));
  };

  // Process payment and create transaction
  const handlePayment = async () => {
    if (cart.length === 0) {
      alert("Keranjang belanja kosong!");
      return;
    }

    if (bayarNum < total) {
      alert("Jumlah bayar kurang dari total!");
      return;
    }

    if (!user) {
      alert("User tidak ditemukan!");
      return;
    }

    try {
      setLoading(true);

      // Prepare transaction data - sesuai dengan API spec
      const transaksiData = {
        kasir_id: user.id,
        dibayar: bayarNum,
        items: cart.map((item) => ({
          produk_id: item.produk.id,
          jumlah: item.qty,
        })),
      };

      // Create transaction
      const response = await createTransaksi(transaksiData);

      console.log("Response dari API:", response);

      if (response.status) {
        console.log("Transaksi sukses, data:", response.data);

        // Show success notification
        setShowSuccessNotif(true);
        setTimeout(() => setShowSuccessNotif(false), 3000);

        // Set transaksi data and show struk modal
        setTransaksiData(response.data);
        setShowStruk(true);

        // Reset form
        setCart([]);
        setBayar("");
        setSearchTerm("");
      } else {
        console.log("Response status = false");
        alert("Transaksi gagal: " + (response.message || "Unknown error"));
      }
    } catch (error: unknown) {
      console.error("Error creating transaction:", error);
      if (error instanceof Error) {
        alert("Error: " + error.message);
      } else {
        alert("Gagal membuat transaksi!");
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle print from modal
  const handlePrintStruk = () => {
    if (transaksiData) {
      printStruk(transaksiData);
      setShowStruk(false);
      setTransaksiData(null);
    }
  };

  // Close modal without print
  const handleCloseStruk = () => {
    setShowStruk(false);
    setTransaksiData(null);
  };

  // Get current date
  const currentDate = new Date().toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });

  return (
    <div style={{ padding: "20px", minHeight: "calc(100vh - 80px)" }}>
      {/* Success Notification */}
      {showSuccessNotif && (
        <div
          className="alert alert-success alert-dismissible fade show"
          role="alert"
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            zIndex: 9999,
            minWidth: "300px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          }}
        >
          <i className="bi bi-check-circle-fill me-2"></i>
          <strong>Transaksi Berhasil!</strong> Struk siap dicetak.
        </div>
      )}

      {/* Modal Struk Thermal */}
      {showStruk && transaksiData && (
        <div
          className="modal fade show"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
          tabIndex={-1}
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="bi bi-receipt me-2"></i>
                  Preview Struk
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseStruk}
                ></button>
              </div>
              <div
                className="modal-body"
                style={{ maxHeight: "70vh", overflowY: "auto" }}
              >
                <StrukThermal transaksi={transaksiData} />
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCloseStruk}
                >
                  Tutup
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handlePrintStruk}
                >
                  <i className="bi bi-printer me-2"></i>
                  Cetak Struk
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <section className="row bg-primary">
        <div className="col-12">
          <div className="card">
            <div
              className="card-header"
              style={{ backgroundColor: "#435ebe", color: "white" }}
            >
              <div className="d-flex align-items-end">
                <div>
                  Selamat Datang, <strong>{user?.nama}</strong> | {currentDate}
                </div>
              </div>
            </div>
            <div className="card-body" style={{ padding: "30px" }}>
              <div className="row g-4">
                {/* Daftar Belanja */}
                <div className="col-md-5">
                  <h5 className="mb-3">Daftar Belanja</h5>
                  <div
                    className="table-responsive"
                    style={{
                      height: "450px",
                      overflowY: "auto",
                      border: "1px solid #dee2e6",
                      borderRadius: "8px",
                    }}
                  >
                    <table className="table table-striped table-sm mb-0">
                      <thead
                        style={{
                          position: "sticky",
                          top: 0,
                          backgroundColor: "#f8f9fa",
                          zIndex: 1,
                        }}
                      >
                        <tr>
                          <th style={{ width: "8%" }}>No</th>
                          <th style={{ width: "42%" }}>Nama Barang</th>
                          <th style={{ width: "18%" }}>Qty</th>
                          <th style={{ width: "25%" }}>Harga</th>
                          <th style={{ width: "7%" }}>Aksi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {cart.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="text-center">
                              Keranjang kosong
                            </td>
                          </tr>
                        ) : (
                          cart.map((item, index) => (
                            <tr key={item.produk.id}>
                              <td>{index + 1}</td>
                              <td>{item.produk.nama_produk}</td>
                              <td>
                                <input
                                  type="number"
                                  className="form-control form-control-sm"
                                  value={item.qty}
                                  min="1"
                                  max={item.produk.stok}
                                  onChange={(e) =>
                                    updateQty(
                                      item.produk.id,
                                      parseInt(e.target.value) || 0
                                    )
                                  }
                                  style={{ width: "60px" }}
                                />
                              </td>
                              <td>{formatRupiah(item.subtotal)}</td>
                              <td>
                                <button
                                  className="btn btn-sm btn-danger"
                                  onClick={() => removeFromCart(item.produk.id)}
                                >
                                  <i className="bi bi-x"></i>
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Input Barang */}
                <div className="col-md-4">
                  <h5 className="mb-3">Input Barang</h5>
                  <div className="mb-3">
                    <label className="form-label fw-bold">Cari Barang</label>
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      placeholder="Ketik kode atau nama produk..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      autoFocus
                      style={{ fontSize: "16px" }}
                    />
                  </div>

                  {/* Search Results */}
                  {loading && (
                    <div className="alert alert-info">
                      <i className="bi bi-search me-2"></i>Mencari produk...
                    </div>
                  )}

                  {searchResults.length > 0 && (
                    <div
                      className="list-group"
                      style={{
                        maxHeight: "400px",
                        overflowY: "auto",
                        border: "1px solid #dee2e6",
                        borderRadius: "8px",
                      }}
                    >
                      {searchResults.map((produk) => (
                        <button
                          key={produk.id}
                          type="button"
                          className="list-group-item list-group-item-action"
                          onClick={() => addToCart(produk)}
                          disabled={produk.stok <= 0}
                          style={{
                            cursor:
                              produk.stok <= 0 ? "not-allowed" : "pointer",
                            opacity: produk.stok <= 0 ? 0.6 : 1,
                          }}
                        >
                          <div className="d-flex justify-content-between">
                            <div>
                              <strong>{produk.nama_produk}</strong>
                              <br />
                              <small className="text-muted">
                                {produk.kode_produk}
                              </small>
                            </div>
                            <div className="text-end">
                              <div>{formatRupiah(produk.harga_jual)}</div>
                              <small
                                className={
                                  produk.stok > 0
                                    ? "text-success"
                                    : "text-danger"
                                }
                              >
                                Stok: {produk.stok}
                              </small>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {searchTerm && !loading && searchResults.length === 0 && (
                    <div className="alert alert-warning">
                      <i className="bi bi-exclamation-triangle me-2"></i>
                      Produk tidak ditemukan
                    </div>
                  )}
                </div>

                {/* Pembayaran */}
                <div className="col-md-3">
                  <h5 className="mb-3">Pembayaran</h5>
                  <div
                    className="card border-0"
                    style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}
                  >
                    <div className="card-body" style={{ padding: "25px" }}>
                      <div
                        className="mb-3 pb-3"
                        style={{ borderBottom: "2px solid #e9ecef" }}
                      >
                        <small className="text-muted">Kasir</small>
                        <div className="fs-5">
                          <strong>{user?.nama}</strong>
                        </div>
                      </div>
                      <div className="mb-3">
                        <label className="form-label fw-bold">Total</label>
                        <input
                          type="text"
                          className="form-control form-control-lg fw-bold"
                          value={formatRupiah(total)}
                          readOnly
                          style={{
                            backgroundColor: "#f8f9fa",
                            fontSize: "20px",
                            color: "#435ebe",
                          }}
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label fw-bold">Bayar</label>
                        <input
                          type="number"
                          className="form-control form-control-lg"
                          placeholder="Masukkan jumlah bayar..."
                          value={bayar}
                          onChange={(e) => setBayar(e.target.value)}
                          style={{ fontSize: "18px" }}
                        />
                      </div>
                      <div className="mb-4">
                        <label className="form-label fw-bold">Kembalian</label>
                        <input
                          type="text"
                          className="form-control form-control-lg fw-bold"
                          value={
                            kembalian >= 0 ? formatRupiah(kembalian) : "Rp 0"
                          }
                          readOnly
                          style={{
                            backgroundColor: "#f8f9fa",
                            fontSize: "20px",
                            color: kembalian >= 0 ? "#198754" : "#6c757d",
                          }}
                        />
                      </div>
                      <button
                        className="btn btn-primary btn-lg w-100"
                        onClick={handlePayment}
                        disabled={
                          loading || cart.length === 0 || bayarNum < total
                        }
                        style={{
                          fontSize: "18px",
                          padding: "12px",
                          fontWeight: "bold",
                        }}
                      >
                        {loading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2"></span>
                            Memproses...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-printer me-2"></i>
                            BAYAR & CETAK
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
