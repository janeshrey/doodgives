import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/firebase";
import { getAuth } from "firebase-admin/auth";
import admin from "firebase-admin";

// Initialize Firebase Admin SDK (use a service account)
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

export async function GET(req: NextRequest) {
  const token = req.headers.get("Authorization")?.split("Bearer ")[1];

  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const decodedToken = await getAuth().verifyIdToken(token);
    return NextResponse.json({ message: "Protected Data", uid: decodedToken.uid });
  } catch (error) {
    return NextResponse.json({ error: "Invalid Token" }, { status: 403 });
  }
}
