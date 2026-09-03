import { NextResponse } from "next/server";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

export async function GET() {
  try {
    if (!getApps().length) {
      if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !process.env.FIREBASE_PRIVATE_KEY) {
        return NextResponse.json(
          { success: false, error: "Missing Firebase environment variables in .env.local" },
          { status: 500 }
        );
      }

      initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
        }),
      });
    }

    const adminAuth = getAuth();
    const listUsersResult = await adminAuth.listUsers(1000);
    const usersList = listUsersResult?.users || [];
    
    const users = usersList.map((userRecord) => ({
      uid: userRecord?.uid || "",
      email: userRecord?.email || "N/A",
      displayName: userRecord?.displayName || "N/A",
      phoneNumber: userRecord?.phoneNumber || "N/A",
      createdAt: userRecord?.metadata?.creationTime || null,
      lastSignIn: userRecord?.metadata?.lastSignInTime || null,
    }));

    return NextResponse.json({ success: true, data: users }, { status: 200 });
  } catch (error) {
    console.error("Detailed Firebase Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Unknown server error" },
      { status: 500 }
    );
  }
}