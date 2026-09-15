import { MenuItem } from "./types";

export const MENU_ITEMS: MenuItem[] = [
  {
    id: "ngk01",
    name: "Nasi Goreng Kampung Spesial",
    description:
      "Nasi goreng racikan bumbu terasi khas Nusantara yang harum gurih, disajikan dengan telur mata sapi setengah matang, 2 tusuk sate ayam empuk bumbu kacang, kerupuk udang renyah, acar segar, dan taburan bawang goreng renyah.",
    price: 38000,
    originalPrice: 45000,
    image:
      "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800&q=80",
    category: "makanan-utama",
    tag: "Bestseller",
    rating: 4.9,
    reviewCount: 120,
    prepTime: "~15 mnt",
    isPopular: true,
  },
  {
    id: "abmt02",
    name: "Ayam Bakar Madu Taliwang",
    description:
      "Ayam pejantan dipanggang arang berbalut glaze madu pedas aromatik, disajikan dengan lalapan segar dan sambal khas.",
    price: 45000,
    image:
      "https://images.unsplash.com/photo-1598515213692-5f252f9db22f?w=800&q=80",
    category: "makanan-utama",
    tag: "Chef Pick",
    isPopular: true,
  },
  {
    id: "sbks03",
    name: "Soto Betawi Kuah Santan",
    description:
      "Kuah santan susu gurih rempah, potongan daging sapi empuk, tomat, dan emping renyah khas Jakarta.",
    price: 48000,
    image:
      "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=800&q=80",
    category: "makanan-utama",
    tag: "Khas Jakarta",
    isPopular: true,
  },
  {
    id: "ejkm04",
    name: "Es Jeruk Kelapa Muda",
    description:
      "Perasan jeruk peras asli berpadu lembutnya serutan kelapa muda dan es batu segar.",
    price: 22000,
    image:
      "https://images.unsplash.com/photo-1546173159-315724a31696?w=800&q=80",
    category: "minuman",
    tag: "100% Jeruk Murni",
    isPopular: true,
  },
  {
    id: "tcgc05",
    name: "Tahu Cabe Garam Crispy",
    description:
      "Tahu sutra dipotong dadu digoreng garing keemasan, ditaburi tumisan cabai dan bawang garing.",
    price: 20000,
    image:
      "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&q=80",
    category: "camilan",
    tag: "Camilan Renyah",
    isPopular: true,
  },
  {
    id: "eksg06",
    name: "Es Kopi Susu Gula Aren",
    description:
      "Ekstraksi kopi robusta blend nusantara, susu segar creamy dan gula aren asli.",
    price: 24000,
    image:
      "https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=800&q=80",
    category: "minuman",
    tag: "Favorit Kopi",
    isPopular: true,
  },
  {
    id: "ttbp04",
    name: "Tahu Telur Bumbu Petis",
    description:
      "Tahu telur goreng renyah disiram bumbu petis kacang gurih manis, taburan kerupuk dan bawang goreng.",
    price: 22000,
    image:
      "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=800&q=80",
    category: "camilan",
  },
  {
    id: "etmj07",
    name: "Es Teh Manis Jumbo",
    description: "Seduhan teh pilihan disajikan dingin dengan gula secukupnya, porsi jumbo.",
    price: 8000,
    image:
      "https://images.unsplash.com/photo-1499638673689-79a0b5115d87?w=800&q=80",
    category: "minuman",
  },
];

export function getMenuItemById(id: string): MenuItem | undefined {
  return MENU_ITEMS.find((item) => item.id === id);
}
