import { Transaksi } from "../services/transaksiService";

interface StrukThermalProps {
  transaksi: Transaksi;
}

const formatRupiah = (amount: number): string => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};

// Component untuk preview struk (opsional, bisa digunakan untuk preview sebelum print)
export default function StrukThermal({ transaksi }: StrukThermalProps) {
  return (
    <div
      style={{
        fontFamily: "'Courier New', monospace",
        fontSize: "12px",
        width: "80mm",
        padding: "10px",
        border: "1px solid #ccc",
        margin: "0 auto",
      }}
    >
      <div
        style={{
          textAlign: "center",
          borderBottom: "1px dashed #000",
          paddingBottom: "10px",
        }}
      >
        <div style={{ fontSize: "16px", fontWeight: "bold" }}>
          TOKO SEHAT KABANJAHE
        </div>
        <div style={{ fontSize: "10px" }}>Jl. Jamin Ginting Gang Singkat Kabanjahe</div>
        <div style={{ fontSize: "10px" }}>Telp: 0812-3456-7890</div>
      </div>

      <div style={{ margin: "10px 0" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "11px",
          }}
        >
          <span>No Nota</span>
          <span style={{ fontWeight: "bold" }}>{transaksi.no_nota}</span>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "11px",
          }}
        >
          <span>Tanggal</span>
          <span>
            {new Date(transaksi.tgl_transaksi).toLocaleDateString("id-ID", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </span>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "11px",
          }}
        >
          <span>Kasir</span>
          <span>{transaksi.kasir?.nama || "-"}</span>
        </div>
      </div>

      <div style={{ borderTop: "1px dashed #000", margin: "10px 0" }}></div>

      <div style={{ margin: "10px 0" }}>
        {transaksi.items?.map((item) => (
          <div key={item.id} style={{ marginBottom: "8px" }}>
            <div style={{ fontSize: "11px", fontWeight: "bold" }}>
              {item.produk?.nama_produk || "-"}
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "10px",
              }}
            >
              <span>
                {item.jumlah} x {formatRupiah(item.produk?.harga || 0)}
              </span>
              <span style={{ fontWeight: "bold" }}>
                {formatRupiah(item.subtotal)}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div style={{ borderTop: "2px solid #000", margin: "10px 0" }}></div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: "14px",
          fontWeight: "bold",
        }}
      >
        <span>TOTAL</span>
        <span>{formatRupiah(transaksi.harga_total)}</span>
      </div>

      <div style={{ borderTop: "1px dashed #000", margin: "10px 0" }}></div>

      <div style={{ textAlign: "center", fontSize: "10px" }}>
        <div style={{ fontWeight: "bold", margin: "10px 0" }}>TERIMA KASIH</div>
        <div>Barang yang sudah dibeli tidak dapat dikembalikan</div>
      </div>
    </div>
  );
}
