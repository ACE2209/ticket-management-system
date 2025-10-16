import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

interface Account {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  dob?: string;
  gender?: string;
  location?: string;
}

const dataFile = path.join(process.cwd(), "data", "accounts.ts");

function readAccounts(): Account[] {
  if (!fs.existsSync(dataFile)) return [];
  const fileData = fs.readFileSync(dataFile, "utf8");
  const match = fileData.match(/export const accounts = ([\s\S]*);/);
  try {
    return match ? JSON.parse(match[1]) : [];
  } catch {
    return [];
  }
}

// ✅ API: kiểm tra đăng nhập
export async function POST(req: Request) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ error: "Missing email or password" }, { status: 400 });
  }

  const accounts = readAccounts();
  const user = accounts.find((a) => a.email === email && a.password === password);

  if (!user) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }

  // Có thể set session/token ở đây (tuỳ bạn)
  return NextResponse.json({ message: "Login successful", user });
}
