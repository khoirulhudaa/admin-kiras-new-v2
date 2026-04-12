import React from 'react';

const MaintenanceWrapper = ({ children, isMaintenance = true, message = "🚧 sedang perbaikan" }) => {
  // Jika tidak sedang perbaikan, tampilkan children apa adanya
  if (!isMaintenance) return children;

  return (
    <div className="relative cursor-not-allowed group w-fit">
      {/* Tooltip Popup */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-3 py-2 bg-black/90 text-white text-[11px] rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap shadow-xl border border-white/10 z-50">
        {message}
        {/* Segitiga kecil */}
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-[6px] border-transparent border-t-black/90"></div>
      </div>

      {/* Konten yang di-disable */}
      <div className="cursor-not-allowed opacity-60 grayscale pointer-events-none">
        {React.cloneElement(children, { 
          disabled: true,
          // Mencegah onClick jika children adalah tombol
          onClick: (e) => e.preventDefault() 
        })}
      </div>
    </div>
  );
};

export default MaintenanceWrapper;