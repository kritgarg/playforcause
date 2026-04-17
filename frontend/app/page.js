import Link from 'next/link';

export default function Home() {
  return (
    <>
      {/* Full Screen Background Image with Black Filter */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('https://i.pinimg.com/736x/66/70/09/667009a74af39f84e8d1ee9670ea6f24.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center text-center min-h-[70vh] py-10">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[6rem] font-black mb-8 !text-white drop-shadow-[5px_5px_0px_black] tracking-tight whitespace-nowrap">
          PLAY. IMPACT. REWARD.
        </h1>

        <p className="text-xl md:text-2xl font-bold text-black max-w-2xl mx-auto mb-12 bg-white/80 p-5 border-4 border-black rounded-xl shadow-[4px_4px_0px_black] backdrop-blur-md">
          Users subscribe, part of their money goes to charity, and they get a chance to win rewards based on their scores!
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-6 mb-20">
          <Link href="/signup" className="vercel-btn !px-10 !py-5 !text-2xl !rounded-full shadow-[4px_4px_0px_black]">
            Start Impacting 🚀
          </Link>
          <Link href="/charities" className="vercel-btn-secondary !bg-white !px-10 !py-5 !text-2xl !rounded-full shadow-[4px_4px_0px_black] border-4 border-black text-black">
            View Charities
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full text-left">
          <div className="vercel-panel !bg-white/90 backdrop-blur-sm border-4 border-black shadow-[6px_6px_0px_black] p-8 transform hover:-translate-y-2 transition-transform">
            <div className="bg-[#FFB703] border-4 border-black w-12 h-12 flex items-center justify-center rounded-full font-black text-2xl mb-6 shadow-[2px_2px_0px_black]">1</div>
            <h3 className="text-3xl font-black text-black mb-3">Subscribe</h3>
            <p className="text-[#403d39] font-bold text-lg leading-relaxed">
              Join with a monthly or yearly plan. Minimum 10% goes directly to the charity of your choice.
            </p>
          </div>
          <div className="vercel-panel !bg-white/90 backdrop-blur-sm border-4 border-black shadow-[6px_6px_0px_black] p-8 transform hover:-translate-y-2 transition-transform">
            <div className="bg-[#FFB703] border-4 border-black w-12 h-12 flex items-center justify-center rounded-full font-black text-2xl mb-6 shadow-[2px_2px_0px_black]">2</div>
            <h3 className="text-3xl font-black text-black mb-3">Submit Scores</h3>
            <p className="text-[#403d39] font-bold text-lg leading-relaxed">
              Log your performance on the field. We track your latest rounds to qualify you for big wins.
            </p>
          </div>
          <div className="vercel-panel !bg-white/90 backdrop-blur-sm border-4 border-black shadow-[6px_6px_0px_black] p-8 transform hover:-translate-y-2 transition-transform">
            <div className="bg-[#FFB703] border-4 border-black w-12 h-12 flex items-center justify-center rounded-full font-black text-2xl mb-6 shadow-[2px_2px_0px_black]">3</div>
            <h3 className="text-3xl font-black text-black mb-3">Win Big</h3>
            <p className="text-[#403d39] font-bold text-lg leading-relaxed">
              Get matches in our monthly draws and share the prize pool. The higher the match, the bigger the reward!
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
