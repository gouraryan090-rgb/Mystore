
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PaymentSelectionPage() {
  const router = useRouter();
  const [checkoutData, setCheckoutData] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("checkout_data");
    if (saved) {
      setCheckoutData(JSON.parse(saved));
    } else {
      router.push("/checkout");
    }
  }, [router]);

  if (!checkoutData) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily:
            "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          background: "#f8fafc",
          color: "#64748b",
          fontSize: "14px",
          fontWeight: "500",
        }}
      >
        Loading payment details...
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "48px 16px",
        fontFamily:
          "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        maxWidth: "520px",
        margin: "0 auto",
        background:
          "radial-gradient(circle at 50% -10%, rgba(79,70,229,0.08), transparent 40%)",
        color: "#0f172a",
      }}
    >
      {/* TOP HEADER */}
      <div
        style={{
          textAlign: "center",
          marginBottom: "30px",
        }}
      >
        <div
          style={{
            width: "48px",
            height: "48px",
            margin: "0 auto 15px",
            borderRadius: "14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background:
              "linear-gradient(135deg, #111827 0%, #374151 100%)",
            color: "#fff",
            fontSize: "21px",
            fontWeight: "800",
            boxShadow: "0 10px 25px rgba(15,23,42,0.15)",
          }}
        >
          ₹
        </div>

        <h1
          style={{
            margin: "0 0 7px",
            fontSize: "24px",
            lineHeight: "1.25",
            fontWeight: "800",
            letterSpacing: "-0.6px",
            color: "#0f172a",
          }}
        >
          Select Payment Gateway
        </h1>

        <p
          style={{
            margin: "0",
            fontSize: "13px",
            color: "#64748b",
            lineHeight: "1.6",
          }}
        >
          Choose your preferred secure payment method
        </p>
      </div>

      {/* AMOUNT CARD */}
      <div
        style={{
          background:
            "linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)",
          border: "1px solid #e2e8f0",
          borderRadius: "16px",
          padding: "17px 18px",
          marginBottom: "18px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: "0 5px 18px rgba(15,23,42,0.04)",
        }}
      >
        <div>
          <div
            style={{
              fontSize: "10px",
              fontWeight: "800",
              color: "#94a3b8",
              textTransform: "uppercase",
              letterSpacing: "0.8px",
              marginBottom: "4px",
            }}
          >
            Total Amount
          </div>

          <div
            style={{
              fontSize: "12px",
              color: "#64748b",
            }}
          >
            Amount payable
          </div>
        </div>

        <div
          style={{
            fontSize: "22px",
            fontWeight: "800",
            letterSpacing: "-0.6px",
            color: "#0f172a",
          }}
        >
          ₹{checkoutData.totalBill}
        </div>
      </div>

      {/* PAYMENT OPTIONS */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "13px",
          marginBottom: "18px",
        }}
      >
        {/* CASHFREE */}
        <div
          onClick={() => router.push("/checkout/payment/cashfree")}
          style={{
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            padding: "19px",
            borderRadius: "17px",
            cursor: "pointer",
            boxShadow: "0 5px 18px rgba(15,23,42,0.045)",
            transition:
              "transform .2s ease, box-shadow .2s ease, border-color .2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.borderColor = "#c7d2fe";
            e.currentTarget.style.boxShadow =
              "0 14px 32px rgba(79,70,229,0.10)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.borderColor = "#e2e8f0";
            e.currentTarget.style.boxShadow =
              "0 5px 18px rgba(15,23,42,0.045)";
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
            }}
          >
            {/* CASHFREE ICON */}
            <div
              style={{
                width: "46px",
                height: "46px",
                flexShrink: 0,
                borderRadius: "13px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background:
                  "linear-gradient(135deg, #eef2ff, #e0e7ff)",
                color: "#4338ca",
                fontSize: "19px",
                fontWeight: "800",
              }}
            >
              C
            </div>

            <div style={{ flex: 1 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "5px",
                }}
              >
                <span
                  style={{
                    fontWeight: "750",
                    fontSize: "16px",
                    color: "#111827",
                  }}
                >
                  Cashfree
                </span>

                <span
                  style={{
                    fontSize: "9px",
                    background: "#ecfdf5",
                    color: "#047857",
                    border: "1px solid #d1fae5",
                    padding: "4px 7px",
                    borderRadius: "6px",
                    fontWeight: "800",
                    letterSpacing: "0.4px",
                  }}
                >
                  FAST
                </span>
              </div>

              <p
                style={{
                  fontSize: "12px",
                  color: "#64748b",
                  margin: "0",
                }}
              >
                UPI, Cards, NetBanking, Wallets
              </p>
            </div>

            <div
              style={{
                width: "30px",
                height: "30px",
                borderRadius: "50%",
                background: "#f8fafc",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#64748b",
                fontSize: "17px",
              }}
            >
              →
            </div>
          </div>

          {/* PAYMENT LOGOS */}
          <div
            style={{
              height: "1px",
              background: "#f1f5f9",
              margin: "17px 0 13px",
            }}
          />

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              flexWrap: "wrap",
            }}
          >
            {/* UPI */}
            <div
              style={{
                height: "27px",
                minWidth: "48px",
                padding: "3px 7px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#fff",
                border: "1px solid #edf0f3",
                borderRadius: "6px",
              }}
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/f/fa/UPI-Logo.png"
                alt="UPI"
                style={{
                  maxWidth: "40px",
                  maxHeight: "19px",
                  width: "auto",
                  height: "auto",
                  objectFit: "contain",
                }}
              />
            </div>

            {/* VISA */}
            <div
              style={{
                height: "27px",
                minWidth: "48px",
                padding: "3px 7px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#fff",
                border: "1px solid #edf0f3",
                borderRadius: "6px",
              }}
            >
              <img
                src="https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5c/Visa_Inc._logo_%282021%E2%80%93present%29.svg/3840px-Visa_Inc._logo_%282021%E2%80%93present%29.svg.png"
                alt="Visa"
                style={{
                  width: "38px",
                  maxHeight: "19px",
                  objectFit: "contain",
                }}
              />
            </div>

            {/* MASTERCARD */}
            <div
              style={{
                height: "27px",
                minWidth: "48px",
                padding: "3px 7px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#fff",
                border: "1px solid #edf0f3",
                borderRadius: "6px",
              }}
            >
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR5sveA9H-YJq_rfzFeSjastlBqe-uYH5Ygf-0XIQ49yQ&s=10"
                alt="Mastercard"
                style={{
                  width: "38px",
                  maxHeight: "19px",
                  objectFit: "contain",
                }}
              />
            </div>

            {/* RUPAY */}
            <div
              style={{
                height: "27px",
                minWidth: "48px",
                padding: "3px 7px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#fff",
                border: "1px solid #edf0f3",
                borderRadius: "6px",
                color: "#475569",
                fontSize: "10px",
                fontWeight: "800",
              }}
            >
              RuPay
            </div>
          </div>
        </div>

        {/* RAZORPAY */}
        <div
          onClick={() => router.push("/checkout/payment/razorpay")}
          style={{
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            padding: "19px",
            borderRadius: "17px",
            cursor: "pointer",
            boxShadow: "0 5px 18px rgba(15,23,42,0.045)",
            transition:
              "transform .2s ease, box-shadow .2s ease, border-color .2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.borderColor = "#bae6fd";
            e.currentTarget.style.boxShadow =
              "0 14px 32px rgba(14,165,233,0.10)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.borderColor = "#e2e8f0";
            e.currentTarget.style.boxShadow =
              "0 5px 18px rgba(15,23,42,0.045)";
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
            }}
          >
            {/* RAZORPAY ICON */}
            <div
              style={{
                width: "46px",
                height: "46px",
                flexShrink: 0,
                borderRadius: "13px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background:
                  "linear-gradient(135deg, #e0f2fe, #bae6fd)",
                color: "#0369a1",
                fontSize: "19px",
                fontWeight: "800",
              }}
            >
              R
            </div>

            <div style={{ flex: 1 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "5px",
                }}
              >
                <span
                  style={{
                    fontWeight: "750",
                    fontSize: "16px",
                    color: "#111827",
                  }}
                >
                  Razorpay
                </span>

                <span
                  style={{
                    fontSize: "9px",
                    background: "#eff6ff",
                    color: "#0369a1",
                    border: "1px solid #dbeafe",
                    padding: "4px 7px",
                    borderRadius: "6px",
                    fontWeight: "800",
                    letterSpacing: "0.4px",
                  }}
                >
                  SECURE
                </span>
              </div>

              <p
                style={{
                  fontSize: "12px",
                  color: "#64748b",
                  margin: "0",
                }}
              >
                UPI, Cards, NetBanking & more
              </p>
            </div>

            <div
              style={{
                width: "30px",
                height: "30px",
                borderRadius: "50%",
                background: "#f8fafc",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#64748b",
                fontSize: "17px",
              }}
            >
              →
            </div>
          </div>

          {/* PAYMENT LOGOS */}
          <div
            style={{
              height: "1px",
              background: "#f1f5f9",
              margin: "17px 0 13px",
            }}
          />

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              flexWrap: "wrap",
            }}
          >
            {/* UPI */}
            <div
              style={{
                height: "27px",
                minWidth: "48px",
                padding: "3px 7px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#fff",
                border: "1px solid #edf0f3",
                borderRadius: "6px",
              }}
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/f/fa/UPI-Logo.png"
                alt="UPI"
                style={{
                  maxWidth: "40px",
                  maxHeight: "19px",
                  width: "auto",
                  height: "auto",
                  objectFit: "contain",
                }}
              />
            </div>

            {/* VISA */}
            <div
              style={{
                height: "27px",
                minWidth: "48px",
                padding: "3px 7px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#fff",
                border: "1px solid #edf0f3",
                borderRadius: "6px",
              }}
            >
              <img
                src="https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5c/Visa_Inc._logo_%282021%E2%80%93present%29.svg/3840px-Visa_Inc._logo_%282021%E2%80%93present%29.svg.png"
                alt="Visa"
                style={{
                  width: "38px",
                  maxHeight: "19px",
                  objectFit: "contain",
                }}
              />
            </div>

            {/* MASTERCARD */}
            <div
              style={{
                height: "27px",
                minWidth: "48px",
                padding: "3px 7px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#fff",
                border: "1px solid #edf0f3",
                borderRadius: "6px",
              }}
            >
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR5sveA9H-YJq_rfzFeSjastlBqe-uYH5Ygf-0XIQ49yQ&s=10"
                alt="Mastercard"
                style={{
                  width: "38px",
                  maxHeight: "19px",
                  objectFit: "contain",
                }}
              />
            </div>

            {/* PHONEPE */}
            <div
              style={{
                height: "27px",
                minWidth: "48px",
                padding: "3px 7px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#fff",
                border: "1px solid #edf0f3",
                borderRadius: "6px",
              }}
            >
              <img
                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJQAAACUCAMAAABC4vDmAAAAeFBMVEX///9FKJ+qoco6FJuRhbz///2ckcQ6FZ7Y1OLRzeE0A5oyAJv///uwp9E7Fprj4evv7PKyrNJCIp/49/o6GJehl8bKxdxWPKAjAJV0Y7BQOqI/Hp9NMZ9mUKvPy+O9ttSMgb5aRKSJer3FwNyBc7hwXrNgUKW+tdm2rgDrAAAD2klEQVR4nO2c23arIBCGQUqJaBQxiSYmrU3T9P3fcJuDyF5rx6CbU1f5L3rhBevrMA7DOBMAgoKCgoKCgoKCglwLp4Btiki7ig0DKZ5FBEAeVYggAyKoivI5TLhcc8qhIXVLr0s82VoxIsaQrlgExVOhipVRpCvWqphChHFRm0a6qC6AsrEwjlc2mCBcTdjBEhnfu5v4qlSGWhM7TBCSteru5dySoTpT8VxtA9OI2mKCkEapkqFAZc1QnakqtReQIXtMECKmtH0ba25+EdkoQRWZTahMLaxHdrcv+i1QvIs1//O2moBqCN/v9qTxB6qh9WH9xsr8fTs73mqG4vAc5fcDNX2Z64iaoch7B3OLxxik7UxbaYbay7EYg8O8mKvbUu3lEiag2Mcsb9ft6OQoX0hSNiut1/72JcfOmQTUvENTf5yi21JOhz5nXDcMBM/kVALJr16nv4ImIjr5klP/GYHByNlHZVuB8jw1iJrJEsiBSQktO0wMDIZSF7JlUp6dJ9MCg6l8iuxlW8V+QMHszCS/+p4UGMxlngQO52CKJ12wDabD2SHvbYUBPk0IDCZz9KYZ/CpNv9RtZfTi0HzkwzvIKuXAYPY209ChtprmUPUd1AOVZYj8UwmM+0wGg02Dsoua7InNtEDx4+tDvYj0CuPF5qbiyZ1CB1TWKq0hCbej/6QOKKK2hsSE2WHMv3RAIdV64EAFRq9fbqCelFC1QL16CMVPHkJBGKdKpVOrUM1OvR7fQ5l29AvV9+IqcQKn8UIo7pFx3j/63I0tp+ns40lCO9VitbymQvVb/7S9P03G82O9BzJaCiipcpvE/VPF4lCAClABKkAFqAD1Y6DIACW1VriGGrIEKQ1wDJWJKwSTPs+7hmr7JK/cDldz11BbkRdL+a5jKF711bu0hMJUjqFgnYtuv7iqM84bQuudqAe5gaJLUSVL8fvxfD6flotSFM7cQPHDaKefGyjYxGPNM46gyBGP9JA6goL1p3+Wgnw/0mfkCqq7wufgkV85g4JZ9dDZ3UFBXrdyqx/OxYY6hOpiKDwt72GcfR+pKHA4hbp0BtU1hXDV/c3owhOoq+5dVH5B3RWgApRuqMRLKMfp8M+BoqLr1iMoXvU5skdQEK1vn27wUe2Du53eYXp6Y2VZFoqrWGpozviuk2pjgrUua67clfCbWr8tQXk5TuDl4IWPIyp+DvN4OfZke0BMccTPw1E6m0OHSLnJwep45oShUVuDrNNGkf0b+b0oRubmta9IZBU/p/hbxsfImzlj5D4O3F+5vPtpAvCwmKlHRhcPCgoKCgoKCgoKCgryT38AIFRZnRbrU3AAAAAASUVORK5CYII="
                alt="PhonePe"
                style={{
                  width: "38px",
                  maxHeight: "19px",
                  objectFit: "contain",
                }}
              />
            </div>

            {/* GOOGLE PAY */}
            <div
              style={{
                height: "27px",
                minWidth: "48px",
                padding: "3px 7px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#fff",
                border: "1px solid #edf0f3",
                borderRadius: "6px",
              }}
            >
              <img
                src="data:image/png;base64,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"
                alt="Google Pay"
                style={{
                  width: "38px",
                  maxHeight: "19px",
                  objectFit: "contain",
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* SECURITY NOTICE */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: "11px",
          padding: "14px",
          marginBottom: "16px",
          borderRadius: "13px",
          background:
            "linear-gradient(135deg, #f0fdf4, #f7fee7)",
          border: "1px solid #dcfce7",
        }}
      >
        <div
          style={{
            width: "25px",
            height: "25px",
            flexShrink: 0,
            borderRadius: "50%",
            background: "#dcfce7",
            color: "#15803d",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "12px",
            fontWeight: "800",
          }}
        >
          ✓
        </div>

        <div>
          <div
            style={{
              fontSize: "12px",
              fontWeight: "750",
              color: "#166534",
              marginBottom: "3px",
            }}
          >
            Secure payment
          </div>

          <div
            style={{
              fontSize: "11px",
              color: "#4d7c5b",
              lineHeight: "1.5",
            }}
          >
            Your payment details are securely processed by
            the selected payment gateway.
          </div>
        </div>
      </div>

      {/* BACK BUTTON */}
      <button
        onClick={() => router.push("/checkout")}
        style={{
          background: "#ffffff",
          color: "#334155",
          border: "1px solid #e2e8f0",
          padding: "13px 20px",
          borderRadius: "11px",
          cursor: "pointer",
          fontWeight: "650",
          width: "100%",
          fontSize: "13px",
          boxShadow: "0 3px 10px rgba(15,23,42,0.03)",
          transition:
            "background .2s ease, border-color .2s ease, color .2s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "#f8fafc";
          e.currentTarget.style.borderColor = "#cbd5e1";
          e.currentTarget.style.color = "#0f172a";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "#ffffff";
          e.currentTarget.style.borderColor = "#e2e8f0";
          e.currentTarget.style.color = "#334155";
        }}
      >
        ← Back to Checkout
      </button>

      {/* FOOTER */}
      <div
        style={{
          textAlign: "center",
          marginTop: "17px",
          fontSize: "10px",
          color: "#94a3b8",
        }}
      >
        🔒 Secure & encrypted payment
      </div>
    </div>
  );
}

