import { useCallback, useState } from 'react';

export interface CartLine {
  id: string;
  name: string;
  price: number;
  qty: number;
}

export function useCart() {
  const [lines, setLines] = useState<CartLine[]>([]);

  const add = useCallback((item: Omit<CartLine, 'qty'>, qty = 1) => {
    setLines(prev => {
      const existing = prev.find(l => l.id === item.id);
      if (existing) {
        return prev.map(l => (l.id === item.id ? { ...l, qty: l.qty + qty } : l));
      }
      return [...prev, { ...item, qty }];
    });
  }, []);

  const remove = useCallback((id: string) => {
    setLines(prev => prev.filter(l => l.id !== id));
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const count = lines.reduce((n, l) => n + l.qty, 0);
  const subtotal = lines.reduce((n, l) => n + l.price * l.qty, 0);

  return { lines, add, remove, clear, count, subtotal };
}