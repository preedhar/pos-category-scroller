
import { useRef, useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  description?: string;
}

interface CartItem extends Product {
  quantity: number;
}

const categories = [
  "Appetizers",
  "Salads",
  "Non-Alcoholic",
  "Baked Items",
  "Desserts",
  "Wine",
];

const products: Product[] = [
  {
    id: "1",
    name: "Salmon Hotate Mentai Mini Don",
    category: "Appetizers",
    price: 12.99,
    image: "/placeholder.svg",
  },
  {
    id: "2",
    name: "Nachos with Guacamole",
    category: "Appetizers",
    price: 9.99,
    image: "/placeholder.svg",
  },
  {
    id: "17",
    name: "Crispy Calamari",
    category: "Appetizers",
    price: 11.99,
    description: "Served with aioli sauce",
    image: "/placeholder.svg",
  },
  {
    id: "18",
    name: "Bruschetta",
    category: "Appetizers",
    price: 8.99,
    description: "Fresh tomatoes, basil, garlic",
    image: "/placeholder.svg",
  },
  {
    id: "19",
    name: "Spinach Artichoke Dip",
    category: "Appetizers",
    price: 10.99,
    description: "Served with tortilla chips",
    image: "/placeholder.svg",
  },
  {
    id: "3",
    name: "Caesar Salad",
    category: "Salads",
    price: 8.99,
    image: "/placeholder.svg",
  },
  {
    id: "4",
    name: "Chocolate Chip Cookies",
    category: "Desserts",
    price: 9.20,
    description: "Large • Marshmallows, Chocolate chips",
    image: "/placeholder.svg",
  },
  {
    id: "5",
    name: "Greek Salad",
    category: "Salads",
    price: 10.99,
    description: "Fresh • Feta, olives, cucumber",
    image: "/placeholder.svg",
  },
  {
    id: "6",
    name: "Quinoa Bowl",
    category: "Salads",
    price: 11.99,
    description: "Healthy • Avocado, chickpeas",
    image: "/placeholder.svg",
  },
  {
    id: "7",
    name: "Coca Cola",
    category: "Non-Alcoholic",
    price: 2.99,
    description: "500ml",
    image: "/placeholder.svg",
  },
  {
    id: "8",
    name: "Fresh Orange Juice",
    category: "Non-Alcoholic",
    price: 4.99,
    description: "Freshly squeezed • 400ml",
    image: "/placeholder.svg",
  },
  {
    id: "9",
    name: "Iced Tea",
    category: "Non-Alcoholic",
    price: 3.99,
    description: "Peach or Lemon • 500ml",
    image: "/placeholder.svg",
  },
  {
    id: "10",
    name: "Sourdough Bread",
    category: "Baked Items",
    price: 6.99,
    description: "Fresh daily • Whole loaf",
    image: "/placeholder.svg",
  },
  {
    id: "11",
    name: "Croissant",
    category: "Baked Items",
    price: 3.99,
    description: "Butter • Freshly baked",
    image: "/placeholder.svg",
  },
  {
    id: "12",
    name: "Tiramisu",
    category: "Desserts",
    price: 7.99,
    description: "Classic • Coffee-soaked ladyfingers",
    image: "/placeholder.svg",
  },
  {
    id: "13",
    name: "Cheesecake",
    category: "Desserts",
    price: 8.99,
    description: "New York style • Berry compote",
    image: "/placeholder.svg",
  },
  {
    id: "14",
    name: "Chardonnay",
    category: "Wine",
    price: 29.99,
    description: "California • 2019",
    image: "/placeholder.svg",
  },
  {
    id: "15",
    name: "Cabernet Sauvignon",
    category: "Wine",
    price: 34.99,
    description: "Napa Valley • 2018",
    image: "/placeholder.svg",
  },
  {
    id: "16",
    name: "Pinot Noir",
    category: "Wine",
    price: 32.99,
    description: "Oregon • 2020",
    image: "/placeholder.svg",
  }
];

const Index = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>(categories[0]);
  const categoryRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    // Clean up previous observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    // Create new intersection observer
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const category = entry.target.getAttribute("data-category");
            if (category) {
              setActiveCategory(category);
            }
          }
        });
      },
      {
        rootMargin: "-50% 0px",
        threshold: 0,
      }
    );

    // Observe all category sections
    Object.values(categoryRefs.current).forEach((ref) => {
      if (ref) {
        observerRef.current?.observe(ref);
      }
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  const scrollToCategory = (category: string) => {
    setSelectedCategory(category);
    categoryRefs.current[category]?.scrollIntoView({ behavior: "smooth" });
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  const addToCart = (product: Product) => {
    setCart((currentCart) => {
      const existingItem = currentCart.find((item) => item.id === product.id);
      if (existingItem) {
        return currentCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...currentCart, { ...product, quantity: 1 }];
    });
  };

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + tax;

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-48 bg-white shadow-md p-4 flex flex-col gap-2">
        <h2 className="text-xl font-semibold mb-4">Menu</h2>
        {categories.map((category) => (
          <Button
            key={category}
            variant={
              activeCategory === category
                ? "default"
                : "ghost"
            }
            className="justify-start"
            onClick={() => scrollToCategory(category)}
          >
            {category}
          </Button>
        ))}
      </div>

      <div className="flex-1 p-6 overflow-hidden flex flex-col">
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search"
            className="w-full pl-10 bg-gray-50"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <ScrollArea className="flex-1">
          <div className="space-y-8">
            {categories.map((category) => (
              <div
                key={category}
                ref={(el) => (categoryRefs.current[category] = el)}
                data-category={category}
                className="space-y-4"
              >
                <h2 className="text-2xl font-semibold">{category}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filteredProducts
                    .filter((product) => product.category === category)
                    .map((product) => (
                      <Card
                        key={product.id}
                        className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                        onClick={() => addToCart(product)}
                      >
                        <div className="aspect-video relative">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <div className="p-4">
                          <h3 className="font-medium">{product.name}</h3>
                          <p className="text-sm text-gray-500 mt-1">
                            {product.description}
                          </p>
                          <p className="mt-2 font-semibold">
                            ${product.price.toFixed(2)}
                          </p>
                        </div>
                      </Card>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      <div className="w-80 bg-white shadow-md p-4 flex flex-col">
        <h2 className="text-xl font-semibold mb-4">New order</h2>
        <div className="mb-4">
          <Input
            type="text"
            placeholder="Add order notes"
            className="w-full bg-gray-50"
          />
        </div>
        
        <ScrollArea className="flex-1">
          <div className="space-y-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex items-start justify-between gap-4"
              >
                <div className="flex-1">
                  <div className="flex items-baseline gap-2">
                    <span>{item.quantity}x</span>
                    <span className="font-medium">{item.name}</span>
                  </div>
                  {item.description && (
                    <p className="text-sm text-gray-500 mt-1">
                      {item.description}
                    </p>
                  )}
                </div>
                <span className="font-medium">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="mt-6 space-y-2 pt-4 border-t">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal ({cart.length} items)</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Tax (10%)</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-semibold pt-2">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>

        <div className="mt-6 flex gap-4">
          <Button variant="outline" className="flex-1">
            Save
          </Button>
          <Button className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-black">
            Pay
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
