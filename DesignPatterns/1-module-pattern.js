/**
 * MODULE PATTERN
 * Real-World Example: Shopping Cart (like Amazon)
 * 
 * WHEN TO USE:
 * - Need to create private variables/methods
 * - Want to avoid global namespace pollution
 * - Building libraries or utilities
 * - Creating encapsulated functionality
 * 
 * WHY TO USE:
 * - Encapsulation: Keeps internal state private
 * - Namespace management: Prevents variable conflicts
 * - Clean API: Exposes only necessary methods
 * - Memory efficiency: Single instance with shared methods
 */

// Like Amazon's shopping cart - private data, public methods
const ShoppingCart = (() => {
  let items = [];
  let total = 0;
  
  return {
    addItem: (product, price) => {
      items.push({ product, price });
      total += price;
      console.log(`Added ${product} ($${price}) to cart`);
    },
    
    removeItem: (product) => {
      const index = items.findIndex(item => item.product === product);
      if (index > -1) {
        total -= items[index].price;
        const removed = items.splice(index, 1)[0];
        console.log(`Removed ${removed.product} from cart`);
      }
    },
    
    getTotal: () => total,
    
    getItemCount: () => items.length,
    
    getItems: () => [...items], // Return copy to prevent direct modification
    
    clearCart: () => {
      items = [];
      total = 0;
      console.log('Cart cleared');
    }
  };
})();

// Usage Examples
console.log('=== MODULE PATTERN DEMO ===');

// Cart data is private, can't be directly accessed
ShoppingCart.addItem('iPhone', 999);
ShoppingCart.addItem('Case', 29);
ShoppingCart.addItem('Charger', 39);

console.log('Total:', ShoppingCart.getTotal()); // 1067
console.log('Items:', ShoppingCart.getItemCount()); // 3

ShoppingCart.removeItem('Case');
console.log('Total after removal:', ShoppingCart.getTotal()); // 1038

// Try to access private variables (won't work)
console.log('Direct access to items:', ShoppingCart.items); // undefined
console.log('Direct access to total:', ShoppingCart.total); // undefined

// Get items safely
console.log('Cart items:', ShoppingCart.getItems());

ShoppingCart.clearCart();
console.log('Final total:', ShoppingCart.getTotal()); // 0