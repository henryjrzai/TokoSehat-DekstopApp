import { useState, useEffect } from "react";
import { getProducts } from "../services/productService";
import type { Product } from "../services/productService";

/**
 * Contoh komponen yang menggunakan axios untuk fetch data
 * Bearer token akan otomatis ditambahkan oleh axios interceptor
 */
export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      // Axios interceptor otomatis menambahkan Bearer token
      const data = await getProducts();
      setProducts(data);

      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError(err instanceof Error ? err.message : "Gagal memuat data");
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        {error}
        <button
          className="btn btn-sm btn-outline-danger ms-3"
          onClick={fetchProducts}
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  return (
    <div>
      <h3>Daftar Produk</h3>
      <p className="text-muted">
        Contoh penggunaan axios dengan bearer token otomatis
      </p>

      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nama Produk</th>
              <th>Harga</th>
              <th>Stok</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center">
                  Tidak ada data
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id}>
                  <td>{product.id}</td>
                  <td>{product.name}</td>
                  <td>Rp {product.price.toLocaleString("id-ID")}</td>
                  <td>{product.stock}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
