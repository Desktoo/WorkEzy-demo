import axios from "axios";

declare global {
  interface Window {
    Razorpay: any;
  }
}

// Load Razorpay script safely
function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;

    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);

    document.body.appendChild(script);
  });
}

export async function initiateRazorpayPayment(
  planId: string
): Promise<boolean> {
  const loaded = await loadRazorpayScript();
  if (!loaded) throw new Error("Razorpay SDK failed to load");

  const { data } = await axios.post("/api/payments/create-order", { planId });

  return new Promise<boolean>((resolve, reject) => {
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_API_KEY,
      amount: data.amount,
      currency: data.currency,
      order_id: data.orderId,
      name: "WorkEzy",
      description: data.plan.name,

      handler: async (response: any) => {
        try {
          const verifyRes = await axios.post("/api/payments/verify", {
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,

            planId: data.plan.id,
            amount: data.amount / 100,
          });

          if (!verifyRes.data.success) {
            reject(new Error("Payment verification failed"));
            return;
          }

          resolve(true); 
        } catch (err) {
          reject(err);
        }
      },

      modal: {
        ondismiss: () => {
          console.log("Checkout closed");
          resolve(false); 
        },
      },
    };

    const razorpay = new window.Razorpay(options);

    razorpay.on("payment.failed", function (response: any) {
      console.error(response.error);
      alert(response.error.description);
      resolve(false); 
    });

    razorpay.open();
  });
}
