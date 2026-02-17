// Razorpay payment utility
// Handles payment order creation and Razorpay checkout

declare global {
    interface Window {
        Razorpay: any;
    }
}

interface RazorpayOptions {
    key: string;
    amount: number;
    currency: string;
    name: string;
    description: string;
    order_id: string;
    handler: (response: RazorpayResponse) => void;
    prefill?: {
        name?: string;
        email?: string;
        contact?: string;
    };
    theme?: {
        color: string;
    };
    modal?: {
        ondismiss?: () => void;
    };
}

interface RazorpayResponse {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
}

interface CreateOrderResponse {
    success: boolean;
    order: {
        id: string;
        amount: number;
        currency: string;
        key_id: string;
    };
    error?: string;
}

export async function initiateRazorpayPayment(
    amount: number,
    onSuccess: () => void,
    onFailure: (error: string) => void
): Promise<void> {
    try {
        // Get auth token from localStorage
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('Please login to continue');
        }

        // Create order from backend
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://ewallet-eight.vercel.app'}/api/payment/create-order`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ amount })
        });

        const data: CreateOrderResponse = await response.json();

        if (!data.success || !data.order) {
            throw new Error(data.error || 'Failed to create payment order');
        }

        // Initialize Razorpay checkout
        const options: RazorpayOptions = {
            key: data.order.key_id,
            amount: data.order.amount,
            currency: data.order.currency,
            name: 'E-Wallet',
            description: 'Add money to wallet',
            order_id: data.order.id,
            handler: function (response: RazorpayResponse) {
                console.log('Payment successful:', response);
                // Payment successful - webhook will update wallet balance
                onSuccess();
            },
            prefill: {
                name: localStorage.getItem('userName') || '',
                email: localStorage.getItem('userEmail') || '',
            },
            theme: {
                color: '#6366f1'
            },
            modal: {
                ondismiss: function () {
                    onFailure('Payment cancelled');
                }
            }
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();
    } catch (error: any) {
        console.error('Payment initiation error:', error);
        onFailure(error.message || 'Failed to initiate payment');
    }
}
