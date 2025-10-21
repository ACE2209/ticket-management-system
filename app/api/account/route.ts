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

// ----- Hàm đọc accounts -----
function readAccounts(): Account[] {
  if (!fs.existsSync(dataFile)) return [];
  const fileData = fs.readFileSync(dataFile, "utf8");

  // Regex lấy mảng accounts từ file .ts
  const match = fileData.match(/export const accounts\s*=\s*(\[[\s\S]*\]);?/);
  if (!match) return [];

  try {
    // ⚠️ KHÔNG dùng JSON.parse vì file là code TS, dùng eval để đọc mảng JS hợp lệ
    const accountsArray = eval(match[1]);
    return Array.isArray(accountsArray) ? accountsArray : [];
  } catch (err) {
    console.error("Failed to eval accounts.ts:", err);
    return [];
  }
}

// ----- Hàm ghi accounts -----
function writeAccounts(accounts: Account[]): void {
  const dir = path.dirname(dataFile);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const content = `export const accounts = ${JSON.stringify(accounts, null, 2)};`;
  fs.writeFileSync(dataFile, content, "utf8");
}

// ----- POST: tạo tài khoản mới -----
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { firstName, lastName, email, password } = body as Partial<Account>;

    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const accounts = readAccounts();

    if (accounts.some((acc) => acc.email === email)) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 400 }
      );
    }

    // ✅ Tạo tài khoản mới với avatar trống
    const newAccount: Account = {
      firstName,
      lastName,
      email,
      password,
      avatar: "",
    };

    accounts.push(newAccount);
    writeAccounts(accounts);

    return NextResponse.json({
      message: "Account created successfully!",
      account: newAccount,
    });
  } catch (err) {
    console.error("POST error:", err);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

// ----- PATCH: cập nhật tài khoản (bao gồm avatar) -----
export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const {
      email,
      firstName,
      lastName,
      dob,
      gender,
      location,
      password,
      avatar,
    } = body;

    if (!email) {
      return NextResponse.json({ error: "Missing email" }, { status: 400 });
    }

    const accounts = readAccounts();
    const index = accounts.findIndex((acc) => acc.email === email);
    if (index === -1) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // ✅ Cập nhật thông tin user
    accounts[index] = {
      ...accounts[index],
      firstName: firstName ?? accounts[index].firstName,
      lastName: lastName ?? accounts[index].lastName,
      dob: dob ?? accounts[index].dob ?? "",
      gender: gender ?? accounts[index].gender ?? "",
      location: location ?? accounts[index].location ?? "",
      password: password ?? accounts[index].password,
      avatar:
        avatar !== undefined
          ? avatar // nếu người dùng gửi avatar mới
          : accounts[index].avatar || "", // nếu không gửi, giữ nguyên
    };

    writeAccounts(accounts);

    return NextResponse.json({
      message: "Account updated successfully!",
      account: accounts[index],
    });
  } catch (err) {
    console.error("PATCH error:", err);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

// ----- GET: lấy danh sách tài khoản -----
export async function GET() {
  try {
    const accounts = readAccounts();
    return NextResponse.json(accounts);
  } catch (err) {
    console.error("GET error:", err);
    return NextResponse.json(
      { error: "Failed to read accounts" },
      { status: 500 }
    );
  }
}
