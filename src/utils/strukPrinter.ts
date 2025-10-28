import { Transaksi } from "../services/transaksiService";

const formatRupiah = (amount: number): string => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};

const generateStrukHTML = (transaksi: Transaksi): string => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Struk Belanja #${transaksi.no_nota}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Courier New', monospace;
      font-size: 12px;
      line-height: 1.4;
      width: 80mm;
      padding: 10px;
      margin: 0 auto;
    }
    
    .text-center {
      text-align: center;
    }
    
    .text-right {
      text-align: right;
    }
    
    .bold {
      font-weight: bold;
    }
    
    .header {
      text-align: center;
      margin-bottom: 10px;
      border-bottom: 1px dashed #000;
      padding-bottom: 10px;
    }
    
    .store-name {
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 5px;
    }
    
    .store-info {
      font-size: 10px;
      margin: 2px 0;
    }
    
    .divider {
      border-top: 1px dashed #000;
      margin: 10px 0;
    }
    
    .divider-double {
      border-top: 2px solid #000;
      margin: 10px 0;
    }
    
    .info-row {
      display: flex;
      justify-content: space-between;
      margin: 3px 0;
      font-size: 11px;
    }
    
    .items-table {
      width: 100%;
      margin: 10px 0;
    }
    
    .item-row {
      margin: 5px 0;
    }
    
    .item-name {
      font-size: 11px;
      margin-bottom: 2px;
    }
    
    .item-detail {
      display: flex;
      justify-content: space-between;
      font-size: 10px;
    }
    
    .total-section {
      margin-top: 10px;
      font-size: 12px;
    }
    
    .total-row {
      display: flex;
      justify-content: space-between;
      margin: 3px 0;
    }
    
    .grand-total {
      font-size: 14px;
      font-weight: bold;
      margin-top: 5px;
      padding-top: 5px;
      border-top: 1px solid #000;
    }
    
    .footer {
      text-align: center;
      margin-top: 15px;
      padding-top: 10px;
      border-top: 1px dashed #000;
      font-size: 10px;
    }
    
    .thank-you {
      font-weight: bold;
      margin: 10px 0;
    }
    
    @media print {
      body {
        width: 80mm;
      }
      
      @page {
        size: 80mm auto;
        margin: 0;
      }
    }
  </style>
</head>
<body>
  <!-- Header Toko -->
  <div class="header">
    <div class="store-name">TOKO SEHAT KABANJAHE</div>
    <div class="store-info">Jl. Contoh No. 123, Kabanjahe</div>
    <div class="store-info">Telp: 0812-3456-7890</div>
  </div>

  <!-- Info Transaksi -->
  <div class="info-row">
    <span>No Nota</span>
    <span class="bold">${transaksi.no_nota}</span>
  </div>
  <div class="info-row">
    <span>Tanggal</span>
    <span>${new Date(transaksi.tgl_transaksi).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })}</span>
  </div>
  <div class="info-row">
    <span>Waktu</span>
    <span>${new Date(transaksi.tgl_transaksi).toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    })}</span>
  </div>
  <div class="info-row">
    <span>Kasir</span>
    <span>${transaksi.kasir?.nama || "-"}</span>
  </div>

  <div class="divider"></div>

  <!-- Items -->
  <div class="items-table">
    ${
      transaksi.items
        ?.map(
          (item) => `
    <div class="item-row">
      <div class="item-name bold">${item.produk?.nama_produk || "-"}</div>
      <div class="item-detail">
        <span>${item.jumlah} x ${formatRupiah(item.produk?.harga || 0)}</span>
        <span class="bold">${formatRupiah(item.subtotal)}</span>
      </div>
    </div>
    `
        )
        .join("") || ""
    }
  </div>

  <div class="divider-double"></div>

  <!-- Total -->
  <div class="total-section">
    <div class="total-row grand-total">
      <span>TOTAL</span>
      <span>${formatRupiah(transaksi.harga_total)}</span>
    </div>
  </div>

  <div class="divider"></div>

  <!-- Footer -->
  <div class="footer">
    <div class="thank-you">TERIMA KASIH</div>
    <div>Barang yang sudah dibeli</div>
    <div>tidak dapat dikembalikan</div>
    <div style="margin-top: 10px;">www.tokosehat.com</div>
  </div>

  <div style="margin-top: 20px; text-align: center; font-size: 10px;">
    Dicetak: ${new Date().toLocaleString("id-ID")}
  </div>
</body>
</html>
  `;
};

/**
 * Print struk thermal printer untuk transaksi
 * @param transaksi - Data transaksi yang akan dicetak
 */
export const printStruk = (transaksi: Transaksi): void => {
  const printWindow = window.open("", "_blank", "width=300,height=600");
  if (!printWindow) {
    alert("Pop-up diblokir! Harap izinkan pop-up untuk mencetak struk.");
    return;
  }

  const strukContent = generateStrukHTML(transaksi);
  printWindow.document.write(strukContent);
  printWindow.document.close();
  printWindow.focus();

  // Auto print setelah load
  printWindow.onload = () => {
    printWindow.print();
    // Auto close setelah print (opsional, uncomment jika perlu)
    // printWindow.onafterprint = () => printWindow.close();
  };
};
