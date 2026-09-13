import { siteConfig } from "@/lib/site-config";

export const metadata = {
  title: `প্রাইভেসি পলিসি | ${siteConfig.name}`,
  description: `${siteConfig.name}-এর গ্রাহকদের তথ্য সুরক্ষা নীতিমালা।`,
};

export default function PrivacyPolicyPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-10 text-black">
      <h1 className="text-3xl font-bold text-pink-600 mb-6">প্রাইভেসি পলিসি</h1>

      <p className="mb-4 leading-relaxed">
        <strong>{siteConfig.name}</strong> আপনার ব্যক্তিগত তথ্যের গোপনীয়তা রক্ষায় প্রতিশ্রুতিবদ্ধ।
        এই পলিসিতে বর্ণনা করা হয়েছে আমরা কীভাবে আপনার তথ্য সংগ্রহ, ব্যবহার এবং সংরক্ষণ করি।
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">১. আমরা কী তথ্য সংগ্রহ করি</h2>
      <ul className="list-disc list-inside space-y-1 mb-4">
        <li>নাম, ফোন নম্বর, ইমেইল</li>
        <li>ডেলিভারি ঠিকানা</li>
        <li>অর্ডার ও পেমেন্ট সংক্রান্ত তথ্য (COD-এর ক্ষেত্রে পেমেন্ট বিস্তারিত সংরক্ষণ করা হয় না)</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">২. তথ্য ব্যবহারের উদ্দেশ্য</h2>
      <ul className="list-disc list-inside space-y-1 mb-4">
        <li>অর্ডার প্রসেস ও ডেলিভারি নিশ্চিত করতে</li>
        <li>গ্রাহক সেবা প্রদান করতে</li>
        <li>ওয়েবসাইটের কার্যক্ষমতা উন্নত করতে</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">৩. তথ্য সুরক্ষা</h2>
      <p className="mb-4 leading-relaxed">
        আপনার তথ্য নিরাপদে সংরক্ষণ করা হয় এবং তৃতীয় পক্ষের সাথে শেয়ার করা হয় না, ডেলিভারি
        সংক্রান্ত প্রয়োজন ছাড়া (যেমন কুরিয়ার সার্ভিস)।
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">৪. যোগাযোগ</h2>
      <p className="leading-relaxed">
        প্রাইভেসি সংক্রান্ত কোনো প্রশ্ন থাকলে আমাদের{" "}
        <a href="/contact" className="text-pink-600 underline">
          যোগাযোগ পেজে
        </a>{" "}
        যান।
      </p>
    </main>
  );
}
