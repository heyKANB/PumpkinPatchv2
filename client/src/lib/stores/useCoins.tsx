import { create } from 'zustand';

interface CoinState {
  coins: number;
  addCoins: (amount: number) => void;
  spendCoins: (amount: number) => boolean;
  resetCoins: () => void;
  setCoins: (amount: number) => void;
}

export const useCoins = create<CoinState>((set, get) => ({
  coins: 0,

  addCoins: (amount: number) => {
    set(state => ({ coins: state.coins + amount }));
  },

  spendCoins: (amount: number) => {
    const currentCoins = get().coins;
    if (currentCoins >= amount) {
      set(state => ({ coins: state.coins - amount }));
      return true; // Successfully spent
    }
    return false; // Not enough coins
  },

  resetCoins: () => {
    set({ coins: 0 });
  },

  setCoins: (amount: number) => {
    set({ coins: amount });
  }
}));