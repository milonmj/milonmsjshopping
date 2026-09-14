import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// TEMPORARY one-time seeding endpoint.
// Visit: https://milonmsjshopping.vercel.app/api/run-seed?key=milonmj2026
// Delete this file from GitHub after running it once successfully.

export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get("key");
  if (key !== "milonmj2026") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const groups = [
      {
        slug: "clothing", nameBn: "পোশাক", nameEn: "Clothing",
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
        slug: "cosmetics", nameBn: "কসমেটিক্স", nameEn: "Cosmetics",
        children: [
          { slug: "ladies-cosmetics", nameBn: "লেডিস কসমেটিক্স", nameEn: "Ladies Cosmetics" },
          { slug: "beauty-products", nameBn: "বিউটি প্রোডাক্টস", nameEn: "Beauty Products" },
          { slug: "skincare", nameBn: "স্কিনকেয়ার", nameEn: "Skincare Products" },
        ],
      },
      {
        slug: "shoes", nameBn: "জুতা", nameEn: "Shoes",
        children: [
          { slug: "mens-shoes", nameBn: "পুরুষদের জুতা", nameEn: "Men's Shoes" },
          { slug: "womens-shoes", nameBn: "মহিলাদের জুতা", nameEn: "Women's Shoes" },
          { slug: "casual-shoes", nameBn: "ক্যাজুয়াল জুতা", nameEn: "Casual Shoes" },
          { slug: "sandals", nameBn: "স্যান্ডেল", nameEn: "Sandals" },
        ],
      },
      {
        slug: "electric-items", nameBn: "ইলেকট্রিক পণ্য", nameEn: "Electric Items",
        children: [
          { slug: "small-electronics", nameBn: "ছোট ইলেকট্রনিক্স", nameEn: "Small Electronics" },
        ],
      },
    ];

    for (const g of groups) {
      const parent = await prisma.category.upsert({
        where: { slug: g.slug },
        update: {},
        create: { slug: g.slug, nameBn: g.nameBn, nameEn: g.nameEn },
      });
      for (const c of g.children) {
        await prisma.category.upsert({
          where: { slug: c.slug },
          update: {},
          create: { slug: c.slug, nameBn: c.nameBn, nameEn: c.nameEn, parentId: parent.id },
        });
      }
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

    return NextResponse.json({
      success: true,
      message: "Categories and admin user seeded successfully. You can now delete this route.",
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
