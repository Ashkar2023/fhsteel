import React, { useState, useEffect, useRef, forwardRef } from "react";
import { baseUrl } from "../../utils/services";

interface Product {
  id: number;
  name: string;
  code: string;
  retailPrice: number;
  wholeSalePrice?: number;
  barcode: string;
  stock: number;
  unitType: "pcs" | "kg";
  description: string;
  batchNumber: string;
  lowStockThreshold: number;
  supplierId: number;
  active: boolean;
  isDeleted: boolean;
}

interface StockEntryProductSearchProps {
  onProductSelect: (product: Product) => void;
  selectedProductId?: string | number;
}

const StockEntryProductSearch = forwardRef<HTMLInputElement, StockEntryProductSearchProps>(
  ({ onProductSelect, selectedProductId }, ref) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
      const fetchProducts = async () => {
        try {
          const response = await fetch(`${baseUrl}/api/products`);
          const data = await response.json();
          if (Array.isArray(data)) {
            setProducts(data.filter(product => !product.isDeleted));
          } else if (Array.isArray(data.products)) {
            setProducts(data.products.filter(product => !product.isDeleted));
          } else {
            console.error("Invalid products format:", data);
            setProducts([]);
          }
        } catch (error) {
          console.error("Error fetching products:", error);
          setProducts([]);
        }
      };
      fetchProducts();
    }, []);

    // Set selected product when selectedProductId changes
    useEffect(() => {
      if (selectedProductId) {
        const product = products.find(p => p.id === Number(selectedProductId));
        if (product) {
          setSelectedProduct(product);
          setSearchTerm(product.name);
        }
      } else {
        setSelectedProduct(null);
        setSearchTerm("");
      }
    }, [selectedProductId, products]);

    useEffect(() => {
      if (searchTerm.trim()) {
        const filtered = products.filter(
          (product) =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (product.barcode && product.barcode.includes(searchTerm)) ||
            (product.code && product.code.toLowerCase().includes(searchTerm.toLowerCase()))
        );
        setFilteredProducts(filtered);
        setIsDropdownOpen(true);
        setSelectedIndex(-1);
      } else {
        setFilteredProducts([]);
        setIsDropdownOpen(false);
      }
    }, [searchTerm, products]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < filteredProducts.length - 1 ? prev + 1 : prev
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
      } else if (e.key === "Enter" && selectedIndex >= 0) {
        e.preventDefault();
        handleSelectProduct(filteredProducts[selectedIndex]);
      } else if (e.key === "Escape") {
        setIsDropdownOpen(false);
        setSelectedIndex(-1);
      }
    };

    const handleSelectProduct = (product: Product) => {
      onProductSelect(product);
      setSelectedProduct(product);
      setSearchTerm(product.name);
      setIsDropdownOpen(false);
      setSelectedIndex(-1);
      inputRef.current?.focus();
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSearchTerm(value);
      if (!value.trim()) {
        setSelectedProduct(null);
        onProductSelect(null);
      }
    };

    return (
      <div className="relative">
        <input
          ref={(node) => {
            if (typeof ref === "function") ref(node);
            else if (ref) (ref as React.MutableRefObject<HTMLInputElement>).current = node;
            inputRef.current = node;
          }}
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Search products by name, barcode, or code"
          className="w-full border rounded-lg px-4 py-2 bg-white text-black focus:ring-2 focus:ring-green-500"
          autoFocus
        />
        {isDropdownOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product, index) => (
                <div
                  key={product.id}
                  className={`px-4 py-3 cursor-pointer hover:bg-green-50 transition-colors duration-150 ${
                    index === selectedIndex ? "bg-green-100" : ""
                  }`}
                  onClick={() => handleSelectProduct(product)}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSelectProduct(product);
                  }}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-900">
                      {product.name}
                    </span>
                    <span className="text-sm text-gray-500">
                      ₹{product.retailPrice.toFixed(2)}
                    </span>
                  </div>
                  <div className="text-xs text-gray-600 mt-1 flex items-center">
                    <div>
                      {product.code && <span className="mr-2">Code: {product.code}</span>}
                      <span className="mr-2">Stock: {product.stock} {product.unitType}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-4 py-3 text-gray-500 text-center text-sm">
                No products found
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
);

export default StockEntryProductSearch; 