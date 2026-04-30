"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Memperbaiki masalah path ikon default Leaflet di Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Custom Icon bergaya Neo Store
const customMarkerIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface AddressMapProps {
  initialPosition: { lat: number; lng: number } | null;
  onPositionChange: (pos: { lat: number; lng: number }) => void;
}

export default function AddressMap({ initialPosition, onPositionChange }: AddressMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerInstanceRef = useRef<L.Marker | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);

  // Koordinat Monas (Jakarta) sebagai fallback default
  const defaultCenter: L.LatLngTuple = [-6.1751, 106.8272];
  const center = initialPosition ? [initialPosition.lat, initialPosition.lng] as L.LatLngTuple : defaultCenter;

  useEffect(() => {
    // Hindari inisialisasi ganda
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // 1. Buat peta
    const map = L.map(mapContainerRef.current).setView(center, 14);
    mapInstanceRef.current = map;

    // 2. Tambahkan layer Google Maps (Super Canggih & Lengkap dengan titik POI)
    L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      attribution: '&copy; Google Maps'
    }).addTo(map);

    // 3. Tambahkan marker awal jika sudah ada
    if (initialPosition) {
      markerInstanceRef.current = L.marker(center, { icon: customMarkerIcon }).addTo(map);
    }

    // 4. Tangkap event klik untuk memindahkan marker
    map.on('click', (e) => {
      const { lat, lng } = e.latlng;
      
      // Update state ke parent (AddressPage)
      onPositionChange({ lat, lng });

      // Sembunyikan overlay teks
      if (overlayRef.current) overlayRef.current.style.display = 'none';

      // Pindahkan atau buat marker
      if (!markerInstanceRef.current) {
        markerInstanceRef.current = L.marker([lat, lng], { icon: customMarkerIcon }).addTo(map);
      } else {
        markerInstanceRef.current.setLatLng([lat, lng]);
      }
    });

    // 5. Cleanup sempurna saat komponen unmount (Solusi mutlak untuk Next.js Turbopack)
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []); // Hanya dijalankan 1x saat komponen dipasang ke DOM

  // Fungsi Deteksi GPS Otomatis (GeoLocation)
  const locateUser = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          
          onPositionChange({ lat, lng });
          
          if (overlayRef.current) overlayRef.current.style.display = 'none';

          if (mapInstanceRef.current) {
            mapInstanceRef.current.flyTo([lat, lng], 15, { animate: true, duration: 1.5 });
            
            if (!markerInstanceRef.current) {
              markerInstanceRef.current = L.marker([lat, lng], { icon: customMarkerIcon }).addTo(mapInstanceRef.current);
            } else {
              markerInstanceRef.current.setLatLng([lat, lng]);
            }
          }
        },
        (err) => {
          alert("Gagal mendeteksi lokasi GPS Anda. Silakan klik/geser peta secara manual.");
        }
      );
    }
  };

  // Debounce effect untuk pencarian real-time
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchQuery.trim().length < 3) {
        setSearchResults([]);
        return;
      }

      setIsSearching(true);
      try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&countrycodes=id&limit=5`);
        const data = await response.json();
        
        if (data && data.length > 0) {
          setSearchResults(data);
        } else {
          setSearchResults([]);
        }
      } catch (error) {
        console.error("Geocoding error:", error);
      } finally {
        setIsSearching(false);
      }
    }, 600); // Tunggu 600ms setelah user berhenti mengetik

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Handle Enter pada form
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Jika ada hasil di dropdown, otomatis pilih yang pertama
    if (searchResults.length > 0) {
      handleSelectLocation(searchResults[0]);
    }
  };

  // Fungsi saat pengguna memilih salah satu hasil pencarian
  const handleSelectLocation = (result: any) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);
    
    onPositionChange({ lat, lng });
    setSearchQuery(result.display_name); // Set input dengan nama lengkap lokasi
    setSearchResults([]); // Sembunyikan dropdown
    
    if (overlayRef.current) overlayRef.current.style.display = 'none';

    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([lat, lng], 17, { animate: true, duration: 1.5 });
      if (!markerInstanceRef.current) {
        markerInstanceRef.current = L.marker([lat, lng], { icon: customMarkerIcon }).addTo(mapInstanceRef.current);
      } else {
        markerInstanceRef.current.setLatLng([lat, lng]);
      }
    }
  };

  return (
    <div className="w-full relative rounded-2xl overflow-hidden border border-gray-200 shadow-sm" style={{ height: "450px" }}>
      
      {/* Search Bar Overlay */}
      <div className="absolute top-4 left-4 z-[400] w-full max-w-sm pr-16 md:pr-4">
        <form onSubmit={handleSearchSubmit} className="flex bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden relative">
          <input 
            type="text" 
            placeholder="Ketik lokasi (Cth: SMA 4 Jakarta)" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-grow px-4 py-3 outline-none text-sm font-medium text-gray-800"
          />
          <button 
            type="submit" 
            className="bg-[#ff6700] hover:bg-[#ff6700]/90 text-white px-5 font-bold text-sm transition-colors flex items-center justify-center"
          >
            {isSearching ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : (
              "Cari"
            )}
          </button>
        </form>

        {/* Dropdown Hasil Pencarian */}
        {searchResults.length > 0 && (
          <ul className="mt-2 bg-white rounded-xl shadow-xl border border-gray-100 max-h-60 overflow-y-auto divide-y divide-gray-100">
            {searchResults.map((result, index) => (
              <li 
                key={index}
                onClick={() => handleSelectLocation(result)}
                className="px-4 py-3 hover:bg-orange-50 cursor-pointer transition-colors text-sm text-gray-700"
              >
                <div className="font-bold text-gray-900 line-clamp-1">{result.name || result.display_name.split(',')[0]}</div>
                <div className="text-xs text-gray-500 line-clamp-1 mt-0.5">{result.display_name}</div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <button 
        onClick={(e) => {
          e.preventDefault();
          locateUser();
        }}
        className="absolute bottom-6 right-4 z-[400] bg-white text-gray-800 px-4 py-3 rounded-xl shadow-lg font-bold text-sm border border-gray-100 hover:bg-gray-50 flex items-center gap-2 transition-colors"
      >
        📍 Lokasi Saat Ini
      </button>

      {/* Kontainer Peta Asli */}
      <div ref={mapContainerRef} style={{ height: "100%", width: "100%", zIndex: 1 }} />

      {/* Overlay panduan */}
      {!initialPosition && (
        <div ref={overlayRef} className="absolute inset-0 flex items-center justify-center z-[400] bg-white/50 backdrop-blur-sm pointer-events-none transition-opacity duration-300">
          <p className="bg-[#ff6700] text-white px-6 py-3 rounded-full font-bold shadow-lg animate-bounce">
            Klik Peta Untuk Menentukan Titik Alamat 👇
          </p>
        </div>
      )}
    </div>
  );
}
