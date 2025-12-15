
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const cors = require('cors');
require('dotenv').config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

// --- SEED ADMIN ---
const seedAdmin = async () => {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) return;

  const exists = await prisma.user.findUnique({ where: { email } });
  if (!exists) {
    const hashed = await bcrypt.hash(password, 10);
    await prisma.user.create({
      data: { name: "Super Admin", email, password: hashed, role: "ADMIN" }
    });
    console.log("Admin auto-seeded.");
  }
};

// --- AUTH APIs ---
app.post('/auth/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, password: hashed, role: "USER" }
    });
    res.json({ success: true, userId: user.id, role: user.role });
  } catch (e) {
    res.status(400).json({ error: "Email exists or invalid data" });
  }
});

app.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    // API explicitly returns userId, role, and name as requested
    res.json({ success: true, userId: user.id, role: user.role, name: user.name });
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
});

// --- PRODUCT APIs ---
app.post('/product/add', async (req, res) => {
  const { title, description, price, role } = req.body; // In real app, check role from session or token
  if (role !== 'ADMIN') return res.status(403).json({ error: "Unauthorized" });

  const product = await prisma.product.create({
    data: { title, description, price: parseFloat(price) }
  });
  res.json(product);
});

app.get('/products', async (req, res) => {
  const products = await prisma.product.findMany();
  res.json(products);
});

// --- PURCHASE & PAYMENT (UPI SIMULATION) ---
app.post('/product/buy', async (req, res) => {
  const { userId, productId } = req.body;
  
  // 1. Check if already purchased
  const existing = await prisma.purchase.findFirst({
    where: { userId: parseInt(userId), productId: parseInt(productId) }
  });
  if (existing) return res.status(400).json({ error: "Already purchased" });

  // 2. Simulate UPI Success (In real world, verify webhook signature here)
  try {
    await prisma.purchase.create({
      data: { userId: parseInt(userId), productId: parseInt(productId) }
    });
    res.json({ success: true, message: "Payment Successful via UPI" });
  } catch (e) {
    res.status(500).json({ error: "Transaction failed" });
  }
});

// --- ADMIN APIs ---
app.get('/admin/users', async (req, res) => {
  const users = await prisma.user.findMany({
    include: { purchases: { include: { product: true } } }
  });
  res.json(users);
});

app.listen(PORT, async () => {
  await seedAdmin();
  console.log(`Backend running on http://localhost:${PORT}`);
});
