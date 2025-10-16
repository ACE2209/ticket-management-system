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

// Đọc danh sách tài khoản
function readAccounts(): Account[] {
  if (!fs.existsSync(dataFile)) return [];
  const fileData = fs.readFileSync(dataFile, "utf8");
  // ✅ Dùng [\s\S]* thay cho flag /s để tương thích ES2017
  const match = fileData.match(/export const accounts = ([\s\S]*);/);
  try {
    return match ? JSON.parse(match[1]) : [];
  } catch {
    return [];
  }
}

// Ghi lại danh sách tài khoản (tự tạo file nếu chưa có)
function writeAccounts(accounts: Account[]): void {
  const dir = path.dirname(dataFile);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const fileContent = `export const accounts = ${JSON.stringify(accounts, null, 2)};`;
  fs.writeFileSync(dataFile, fileContent, "utf8");
}

// ✅ Tạo tài khoản mới
export async function POST(req: Request) {
  const body = await req.json();
  const { firstName, lastName, email, password } = body as Partial<Account>;

  if (!firstName || !lastName || !email || !password) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const accounts = readAccounts();
  if (accounts.some((a: Account) => a.email === email)) {
    return NextResponse.json({ error: "Email already exists" }, { status: 400 });
  }

  accounts.push({ firstName, lastName, email, password });
  writeAccounts(accounts);
  return NextResponse.json({ message: "Account created successfully!" });
}

// ✅ Cập nhật thông tin người dùng
export async function PATCH(req: Request) {
  const body = await req.json();
  const { email, firstName, lastName, dob, gender, location } = body as Partial<Account>;

  if (!email) {
    return NextResponse.json({ error: "Missing email" }, { status: 400 });
  }

  const accounts = readAccounts();
  const index = accounts.findIndex((a: Account) => a.email === email);
  if (index === -1) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Cập nhật thông tin
  accounts[index] = {
    ...accounts[index],
    firstName: firstName ?? accounts[index].firstName,
    lastName: lastName ?? accounts[index].lastName,
    dob: dob ?? accounts[index].dob ?? "",
    gender: gender ?? accounts[index].gender ?? "",
    location: location ?? accounts[index].location ?? "",
  };

  writeAccounts(accounts);
  return NextResponse.json({ message: "Account updated", account: accounts[index] });
}

// ✅ Lấy danh sách tài khoản
export async function GET() {
  const accounts = readAccounts();
  return NextResponse.json(accounts);
}
