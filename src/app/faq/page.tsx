import { siteConfig } from "@/lib/site-config";

export const metadata = {
  title: `সচরাচর জিজ্ঞাসা (FAQ) | ${siteConfig.name}`,
  description: `${siteConfig.name}-এ অর্ডার, ডেলিভারি ও পেমেন্ট সম্পর্কিত সচরাচর প্রশ্নের উত্তর।`,
};

const faqs = [
  {
    q: "অর্ডার করার পর ডেলিভারি হতে কতদিন লাগে?",
    a: "ঢাকার ভিতরে সাধারণত ১-২ কার্যদিবস এবং ঢাকার বাইরে ৩-৫ কার্যদিবস সময় লাগে।",
  },
  {
    q: "পেমেন্ট পদ্ধতি কী কী?",
    a: "বর্তমানে ক্যাশ অন ডেলিভারি (COD) চালু আছে। bKash, Nagad এবং কার্ড পেমেন্ট শীঘ্রই যুক্ত করা হবে।",
  },
  {
    q: "পণ্য ফেরত বা রিটার্ন করা যাবে কি?",
    a: "হ্যাঁ, নির্দিষ্ট শর্তাবলী সাপেক্ষে পণ্য ফেরত দেওয়া যায়। বিস্তারিত জানতে আমাদের Return Policy পেজ দেখুন।",
  },
  {
    q: "অর্ডার ট্র্যাক করব কীভাবে?",
    a: "লগইন করার পর 'আমার অ্যাকাউন্ট' থেকে অর্ডার হিস্টোরিতে গিয়ে অর্ডারের বর্তমান অবস্থা দেখতে পারবেন।",
  },
  {
    q: "সাইজ বা পণ্য নিয়ে সহায়তা লাগলে কী করব?",
    a: "পণ্যের পেজে থাকা WhatsApp বাটনে চাপ দিয়ে সরাসরি আমাদের সাথে যোগাযোগ করতে পারেন।",
  },
];

export default function FaqPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-10 text-black">
      <h1 className="text-3xl font-bold text-pink-600 mb-6">সচরাচর জিজ্ঞাসা</h1>

      <div className="space-y-6">
        {faqs.map((item, i) => (
          <div key={i} className="border-b pb-4">
            <h2 className="font-semibold text-lg mb-2">প্রশ্ন: {item.q}</h2>
            <p className="text-gray-700 leading-relaxed">উত্তর: {item.a}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
