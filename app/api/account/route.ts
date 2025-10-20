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

// ----- Hàm đọc accounts -----
function readAccounts(): Account[] {
  if (!fs.existsSync(dataFile)) return [];
  const fileData = fs.readFileSync(dataFile, "utf8");

  // Regex lấy mảng accounts
  const match = fileData.match(/export const accounts\s*=\s*(\[[\s\S]*\]);?/);
  if (!match) return [];

  try {
    return JSON.parse(match[1]);
  } catch (err) {
    console.error("Failed to parse accounts.ts:", err);
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
    if (accounts.some(acc => acc.email === email)) {
      return NextResponse.json({ error: "Email already exists" }, { status: 400 });
    }

    const newAccount: Account = { firstName, lastName, email, password };
    accounts.push(newAccount);
    writeAccounts(accounts);

    return NextResponse.json({ message: "Account created successfully!", account: newAccount });
  } catch (err) {
    console.error("POST error:", err);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

// ----- PATCH: cập nhật tài khoản (bao gồm password) -----
export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { email, firstName, lastName, dob, gender, location, password } = body as Partial<Account>;

    if (!email) {
      return NextResponse.json({ error: "Missing email" }, { status: 400 });
    }

    const accounts = readAccounts();
    const index = accounts.findIndex(acc => acc.email === email);
    if (index === -1) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    accounts[index] = {
      ...accounts[index],
      firstName: firstName ?? accounts[index].firstName,
      lastName: lastName ?? accounts[index].lastName,
      dob: dob ?? accounts[index].dob ?? "",
      gender: gender ?? accounts[index].gender ?? "",
      location: location ?? accounts[index].location ?? "",
      password: password ?? accounts[index].password, // ✅ cập nhật password
    };

    writeAccounts(accounts);
    return NextResponse.json({ message: "Account updated", account: accounts[index] });
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
    return NextResponse.json({ error: "Failed to read accounts" }, { status: 500 });
  }
}
