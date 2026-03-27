import { Order } from '../types';
import { WEBHOOK_URL } from '../constants';

const ORDERS_STORAGE_KEY = 'kos_order_history';
const orderChannel = new BroadcastChannel('kos_orders');

export const orderService = {
  /**
   * Listen for new orders across tabs
   */
  onNewOrder(callback: (order: Order) => void) {
    const handler = (event: MessageEvent) => {
      if (event.data?.type === 'NEW_ORDER') {
        callback(event.data.order);
      }
    };
    orderChannel.addEventListener('message', handler);
    return () => orderChannel.removeEventListener('message', handler);
  },

  /**
   * Submit order to the configured webhook
   */
  async submitOrder(order: Order): Promise<boolean> {
    try {
      // Don't submit if it's the placeholder webhook
      if (WEBHOOK_URL.includes('your-webhook-id')) {
        console.warn('WEBHOOK_URL is not configured. Skipping submission.');
        return true; 
      }

      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(order),
      });

      return response.ok;
    } catch (error) {
      console.error('Failed to submit order to webhook:', error);
      return false;
    }
  },

  /**
   * Save order to local storage history
   */
  saveOrderToLocal(order: Order): void {
    try {
      const existingOrdersJson = localStorage.getItem(ORDERS_STORAGE_KEY);
      const orders: Order[] = existingOrdersJson ? JSON.parse(existingOrdersJson) : [];
      
      // Add new order at the beginning
      orders.unshift(order);
      
      // Keep only last 20 orders
      const trimmedOrders = orders.slice(0, 20);
      
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(trimmedOrders));
      
      // Broadcast to other tabs (Kitchen, Admin)
      orderChannel.postMessage({ type: 'NEW_ORDER', order });
    } catch (error) {
      console.error('Failed to save order to local storage:', error);
    }
  },

  /**
   * Get local order history
   */
  getOrderHistory(): Order[] {
    try {
      const ordersJson = localStorage.getItem(ORDERS_STORAGE_KEY);
      return ordersJson ? JSON.parse(ordersJson) : [];
    } catch (error) {
      console.error('Failed to retrieve order history:', error);
      return [];
    }
  }
};
