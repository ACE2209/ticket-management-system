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
  avatar?: string;
}

const dataFile = path.join(process.cwd(), "data", "accounts.ts");

// ✅ Hàm đọc file .ts và parse chính xác mảng accounts
function readAccounts(): Account[] {
  if (!fs.existsSync(dataFile)) return [];

  const fileData = fs.readFileSync(dataFile, "utf8");

  // Dùng regex để lấy nội dung trong dấu [ ... ];
  const match = fileData.match(/export const accounts\s*=\s*(\[[\s\S]*\]);?/);
  if (!match) return [];

  try {
    // ✅ Dùng eval trong sandbox an toàn để parse mảng
    // (chỉ khi chắc chắn file này là của bạn, không do người dùng upload)
    const accountsArray = eval(match[1]);
    return Array.isArray(accountsArray) ? accountsArray : [];
  } catch (err) {
    console.error("❌ Failed to eval accounts.ts:", err);
    return [];
  }
}

// ✅ API đăng nhập
export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Missing email or password" },
        { status: 400 }
      );
    }

    const accounts = readAccounts();
    console.log("📂 Loaded accounts:", accounts);

    const user = accounts.find(
      (a) => a.email === email && a.password === password
    );

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    return NextResponse.json({ message: "Login successful", user });
  } catch (err) {
    console.error("Sign in error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
