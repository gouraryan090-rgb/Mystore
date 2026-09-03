"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAdminProtect } from "@/lib/protectedRoute";

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchCustomers() {
      try {
        const res = await fetch("/api/admin/users");
        const text = await res.text();

        let result;
        try {
          result = JSON.parse(text);
        } catch (e) {
          throw new Error(`Server returned non-JSON response: ${text.slice(0, 150)}`);
        }

        if (result?.success) {
          setCustomers(result?.data || []);
        } else {
          setError(result?.error || "Failed to load customers");
        }
      } catch (err) {
        console.error("Failed to load customers", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchCustomers();
  }, []);

  if (loading) return <div className="p-6">Loading customers...</div>;
  if (error) return <div className="p-6 text-red-600 font-semibold">Error: {error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Registered Customers</h1>
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Signed Up</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {Array.isArray(customers) && customers.length > 0 ? (
              customers.map((customer) => (
                <tr key={customer?.uid || Math.random()}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{customer?.displayName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer?.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer?.phoneNumber}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {customer?.createdAt ? new Date(customer.createdAt).toLocaleDateString() : "N/A"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                  No customers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}