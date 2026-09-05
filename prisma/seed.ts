// Demo seed data for Milon M&J Shopping — CLEARLY LABELED DEMO DATA.
// Run: npx prisma db seed  (after `npx prisma migrate dev`)
// Replace with real inventory via the admin dashboard (Stage 5) before going live.

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
const prisma = new PrismaClient();

async function main() {
  const groups = [
    {
      slug: "clothing",
      nameBn: "পোশাক",
      nameEn: "Clothing",
      children: [
        { slug: "ladies-three-piece", nameBn: "লেডিস থ্রি-পিস", nameEn: "Ladies Three-Piece" },
        { slug: "saree", nameBn: "শাড়ি", nameEn: "Saree" },
        { slug: "jeans", nameBn: "জিন্স", nameEn: "Jeans" },
        { slug: "pants", nameBn: "প্যান্ট", nameEn: "Pants" },
        { slug: "t-shirts", nameBn: "টি-শার্ট", nameEn: "T-Shirts" },
        { slug: "shirts", nameBn: "শার্ট", nameEn: "Shirts" },
      ],
    },
    {
      slug: "cosmetics",
      nameBn: "কসমেটিকস",
      nameEn: "Cosmetics",
      children: [
        { slug: "ladies-cosmetics", nameBn: "লেডিস কসমেটিকস", nameEn: "Ladies Cosmetics" },
        { slug: "beauty-products", nameBn: "বিউটি প্রোডাক্টস", nameEn: "Beauty Products" },
        { slug: "skincare", nameBn: "স্কিনকেয়ার", nameEn: "Skincare Products" },
      ],
    },
    {
      slug: "shoes",
      nameBn: "জুতা",
      nameEn: "Shoes",
      children: [
        { slug: "mens-shoes", nameBn: "পুরুষদের জুতা", nameEn: "Men's Shoes" },
        { slug: "womens-shoes", nameBn: "মহিলাদের জুতা", nameEn: "Women's Shoes" },
        { slug: "casual-shoes", nameBn: "ক্যাজুয়াল জুতা", nameEn: "Casual Shoes" },
        { slug: "sandals", nameBn: "স্যান্ডেল", nameEn: "Sandals" },
      ],
    },
    {
      slug: "electric-items",
      nameBn: "ইলেকট্রিক পণ্য",
      nameEn: "Electric Items",
      children: [
        { slug: "small-electronics", nameBn: "ছোট ইলেকট্রনিক্স", nameEn: "Small Electronics" },
      ],
    },
  ];

  const subcatIds: Record<string, string> = {};

  for (const g of groups) {
    const parent = await prisma.category.upsert({
      where: { slug: g.slug },
      update: {},
      create: { slug: g.slug, nameBn: g.nameBn, nameEn: g.nameEn },
    });
    for (const c of g.children) {
      const child = await prisma.category.upsert({
        where: { slug: c.slug },
        update: {},
        create: { slug: c.slug, nameBn: c.nameBn, nameEn: c.nameEn, parentId: parent.id },
      });
      subcatIds[c.slug] = child.id;
    }
  }

  const demoProducts = [
    {
      slug: "demo-ladies-georgette-three-piece",
      nameBn: "জর্জেট থ্রি-পিস (ডেমো)",
      nameEn: "Georgette Three-Piece (Demo)",
      sku: "DEMO-TP-001",
      categorySlug: "ladies-three-piece",
      retailPrice: 1450,
      wholesalePrice: 1100,
      minWholesaleQty: 12,
      quantity: 40,
      isFeatured: true,
    },
    {
      slug: "demo-jamdani-saree",
      nameBn: "জামদানি শাড়ি (ডেমো)",
      nameEn: "Jamdani Saree (Demo)",
      sku: "DEMO-SR-001",
      categorySlug: "saree",
      retailPrice: 3200,
      wholesalePrice: 2600,
      minWholesaleQty: 6,
      quantity: 15,
      isFeatured: true,
    },
    {
      slug: "demo-slim-fit-jeans",
      nameBn: "স্লিম ফিট জিন্স (ডেমো)",
      nameEn: "Slim Fit Jeans (Demo)",
      sku: "DEMO-JN-001",
      categorySlug: "jeans",
      retailPrice: 950,
      wholesalePrice: 750,
      minWholesaleQty: 12,
      quantity: 60,
      isFeatured: false,
    },
    {
      slug: "demo-cotton-t-shirt",
      nameBn: "কটন টি-শার্ট (ডেমো)",
      nameEn: "Cotton T-Shirt (Demo)",
      sku: "DEMO-TS-001",
      categorySlug: "t-shirts",
      retailPrice: 450,
      wholesalePrice: 320,
      minWholesaleQty: 24,
      quantity: 100,
      isFeatured: true,
    },
    {
      slug: "demo-matte-lipstick-set",
      nameBn: "ম্যাট লিপস্টিক সেট (ডেমো)",
      nameEn: "Matte Lipstick Set (Demo)",
      sku: "DEMO-CS-001",
      categorySlug: "ladies-cosmetics",
      retailPrice: 650,
      wholesalePrice: 480,
      minWholesaleQty: 12,
      quantity: 30,
      isFeatured: true,
    },
    {
      slug: "demo-vitamin-c-serum",
      nameBn: "ভিটামিন সি সিরাম (ডেমো)",
      nameEn: "Vitamin C Serum (Demo)",
      sku: "DEMO-SK-001",
      categorySlug: "skincare",
      retailPrice: 890,
      wholesalePrice: 650,
      minWholesaleQty: 12,
      quantity: 25,
      isFeatured: false,
    },
    {
      slug: "demo-mens-leather-loafer",
      nameBn: "পুরুষদের লেদার লোফার (ডেমো)",
      nameEn: "Men's Leather Loafer (Demo)",
      sku: "DEMO-SH-001",
      categorySlug: "mens-shoes",
      retailPrice: 2200,
      wholesalePrice: 1750,
      minWholesaleQty: 6,
      quantity: 18,
      isFeatured: true,
    },
    {
      slug: "demo-womens-flat-sandal",
      nameBn: "মহিলাদের ফ্ল্যাট স্যান্ডেল (ডেমো)",
      nameEn: "Women's Flat Sandal (Demo)",
      sku: "DEMO-SD-001",
      categorySlug: "sandals",
      retailPrice: 780,
      wholesalePrice: 590,
      minWholesaleQty: 12,
      quantity: 35,
      isFeatured: false,
    },
    {
      slug: "demo-mini-blender",
      nameBn: "মিনি ব্লেন্ডার (ডেমো)",
      nameEn: "Mini Blender (Demo)",
      sku: "DEMO-EL-001",
      categorySlug: "small-electronics",
      retailPrice: 1650,
      wholesalePrice: 1300,
      minWholesaleQty: 6,
      quantity: 20,
      isFeatured: true,
    },
    {
      slug: "demo-led-desk-lamp",
      nameBn: "এলইডি ডেস্ক ল্যাম্প (ডেমো)",
      nameEn: "LED Desk Lamp (Demo)",
      sku: "DEMO-EL-002",
      categorySlug: "small-electronics",
      retailPrice: 990,
      wholesalePrice: 760,
      minWholesaleQty: 12,
      quantity: 22,
      isFeatured: false,
    },
  ];

  for (const p of demoProducts) {
    const category = subcatIds[p.categorySlug];
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        slug: p.slug,
        nameBn: p.nameBn,
        nameEn: p.nameEn,
        descriptionBn: "এটি একটি ডেমো পণ্য বিবরণ। প্রকৃত পণ্যের তথ্য অ্যাডমিন প্যানেল থেকে যোগ করুন।",
        descriptionEn: "This is placeholder demo product copy — replace via the admin dashboard.",
        sku: p.sku,
        categoryId: category,
        retailPrice: p.retailPrice,
        wholesalePrice: p.wholesalePrice,
        minWholesaleQty: p.minWholesaleQty,
        quantity: p.quantity,
        stockStatus: p.quantity > 5 ? "IN_STOCK" : "LOW_STOCK",
        isFeatured: p.isFeatured,
        images: {
          create: [{ url: `https://picsum.photos/seed/${p.slug}/600/700`, sortOrder: 0 }],
        },
      },
    });
  }

  const demoPasswordHash = await bcrypt.hash("demo1234", 10);
  const demoUser = await prisma.user.upsert({
    where: { phone: "01700000000" },
    update: {},
    create: {
      name: "Demo Customer",
      phone: "01700000000",
      email: "demo@milonmjshopping.com",
      passwordHash: demoPasswordHash,
      role: "CUSTOMER",
    },
  });

  const existingDemoAddress = await prisma.address.findFirst({ where: { userId: demoUser.id } });
  if (!existingDemoAddress) {
    await prisma.address.create({
      data: {
        userId: demoUser.id,
        label: "Home",
        fullName: "Demo Customer",
        phone: "01700000000",
        district: "Dhaka",
        area: "Mirpur",
        addressLine: "House 12, Road 5, Mirpur 10",
        isDefault: true,
      },
    });
  }

  const adminPasswordHash = await bcrypt.hash("admin1234", 10);
  await prisma.user.upsert({
    where: { phone: "01900000000" },
    update: {},
    create: {
      name: "Store Admin",
      phone: "01900000000",
      email: "admin@milonmjshopping.com",
      passwordHash: adminPasswordHash,
      role: "ADMIN",
    },
  });

  console.log(`Seeded ${groups.length} category groups and ${demoProducts.length} demo products.`);
  console.log(`Seeded a demo customer — phone: 01700000000, password: demo1234`);
  console.log(`Seeded a demo admin — phone: 01900000000, password: admin1234 (sign in at /admin-login)`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => await prisma.$disconnect()); যে
