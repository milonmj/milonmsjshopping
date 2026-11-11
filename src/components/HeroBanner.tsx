import Link from "next/link";

const BANNER_IMAGE =
  "https://res.cloudinary.com/vhb1swue/image/upload/f_auto,q_auto,w_800/v1794388356/file_00000000fd6c8211b5d172346b8e02e4.png";

export default function HeroBanner() {
  return (
    <section className="bg-[#fbeee6]">
      <div className="mx-auto grid max-w-6xl items-center gap-6 px-4 py-8 md:grid-cols-2 md:py-12">
        <div className="mx-auto w-full max-w-[320px] md:order-2 md:max-w-[380px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={BANNER_IMAGE}
            alt="নতুন থ্রি পিস কালেকশন"
            className="aspect-[1143/1376] w-full rounded-2xl object-cover shadow-lg"
          />
        </div>
        <div className="text-center md:order-1 md:text-left">
          <p className="text-sm font-medium text-[#e8317b]">নতুন কালেকশন</p>
          <h2 className="mt-2 text-3xl font-bold leading-tight text-gray-900 md:text-5xl">
            নতুন থ্রি পিস কালেকশন
          </h2>
          <p className="mt-3 text-gray-700">
            সারা বাংলাদেশে হোম ডেলিভারি | ৫টি কিনলে পাইকারি দাম
          </p>
          <Link
            href="/category/clothing"
            className="mt-6 inline-block rounded-full bg-[#e8317b] px-8 py-3 font-semibold text-white"
          >
            এখনই কিনুন
          </Link>
        </div>
      </div>
    </section>
  );
}
