import { SITE_NAME } from "@/lib/site-config";

export const metadata = {
  title: `শর্তাবলী | ${SITE_NAME}`,
  description: `${SITE_NAME}-এর ব্যবহারের শর্তাবলী।`,
};

export default function TermsPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-10 text-black">
      <h1 className="text-3xl font-bold text-pink-600 mb-6">শর্তাবলী (Terms & Conditions)</h1>

      <p className="mb-4 leading-relaxed">
        <strong>{SITE_NAME}</strong> ওয়েবসাইট ব্যবহারের মাধ্যমে আপনি নিচের
        শর্তাবলীতে সম্মত হচ্ছেন বলে ধরে নেওয়া হবে।
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">১. অর্ডার ও মূল্য</h2>
      <p className="mb-4 leading-relaxed">
        ওয়েবসাইটে প্রদর্শিত পণ্যের মূল্য যেকোনো সময় পরিবর্তন হতে পারে। অর্ডার
        নিশ্চিত হওয়ার সময়কার মূল্যই প্রযোজ্য হবে।
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">২. পণ্যের বিবরণ</h2>
      <p className="mb-4 leading-relaxed">
        আমরা যথাসম্ভব সঠিক পণ্যের ছবি ও বিবরণ দেওয়ার চেষ্টা করি, তবে ছবি ও
        বাস্তব পণ্যের মধ্যে সামান্য পার্থক্য থাকতে পারে (রঙ, আলো ইত্যাদির কারণে)।
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">৩. ডেলিভারি</h2>
      <p className="mb-4 leading-relaxed">
        ডেলিভারির সময়সীমা আনুমানিক এবং এলাকাভেদে ভিন্ন হতে পারে। অপ্রত্যাশিত
        পরিস্থিতিতে (যেমন আবহাওয়া, কুরিয়ার সমস্যা) দেরি হতে পারে।
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">৪. পেমেন্ট</h2>
      <p className="mb-4 leading-relaxed">
        বর্তমানে শুধুমাত্র ক্যাশ অন ডেলিভারি (COD) গ্রহণযোগ্য। ভবিষ্যতে অন্যান্য
        পেমেন্ট পদ্ধতি যুক্ত করা হবে।
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">৫. শর্তাবলীর পরিবর্তন</h2>
      <p className="leading-relaxed">
        আমরা যেকোনো সময় এই শর্তাবলী পরিবর্তন করার অধিকার রাখি। পরিবর্তিত
        শর্তাবলী ওয়েবসাইটে প্রকাশের সাথে সাথে কার্যকর হবে।
      </p>
    </main>
  );
}
