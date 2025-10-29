# Quick Reference - Dashboard Statistik

## API Endpoints

| Endpoint                    | Method | Parameter                   | Deskripsi                   |
| --------------------------- | ------ | --------------------------- | --------------------------- |
| `/api/statistik/dashboard`  | GET    | -                           | Statistik cards & inventory |
| `/api/statistik/comparison` | GET    | -                           | Data perbandingan penjualan |
| `/api/statistik/tahunan`    | GET    | `tahun` (optional)          | Penjualan per bulan         |
| `/api/statistik/bulanan`    | GET    | `bulan`, `tahun` (optional) | Penjualan per hari          |
| `/api/statistik/mingguan`   | GET    | `tanggal_akhir` (optional)  | Penjualan 7 hari terakhir   |

## Usage Examples

### Menggunakan Custom Hook

```typescript
import { useDashboard } from "../hooks/useDashboard";

function MyComponent() {
  const { dashboardStats, comparisonData, loading, error, refreshDashboard } =
    useDashboard();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>
        Transaksi Hari Ini: {dashboardStats?.cards.hari_ini.total_transaksi}
      </h1>
      <button onClick={refreshDashboard}>Refresh</button>
    </div>
  );
}
```

### Menggunakan Service Langsung

```typescript
import { getDashboardStats } from "../services/dashboardService";

async function fetchData() {
  try {
    const stats = await getDashboardStats();
    console.log(stats.cards.hari_ini.total_transaksi);
  } catch (error) {
    console.error("Error:", error);
  }
}
```

### Menampilkan Chart

```typescript
import { ApexChartComponent } from "../components/ApexChartComponent";

function MyChart({ chartData }) {
  return (
    <ApexChartComponent
      data={chartData}
      type="bar"
      height={300}
      title="Perbandingan Penjualan"
    />
  );
}
```

## Data Format

### Dashboard Stats

```typescript
{
  cards: {
    hari_ini: { total_transaksi: number, total_pendapatan: number },
    minggu_ini: { total_transaksi: number, total_pendapatan: number },
    bulan_ini: { total_transaksi: number, total_pendapatan: number },
    tahun_ini: { total_transaksi: number, total_pendapatan: number }
  },
  inventory: {
    total_produk: string,
    total_kategori: string,
    produk_stok_menipis: string
  }
}
```

### Chart Data

```typescript
{
  labels: string[],
  datasets: [
    {
      label: string,
      data: number[],
      backgroundColor: string | string[],
      borderColor: string | string[],
      borderWidth: number,
      yAxisID?: string,
      tension?: number
    }
  ]
}
```

## Format Currency Helper

```typescript
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
};

// Usage
formatCurrency(500000); // "Rp500.000"
```

## Chart Types

| Type   | Usage           | Best For                       |
| ------ | --------------- | ------------------------------ |
| `bar`  | Comparison data | Perbandingan periode, kategori |
| `line` | Trend over time | Penjualan harian/bulanan       |
| `area` | Cumulative data | Total akumulatif               |

## CSS Classes (Bootstrap)

### Cards Stats

```html
<div class="stats-icon purple">
  <!-- purple, blue, green, red -->
  <i class="iconly-boldShow"></i>
</div>
```

### Grid Layout

```html
<div class="row">
  <div class="col-6 col-lg-3 col-md-6">
    <!-- Card content -->
  </div>
</div>
```

## Icons (Iconly & Bootstrap)

```html
<!-- Iconly -->
<i class="iconly-boldShow"></i>
<i class="iconly-boldProfile"></i>
<i class="iconly-boldAdd-User"></i>
<i class="iconly-boldBookmark"></i>

<!-- Bootstrap Icons -->
<i class="bi bi-person-circle"></i>
<i class="bi bi-box-seam"></i>
<i class="bi bi-grid"></i>
<i class="bi bi-exclamation-triangle"></i>
<i class="bi bi-arrow-clockwise"></i>
```

## Common Tasks

### Refresh Data

```typescript
const { refreshDashboard } = useDashboard();

<button onClick={refreshDashboard}>
  <i className="bi bi-arrow-clockwise"></i> Refresh
</button>;
```

### Show Loading State

```typescript
{
  loading && (
    <div className="spinner-border text-primary" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  );
}
```

### Show Error

```typescript
{
  error && (
    <div className="alert alert-danger">
      <i className="bi bi-exclamation-circle"></i> {error}
    </div>
  );
}
```

### Conditional Rendering

```typescript
{
  dashboardStats && (
    <div>{formatCurrency(dashboardStats.cards.hari_ini.total_pendapatan)}</div>
  );
}
```

## Performance Tips

1. **Parallel Fetching**: Gunakan `Promise.all()` untuk fetch multiple endpoints
2. **Memoization**: Gunakan `useMemo` untuk expensive calculations
3. **Lazy Loading**: Load chart library only when needed
4. **Debounce**: Gunakan debounce untuk refresh button
5. **Cache**: Consider caching data for short period

## Debugging

### Check API Response

```typescript
const data = await getDashboardStats();
console.log("API Response:", data);
```

### Check Chart Data

```typescript
useEffect(() => {
  if (comparisonData) {
    console.log("Chart Data:", comparisonData);
  }
}, [comparisonData]);
```

### Monitor Loading State

```typescript
useEffect(() => {
  console.log("Loading:", loading);
}, [loading]);
```
