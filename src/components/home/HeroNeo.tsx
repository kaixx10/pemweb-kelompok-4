"use client";

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import Image from 'next/image';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

export default function HeroNeo() {
 const slides = [
    {
      id: 1,
      image: "https://i02.appmifile.com/mi-com-product/fly-birds/redmi-note-15-pro-plus-5g/pc/1e62d6973df9124095c38d8ed31b142a.jpg", 
      title: "Redmi Note 15 Pro",
      desc: "It's titan tough",
      textColor: "text-black" 
    },
    {
      id: 2,
      image: "https://i02.appmifile.com/mi-com-product/fly-birds/xiaomi-pad-8-pro/pc/b7b6475648c1d20e117ff53cf305c957.jpg", 
      title: "Xiaomi Pad 8 Pro",
      desc: "Powerfully productive",
      textColor: "text-white" 
    }
  ];

  return (
    <section className="w-full bg-white relative group/section">
      
      <style dangerouslySetInnerHTML={{__html: `
        /* 1. Variabel Sistem Swiper untuk Memaksa Panah Mengecil */
        .mySwiper {
          --swiper-navigation-size: 16px !important; 
        }

        /* Gaya Lingkaran Panah Kiri Kanan */
        .swiper-button-next, .swiper-button-prev {
          background-color: rgba(0, 0, 0, 0.25) !important;
          color: white !important;
          width: 36px !important;
          height: 36px !important;
          border-radius: 50% !important;
          backdrop-filter: blur(4px) !important;
          transition: background-color 0.3s ease !important;
          opacity: 0;
        }
        
        section:hover .swiper-button-next, 
        section:hover .swiper-button-prev {
          opacity: 1;
        }

        .swiper-button-next:hover, .swiper-button-prev:hover {
          background-color: rgba(0, 0, 0, 0.6) !important;
        }

        /* Gaya Indikator Garis Bawah */
        .swiper-pagination-bullets {
          bottom: 20px !important;
        }

        .swiper-pagination-bullet {
          width: 40px !important;
          height: 4px !important;
          border-radius: 4px !important;
          background-color: rgba(255, 255, 255, 0.4) !important;
          opacity: 1 !important;
          margin: 0 4px !important;
          transition: all 0.3s ease !important;
        }

        .swiper-pagination-bullet-active {
          width: 40px !important;
          background-color: #ffffff !important; 
        }
      `}} />

      <div className="max-w-[1440px] mx-auto px-0 md:px-10 py-0 md:py-4">
        <Swiper
          spaceBetween={0}
          centeredSlides={true}
          autoplay={{
            delay: 5000, 
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
          }}
          navigation={true}
          modules={[Autoplay, Pagination, Navigation]}
          className="mySwiper rounded-none md:rounded-[2rem] overflow-hidden shadow-sm h-[400px] md:h-[500px] lg:h-[600px]"
        >
          {slides.map((slide) => (
            <SwiperSlide key={slide.id}>
              <div className="relative w-full h-full cursor-pointer">
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  className="object-cover"
                  priority
                />
                
                {/* 2. Container Teks diubah posisinya ke KIRI TENGAH (justify-center items-start text-left) */}
                <div className={`absolute inset-0 flex flex-col justify-center items-start text-left px-10 md:px-20 ${slide.textColor}`}>
                  
                  {/* 3. Teks 'text-white' dihapus dari sini agar mengikuti textColor */}
                  <h2 className="text-3xl md:text-5xl font-bold mb-2 drop-shadow-md">
                    {slide.title}
                  </h2>
                  <p className="text-lg font-medium drop-shadow-sm">
                    {slide.desc}
                  </p>

                </div>

              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}