import axiosInstance from "../config/axios";

// Interface untuk contoh data produk
export interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  description?: string;
}

// Contoh service untuk mengambil list produk
// Token akan otomatis ditambahkan oleh axios interceptor
export const getProducts = async (): Promise<Product[]> => {
  try {
    const response = await axiosInstance.get<Product[]>("/products");
    return response.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message || "Gagal mengambil data produk");
    }
    throw new Error("Terjadi kesalahan");
  }
};

// Contoh service untuk mengambil detail produk
export const getProductById = async (id: number): Promise<Product> => {
  try {
    const response = await axiosInstance.get<Product>(`/products/${id}`);
    return response.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message || "Gagal mengambil detail produk");
    }
    throw new Error("Terjadi kesalahan");
  }
};

// Contoh service untuk membuat produk baru
export const createProduct = async (
  product: Omit<Product, "id">
): Promise<Product> => {
  try {
    const response = await axiosInstance.post<Product>("/products", product);
    return response.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message || "Gagal membuat produk");
    }
    throw new Error("Terjadi kesalahan");
  }
};

// Contoh service untuk update produk
export const updateProduct = async (
  id: number,
  product: Partial<Product>
): Promise<Product> => {
  try {
    const response = await axiosInstance.put<Product>(
      `/products/${id}`,
      product
    );
    return response.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message || "Gagal mengupdate produk");
    }
    throw new Error("Terjadi kesalahan");
  }
};

// Contoh service untuk delete produk
export const deleteProduct = async (id: number): Promise<void> => {
  try {
    await axiosInstance.delete(`/products/${id}`);
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message || "Gagal menghapus produk");
    }
    throw new Error("Terjadi kesalahan");
  }
};
