import { siteConfig } from "@/lib/site-config";

export const metadata = {
  title: `রিটার্ন পলিসি | ${siteConfig.name}`,
  description: `${siteConfig.name}-এ পণ্য ফেরত ও রিফান্ড নীতিমালা।`,
};

export default function ReturnPolicyPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-10 text-black">
      <h1 className="text-3xl font-bold text-pink-600 mb-6">রিটার্ন পলিসি</h1>

      <p className="mb-4 leading-relaxed">
        আমরা চাই আপনি আমাদের পণ্যে সম্পূর্ণ সন্তুষ্ট থাকুন। নিচে রিটার্ন ও
        রিফান্ড সংক্রান্ত নীতিমালা বর্ণনা করা হলো।
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">১. রিটার্নের শর্তাবলী</h2>
      <ul className="list-disc list-inside space-y-1 mb-4">
        <li>পণ্য ডেলিভারির ৩ দিনের মধ্যে রিটার্নের জন্য জানাতে হবে</li>
        <li>পণ্য অব্যবহৃত, অক্ষত এবং মূল প্যাকেজিং-এ থাকতে হবে</li>
        <li>পণ্যের ট্যাগ/লেবেল অপসারণ করা যাবে না</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">২. কোন পণ্য রিটার্নযোগ্য নয়</h2>
      <ul className="list-disc list-inside space-y-1 mb-4">
        <li>ব্যবহৃত কসমেটিক্স পণ্য (স্বাস্থ্যগত কারণে)</li>
        <li>ছাড়ে বা ক্লিয়ারেন্স সেলে কেনা পণ্য (নির্দিষ্টভাবে উল্লেখ থাকলে)</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">৩. ত্রুটিপূর্ণ পণ্য</h2>
      <p className="mb-4 leading-relaxed">
        পণ্য ত্রুটিপূর্ণ বা ভুল আইটেম পাঠানো হলে সম্পূর্ণ বিনামূল্যে
        পরিবর্তন বা রিফান্ড দেওয়া হবে।
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">৪. রিটার্ন প্রক্রিয়া</h2>
      <p className="mb-4 leading-relaxed">
        রিটার্নের জন্য WhatsApp বাটনে চাপ দিয়ে অর্ডার নম্বর ও কারণ জানিয়ে
        আমাদের সাথে যোগাযোগ করুন। আমাদের টিম পরবর্তী ধাপ জানিয়ে দেবে।
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">৫. রিফান্ড</h2>
      <p className="leading-relaxed">
        রিটার্ন পণ্য যাচাইয়ের পর ৩-৭ কার্যদিবসের মধ্যে রিফান্ড প্রক্রিয়া
        সম্পন্ন করা হবে (COD-এর ক্ষেত্রে বিকাশ/নগদ বা ব্যাংকের মাধ্যমে)।
      </p>
    </main>
  );
}
