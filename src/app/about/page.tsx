import { SITE_NAME } from "@/lib/site-config";

export const metadata = {
  title: `আমাদের সম্পর্কে | ${SITE_NAME}`,
  description: `${SITE_NAME} সম্পর্কে জানুন — আমরা কারা, কী বিক্রি করি এবং কেন আমাদের বেছে নেবেন।`,
};

export default function AboutPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-10 text-black">
      <h1 className="text-3xl font-bold text-pink-600 mb-6">আমাদের সম্পর্কে</h1>

      <p className="mb-4 leading-relaxed">
        <strong>{SITE_NAME}</strong> একটি বিশ্বস্ত অনলাইন শপিং প্ল্যাটফর্ম, যেখানে
        আপনি পাবেন পোশাক, কসমেটিক্স, জুতা এবং ইলেকট্রনিক পণ্য — সব এক জায়গায়, সাশ্রয়ী দামে।
      </p>

      <p className="mb-4 leading-relaxed">
        আমাদের লক্ষ্য হলো সারা বাংলাদেশে গ্রাহকদের হাতের নাগালে মানসম্পন্ন পণ্য পৌঁছে দেওয়া,
        সহজ ও নির্ভরযোগ্য কেনাকাটার অভিজ্ঞতার মাধ্যমে।
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">আমরা কী বিক্রি করি</h2>
      <ul className="list-disc list-inside space-y-1 mb-6">
        <li>পোশাক (Clothing)</li>
        <li>কসমেটিক্স ও রূপচর্চা সামগ্রী</li>
        <li>জুতা ও পাদুকা</li>
        <li>ইলেকট্রনিক ও ইলেকট্রিক পণ্য</li>
      </ul>

      <h2 className="text-xl font-semibold mt-8 mb-3">কেন আমাদের বেছে নেবেন</h2>
      <ul className="list-disc list-inside space-y-1">
        <li>ক্যাশ অন ডেলিভারি সুবিধা</li>
        <li>দ্রুত ও নির্ভরযোগ্য ডেলিভারি</li>
        <li>WhatsApp-এর মাধ্যমে সরাসরি যোগাযোগ ও অর্ডার</li>
        <li>যাচাইকৃত মানসম্পন্ন পণ্য</li>
      </ul>
    </main>
  );
}
