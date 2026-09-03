// Shiprocket se Bearer Token lene ka function
async function getShiprocketToken() {
  try {
    const response = await fetch("https://apiv2.shiprocket.in/v1/external/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: process.env.SHIPROCKET_EMAIL, // yahan apni email env file se lein
        password: process.env.SHIPROCKET_PASSWORD, // yahan password env file se lein
      }),
    });

    const data = await response.json();
    if (response.ok && data.token) {
      return data.token;
    } else {
      console.error("Shiprocket Auth Error:", data);
      return null;
    }
  } catch (error) {
    console.error("Shiprocket Login Exception:", error);
    return null;
  }
}

// Order ko Shiprocket par create karne ka function
export async function createShiprocketOrder(orderData) {
  const token = await getShiprocketToken();
  if (!token) {
    throw new Error("Failed to authenticate with Shiprocket");
  }

  // Shiprocket ke format ke mutabiq payload tayar karein
  const shiprocketPayload = {
    order_id: orderData.orderId,
    order_date: new Date().toISOString().split("T")[0],
    pickup_location: "Primary", // Aapke Shiprocket dashboard par jo pickup location ka naam ho
    billing_customer_name: orderData.shippingAddress.name,
    billing_last_name: "",
    billing_address: orderData.shippingAddress.street1,
    billing_address_2: orderData.shippingAddress.street2 || "",
    billing_city: orderData.shippingAddress.city,
    billing_pincode: orderData.shippingAddress.pincode,
    billing_state: orderData.shippingAddress.state || "Rajasthan",
    billing_country: "India",
    billing_email: orderData.email,
    billing_phone: orderData.shippingAddress.phone,
    shipping_is_billing: true,
    order_items: orderData.items.map(item => ({
      name: item.title,
      sku: item._id,
      units: item.quantity,
      selling_price: item.offerPrice,
      discount: 0,
    })),
    payment_method: orderData.paymentMethod === "COD" ? "COD" : "Prepaid",
    sub_total: orderData.subtotal,
    length: 10,
    breadth: 10,
    height: 10,
    weight: 0.5, // Product ke hisab se weight (kg mein) adjust kar sakte hain
  };

  const response = await fetch("https://apiv2.shiprocket.in/v1/external/orders/create/adhoc", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(shiprocketPayload),
  });

  const result = await response.json();
  return result;
}