import { ArrowUpRight, Headphones, Watch, Camera } from "lucide-react";

export default function HeroBento() {
  return (
    <section className="w-full pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-3 gap-6 h-auto md:h-[600px]">
          
          {/* Main Big Hero Box (Spans 2 cols, 2 rows) */}
          <div className="col-span-1 md:col-span-2 md:row-span-2 bg-[#ff6700]/10 border border-[#ff6700]/20 rounded-[2rem] p-8 flex flex-col justify-between relative overflow-hidden group hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur px-3 py-1.5 rounded-full text-xs font-bold text-gray-700 mb-6">
                <span className="w-2 h-2 rounded-full bg-[#ff6700]"></span> New Arrival
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight mb-4">
                Sequoia Inspiring <br /> Musico.
              </h1>
              <p className="text-gray-600 font-medium max-w-sm">
                Making your dream music come true, stay with Sequoia Sounds!
              </p>
            </div>
            <div className="relative z-10 mt-8">
              <button className="bg-[#ff6700] hover:bg-[#e05a00] text-white font-bold px-6 py-3 rounded-full flex items-center gap-3 transition-colors shadow-md">
                View All Products
                <div className="bg-white/20 w-8 h-8 rounded-full flex items-center justify-center text-white">
                  <ArrowUpRight size={16} />
                </div>
              </button>
            </div>
            {/* Dummy Image Placeholder */}
            <div className="absolute right-0 bottom-0 top-0 w-1/2 hidden md:flex items-center justify-center pointer-events-none opacity-20 group-hover:scale-105 transition-transform duration-500">
               <Headphones size={220} className="text-[#ff6700]" />
            </div>
          </div>

          {/* Top Right Box - Popular Colors */}
          <div className="col-span-1 md:col-span-2 md:row-span-1 bg-white border border-gray-100 rounded-[2rem] p-6 flex flex-col justify-center hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
            <h3 className="font-bold text-gray-800 mb-4">Popular Colors</h3>
            <div className="flex gap-4">
              {['bg-stone-800', 'bg-blue-200', 'bg-orange-300', 'bg-emerald-300', 'bg-rose-300'].map((color, idx) => (
                <div key={idx} className={`w-10 h-10 rounded-full ${color} shadow-inner cursor-pointer hover:scale-110 transition-transform`} />
              ))}
            </div>
          </div>

          {/* Middle Right - Dummy Promo 1 */}
          <div className="col-span-1 md:row-span-1 bg-white border border-gray-100 rounded-[2rem] p-6 flex flex-col justify-center relative group overflow-hidden cursor-pointer hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
            <h3 className="text-base font-bold text-gray-800 mb-1 z-10">New Gen<br/>X-Bud</h3>
            <div className="absolute right-4 bottom-4 w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 group-hover:bg-[#ff6700] group-hover:text-white transition-colors z-10">
               <ArrowUpRight size={16} />
            </div>
            <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
              <Headphones size={120} />
            </div>
          </div>

          {/* Middle Right - Dummy Promo 2 */}
          <div className="col-span-1 md:row-span-1 bg-white border border-gray-100 rounded-[2rem] p-6 flex flex-col justify-center relative group overflow-hidden cursor-pointer hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
             <h3 className="text-base font-bold text-gray-800 mb-1 z-10">Pro Vision<br/>VR Set</h3>
             <div className="absolute right-4 top-4 w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 group-hover:bg-[#ff6700] group-hover:text-white transition-colors z-10">
               <ArrowUpRight size={16} />
            </div>
            <div className="absolute -left-4 -bottom-4 opacity-5 group-hover:scale-110 group-hover:-rotate-12 transition-all duration-300">
              <Camera size={120} />
            </div>
          </div>

          {/* Bottom Row - More Products */}
          <div className="col-span-1 bg-white border border-gray-100 rounded-[2rem] p-6 flex flex-col justify-center hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
            <h3 className="font-bold text-gray-800 mb-1">More Products</h3>
            <p className="text-xs text-gray-400 font-medium">460 plus items.</p>
            <div className="flex gap-2 mt-4">
               <div className="w-10 h-10 bg-[#f5f5f5] rounded-lg"></div>
               <div className="w-10 h-10 bg-[#f5f5f5] rounded-lg"></div>
               <div className="w-10 h-10 bg-[#f5f5f5] rounded-lg"></div>
            </div>
          </div>

          {/* Bottom Row - Download Stats */}
          <div className="col-span-1 bg-white border border-gray-100 rounded-[2rem] p-6 flex flex-col items-center justify-center hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
            <div className="w-24 h-24 rounded-full bg-stone-900 flex flex-col items-center justify-center text-white mb-3 hover:scale-110 transition-transform cursor-default">
               <span className="font-black text-2xl">5m+</span>
               <span className="text-[10px] font-bold opacity-80 uppercase tracking-wide">Downloads</span>
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-gray-600 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
              <span className="text-[#ff6700]">★</span> 4.6 reviews
            </div>
          </div>

          {/* Bottom Row - Banner */}
          <div className="col-span-1 md:col-span-2 bg-gradient-to-r from-[#2a2a2a] to-[#1a1a1a] border border-gray-800 rounded-[2rem] p-6 flex justify-between items-center relative group overflow-hidden cursor-pointer hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
            <div className="z-10">
              <div className="inline-flex items-center gap-1 bg-[#ff6700] px-2 py-1 rounded text-[10px] font-bold text-white mb-2">
                 ❤️ Popular
              </div>
              <h3 className="font-bold text-white text-lg">Listening Has<br/>Been Released</h3>
            </div>
            <div className="absolute right-6 top-6 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white group-hover:bg-[#ff6700] transition-colors z-10">
               <ArrowUpRight size={16} />
            </div>
            <div className="absolute right-0 bottom-0 opacity-10 group-hover:scale-105 transition-transform duration-300">
               <Watch size={140} color="white" />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
