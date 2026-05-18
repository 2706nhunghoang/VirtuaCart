const productNames = [
  'Essential Cotton Tee',
  'Urban Runner Sneakers',
  'Classic Denim Jacket',
  'Minimal Backpack',
  'Performance Hoodie',
  'Everyday Chino Pants',
  'Canvas Tote Bag',
  'Wireless Desk Lamp',
]

const categories = ['Fashion', 'Accessories', 'Home', 'Sports', 'Tech']

export const createRandomProduct = (_, index) => {
  const productNumber = index + 1
  const name = productNames[index % productNames.length]
  const category = categories[index % categories.length]

  return {
    id: `product-${productNumber}`,
    name: `${name} ${productNumber}`,
    description: `High-quality ${category.toLowerCase()} item for daily use.`,
    price: 10 + ((index * 17) % 990),
    category,
    image: `https://picsum.photos/seed/optishop-${productNumber}/400/400`,
    rating: (index % 5) + 1,
    stock: (index * 7) % 101, // stock 0-100
  }
}

export const products = Array.from({ length: 1000 }, createRandomProduct)
