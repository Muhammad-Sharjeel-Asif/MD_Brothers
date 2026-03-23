/**
 * Courier Service Abstraction
 * This layer handles communication with third-party courier APIs (TCS, Leopards, BlueEx, etc.)
 */

export interface ShipmentDetails {
  orderId: string;
  customerName: string;
  address: string;
  phone: string;
  totalAmount: number;
}

export interface TrackingInfo {
  trackingId: string;
  status: 'processing' | 'in_transit' | 'delivered';
  courier: string;
  lastUpdate: string;
}

const MOCK_TRACKING_DATA: Record<string, TrackingInfo> = {
  'MOCK-123': {
    trackingId: 'MOCK-123',
    status: 'in_transit',
    courier: 'MD Express (Mock)',
    lastUpdate: new Date().toISOString(),
  }
};

export const courierService = {
  /**
   * Create a shipment for an order
   */
  async createShipment(details: ShipmentDetails) {
    console.log('Creating shipment for order:', details.orderId);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Return mock tracking ID
    const trackingId = `MD-${Math.floor(100000 + Math.random() * 900000)}`;
    
    return {
      success: true,
      trackingId,
      courier: 'MD Express (Mock)',
      status: 'shipped'
    };
  },

  /**
   * Track a shipment by its ID
   */
  async trackShipment(trackingId: string): Promise<TrackingInfo | null> {
    console.log('Tracking package:', trackingId);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    return MOCK_TRACKING_DATA[trackingId] || {
      trackingId,
      status: 'processing',
      courier: 'MD Express (Mock)',
      lastUpdate: new Date().toISOString(),
    };
  }
};
