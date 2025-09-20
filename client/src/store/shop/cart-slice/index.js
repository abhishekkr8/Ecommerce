import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosInstance } from "@/routes/axiosInstance";

const initialState = {
  cartItems: [],
  isLoading: false,
};

// Helper functions for local storage
const getLocalCart = () => {
  try {
    const localCart = localStorage.getItem('guestCart');
    return localCart ? JSON.parse(localCart) : [];
  } catch (error) {
    return [];
  }
};

const setLocalCart = (cartItems) => {
  try {
    localStorage.setItem('guestCart', JSON.stringify(cartItems));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

const clearLocalCart = () => {
  try {
    localStorage.removeItem('guestCart');
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
};

// Helper function to fetch product details and format cart items
const fetchCartItemsWithDetails = async (localCartItems) => {
  if (localCartItems.length === 0) {
    return [];
  }
  
  const cartItemsWithDetails = await Promise.all(
    localCartItems.map(async (item) => {
      try {
        const productResponse = await AxiosInstance.get(
          `/shop/products/get/${item.productId}`
        );
        
        if (productResponse.data.success) {
          const product = productResponse.data.data;
          return {
            productId: product._id,
            image: product.image,
            title: product.title,
            price: product.price,
            salePrice: product.salePrice,
            quantity: item.quantity
          };
        }
        return null;
      } catch (error) {
        console.error('Error fetching product details:', error);
        return null;
      }
    })
  );
  
  // Filter out null items (failed requests)
  return cartItemsWithDetails.filter(item => item !== null);
};

// Sync local cart with server when user logs in
export const syncCartOnLogin = createAsyncThunk(
  "cart/syncCartOnLogin",
  async ({ userId }) => {
    const localCartItems = getLocalCart();
    
    if (localCartItems.length > 0) {
      // Send local cart items to server
      const response = await AxiosInstance.post("/shop/cart/sync", {
        userId,
        localCartItems
      });
      
      // Clear local storage after sync
      clearLocalCart();
      
      return response.data;
    } else {
      // If no local cart, just fetch server cart
      const response = await AxiosInstance.get(`/shop/cart/get/${userId}`);
      return response.data;
    }
  }
);

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ userId, productId, quantity }) => {
    if (userId) {
      // Authenticated user - save to server
      const response = await AxiosInstance.post(
        "/shop/cart/add",
        {
          userId,
          productId,
          quantity,
        }
      );
      return response.data;
    } else {
      // Non-authenticated user - save to localStorage
      const localCart = getLocalCart();
      const existingItemIndex = localCart.findIndex(item => item.productId === productId);
      
      if (existingItemIndex > -1) {
        localCart[existingItemIndex].quantity += quantity;
      } else {
        localCart.push({ productId, quantity });
      }
      
      setLocalCart(localCart);
      
      // Fetch product details for the cart items
      const cartItemsWithDetails = await fetchCartItemsWithDetails(localCart);
      
      // Return in same format as server response
      return { 
        success: true, 
        data: { items: cartItemsWithDetails }
      };
    }
  }
);

export const fetchCartItems = createAsyncThunk(
  "cart/fetchCartItems",
  async (userId) => {
    if (userId) {
      // Authenticated user - fetch from server
      const response = await AxiosInstance.get(
        `/shop/cart/get/${userId}`
      );
      return response.data;
    } else {
      // Non-authenticated user - fetch from localStorage and get product details
      const localCart = getLocalCart();
      const cartItemsWithDetails = await fetchCartItemsWithDetails(localCart);
      
      return { 
        success: true, 
        data: { items: cartItemsWithDetails }
      };
    }
  }
);

export const deleteCartItem = createAsyncThunk(
  "cart/deleteCartItem",
  async ({ userId, productId }) => {
    if (userId) {
      // Authenticated user - delete from server
      const response = await AxiosInstance.delete(
        `/shop/cart/${userId}/${productId}`
      );
      return response.data;
    } else {
      // Non-authenticated user - delete from localStorage
      const localCart = getLocalCart();
      const updatedCart = localCart.filter(item => item.productId !== productId);
      setLocalCart(updatedCart);
      
      // Fetch product details for remaining items
      const cartItemsWithDetails = await fetchCartItemsWithDetails(updatedCart);
      
      return { 
        success: true, 
        data: { items: cartItemsWithDetails }
      };
    }
  }
);

export const updateCartQuantity = createAsyncThunk(
  "cart/updateCartQuantity",
  async ({ userId, productId, quantity }) => {
    if (userId) {
      // Authenticated user - update on server
      const response = await AxiosInstance.put(
        "/shop/cart/update-cart",
        {
          userId,
          productId,
          quantity,
        }
      );
      return response.data;
    } else {
      // Non-authenticated user - update in localStorage
      const localCart = getLocalCart();
      const itemIndex = localCart.findIndex(item => item.productId === productId);
      
      if (itemIndex > -1) {
        if (quantity > 0) {
          localCart[itemIndex].quantity = quantity;
        } else {
          localCart.splice(itemIndex, 1);
        }
      }
      
      setLocalCart(localCart);
      
      // Fetch product details for updated cart
      const cartItemsWithDetails = await fetchCartItemsWithDetails(localCart);
      
      return { 
        success: true, 
        data: { items: cartItemsWithDetails }
      };
    }
  }
);

const shoppingCartSlice = createSlice({
  name: "shoppingCart",
  initialState,
  reducers: {
    clearCart: (state) => {
      state.cartItems = [];
      clearLocalCart();
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(addToCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload.data;
      })
      .addCase(addToCart.rejected, (state) => {
        state.isLoading = false;
        state.cartItems = [];
      })
      .addCase(fetchCartItems.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCartItems.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload.data;
      })
      .addCase(fetchCartItems.rejected, (state) => {
        state.isLoading = false;
        state.cartItems = [];
      })
      .addCase(updateCartQuantity.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateCartQuantity.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload.data;
      })
      .addCase(updateCartQuantity.rejected, (state) => {
        state.isLoading = false;
        state.cartItems = [];
      })
      .addCase(deleteCartItem.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteCartItem.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload.data;
      })
      .addCase(deleteCartItem.rejected, (state) => {
        state.isLoading = false;
        state.cartItems = [];
      })
      .addCase(syncCartOnLogin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(syncCartOnLogin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload.data;
      })
      .addCase(syncCartOnLogin.rejected, (state) => {
        state.isLoading = false;
        state.cartItems = [];
      });
  },
});

export const { clearCart } = shoppingCartSlice.actions;
export default shoppingCartSlice.reducer;
