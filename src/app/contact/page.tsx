import { siteConfig } from "@/lib/site-config";

export const metadata = {
  title: `যোগাযোগ | ${siteConfig.name}`,
  description: `${siteConfig.name}-এর সাথে যোগাযোগ করুন — ফোন, WhatsApp অথবা ঠিকানায়।`,
};

export default function ContactPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-10 text-black">
      <h1 className="text-3xl font-bold text-pink-600 mb-6">যোগাযোগ করুন</h1>

      <p className="mb-6 leading-relaxed">
        যেকোনো প্রশ্ন, অর্ডার সংক্রান্ত সহায়তা বা মতামতের জন্য আমাদের সাথে
        নিচের যেকোনো মাধ্যমে যোগাযোগ করতে পারেন।
      </p>

      <div className="space-y-4">
        <div>
          <h2 className="font-semibold text-lg">📞 ফোন</h2>
          <p>০১৭XXXXXXXX (পরিবর্তনযোগ্য)</p>
        </div>

        <div>
          <h2 className="font-semibold text-lg">💬 WhatsApp</h2>
          <p>উপরের WhatsApp বাটনে চাপ দিয়ে সরাসরি মেসেজ পাঠান</p>
        </div>

        <div>
          <h2 className="font-semibold text-lg">📍 ঠিকানা</h2>
          <p>ঢাকা, বাংলাদেশ (পরিবর্তনযোগ্য)</p>
        </div>

        <div>
          <h2 className="font-semibold text-lg">🕒 কার্যসময়</h2>
          <p>প্রতিদিন সকাল ৯টা - রাত ৯টা</p>
        </div>

        <div>
          <h2 className="font-semibold text-lg">✉️ ইমেইল</h2>
          <p>info@milonmjshopping.com (পরিবর্তনযোগ্য)</p>
        </div>
      </div>
    </main>
  );
}
