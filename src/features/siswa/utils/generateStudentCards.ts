// import JsBarcode from "jsbarcode";
// import jsPDF from "jspdf";
// import QRCode from "qrcode";
// import { CardConfig } from "../type";

// const cardWidth = 86;
// const cardHeight = 54;
// const spacing = 6;
// const marginLeft = 10;
// const marginTop = 10;


// // ========================
// // HELPER: Load image sebagai base64 clean untuk jsPDF
// // ========================
// async function loadImageForPDF(src: string): Promise<{ data: string; format: string } | null> {
//   try {
//     // Jika sudah base64 dataURL
//     if (src.startsWith("data:")) {
//       const match = src.match(/^data:(image\/\w+);base64,(.+)$/);
//       if (match) {
//         const mime = match[1]; // "image/png" atau "image/jpeg"
//         const format = mime.includes("png") ? "PNG" : "JPEG";
//         // Decode ulang via canvas untuk normalize (handle transparency, dll)
//         return await normalizeImageViaCanvas(src, format);
//       }
//     }

//     // Jika URL biasa (http/blob)
//     return await normalizeImageViaCanvas(src, "PNG");
//   } catch (err) {
//     console.warn("loadImageForPDF gagal:", err);
//     return null;
//   }
// }

// async function normalizeImageViaCanvas(
//   src: string,
//   format: "PNG" | "JPEG"
// ): Promise<{ data: string; format: string } | null> {
//   return new Promise((resolve) => {
//     const img = new Image();
//     img.crossOrigin = "anonymous";
//     img.onload = () => {
//       const canvas = document.createElement("canvas");
//       canvas.width = img.naturalWidth || img.width;
//       canvas.height = img.naturalHeight || img.height;
//       const ctx = canvas.getContext("2d");
//       if (!ctx) return resolve(null);

//       // Langsung draw tanpa fill apapun — full transparent background
//       ctx.drawImage(img, 0, 0);

//       const dataUrl = canvas.toDataURL("image/png");
//       const base64 = dataUrl.split(",")[1];
//       resolve({ data: base64, format: "PNG" });
//     };
//     img.onerror = () => resolve(null);
//     img.src = src;
//   });
// }

// // ========================
// // BARCODE
// // ========================
// function generateBarcodeImage(value: string) {
//   const canvas = document.createElement("canvas");
//   JsBarcode(canvas, value, {
//     format: "CODE128",
//     width: 2,
//     height: 40,
//     displayValue: false,
//     margin: 0
//   });
//   return canvas.toDataURL("image/png");
// }

// // ========================
// function formatRFID(uid: string) {
//   if (!uid || uid === '-') return '-';
//   const clean = uid.replace(/\s/g, '');
//   return clean.match(/.{1,2}/g)?.join(' ') || clean;
// }

// // ========================
// // HEADER
// // ========================
// async function drawHeader(
//   doc: jsPDF,
//   x: number,
//   y: number,
//   config: CardConfig,
//   overrideTitle?: string
// ): Promise<number> {
//   const headerHeight = 12.5;

//   // Background
//   if (config.accentColor !== "transparent") {
//     let hex = (config.accentColor || "#2563eb").replace("#", "");
//     if (hex.length === 3) hex = hex.split("").map(c => c + c).join("");
//     const r = parseInt(hex.substring(0, 2), 16);
//     const g = parseInt(hex.substring(2, 4), 16);
//     const b = parseInt(hex.substring(4, 6), 16);
//     doc.setFillColor(r, g, b);
//     doc.rect(x, y, cardWidth, headerHeight, "F");
//   }

//   const logoSize = 8;
//   const logoY = y + 2;
  
//   // === LOGO SEKOLAH (kiri) ===
//   if (config.logoSchool) {
//     const logoData = await loadImageForPDF(config.logoSchool);
//     if (logoData) {
//       try {
//         doc.addImage(logoData.data, logoData.format, x + 5, logoY, logoSize, logoSize);
//       } catch (e) {
//         console.warn("addImage logoSchool gagal:", e);
//       }
//     }
//   }

//   // === LOGO DINAS (kanan) ===
//   if (config.logoDinas) {
//     const logoData = await loadImageForPDF(config.logoDinas);
//     if (logoData) {
//       try {
// doc.addImage(logoData.data, logoData.format, x + cardWidth - 5 - logoSize, logoY, logoSize, logoSize);


//       } catch (e) {
//         console.warn("addImage logoDinas gagal:", e);
//       }
//     }
//   }

//   // Teks tengah
//   const cx = x + cardWidth / 2;
//   const title = overrideTitle || config.title || "KARTU TANDA SISWA";

//   doc.setFont("helvetica", "bold");
//   doc.setFontSize(7.5);
//   doc.setTextColor(config.titleColor || "#ffffff");
//   doc.text(title, cx, y + 4, { align: "center" });

//   doc.setFontSize(6.5);
//   doc.setTextColor(config.subtitleColor || "#ffffff");
//   doc.text(config.subtitle || "SMK NEGERI", cx, y + 6.7, { align: "center" }); // nama sekolah


//   if (config.schoolAddress) {
//     doc.setFont("helvetica", "normal");
//     doc.setFontSize(4.5);
//     doc.setTextColor(config.subtitleColor || "#ffffff");
//     doc.text(config.schoolAddress, cx, y + 8.7, {     // alamat — lebih dekat
//       align: "center",
//       maxWidth: cardWidth - 38
//     });
//   }

//   return headerHeight;
// }

// // ========================
// // DEPAN
// // ========================
// export async function drawFront(doc, s, x, y, config, canvas, ctx) {

//   doc.setFillColor(255, 255, 255);
//   doc.rect(x, y, cardWidth, cardHeight, "F");

//   // Background image
//   if (config.bgImage) {
//       try {
//         const img = new Image();
//         img.crossOrigin = "anonymous";
//         img.src = config.bgImage;
//         await new Promise((res, rej) => { img.onload = res; img.onerror = rej; });
//         ctx.clearRect(0, 0, canvas.width, canvas.height);
//         ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
//         const cropped = canvas.toDataURL("image/jpeg", 0.7);
//         doc.addImage(cropped, "JPEG", x, y, cardWidth, cardHeight);
//       } catch {}
//     }

//     // WHITE OVERLAY — opacity lebih tinggi dari belakang kartu
//     doc.setFillColor(255, 255, 255);
//     doc.setGState(new (doc as any).GState({ opacity: 0.40 })); // ← ubah jadi:
//     doc.setGState(new (doc as any).GState({ opacity: config.bgOpacityFront ?? 0.40 }));
//     doc.rect(x, y, cardWidth, cardHeight, "F");
//     doc.setGState(new (doc as any).GState({ opacity: 1 }));

//     await drawHeader(doc, x, y, config);

//   // FOTO
//   const pX = x + 5;
//   const pY = y + 16.5;
//   const pW = 18;
//   const pH = 22;

//   // ========================
//   // BASE (BACKGROUND FOTO)
//   // ========================
//   doc.setFillColor(245, 245, 245); // abu soft biar keliatan
//   doc.rect(pX, pY, pW, pH, "F");

//   if (s.qrCodeData) {
//     const qr = await QRCode.toDataURL(s.qrCodeData, { margin: 1, width: 150 });
//     doc.addImage(qr, "PNG", x + cardWidth - 18, y + cardHeight - 18, 14, 14);
//   }

//   // ========================
//   // FOTO (JIKA ADA)
//   // ========================
//   if (s.photoUrl) {
//     try {
//       const img = new Image();
//       img.crossOrigin = "anonymous";
//       img.src = s.photoUrl;

//       await new Promise((res, rej) => {
//         img.onload = res;
//         img.onerror = rej;
//       });

//       const canvasPhoto = document.createElement("canvas");
//       const ctxPhoto = canvasPhoto.getContext("2d");

//       canvasPhoto.width = pW * 10;
//       canvasPhoto.height = pH * 10;

//       if (!ctxPhoto) throw new Error("ctx null");

//       // background putih (anti PNG transparan jadi hitam)
//       ctxPhoto.fillStyle = "#ffffff";
//       ctxPhoto.fillRect(0, 0, canvasPhoto.width, canvasPhoto.height);

//       const scale = Math.max(
//         canvasPhoto.width / img.width,
//         canvasPhoto.height / img.height
//       );

//       const newW = img.width * scale;
//       const newH = img.height * scale;

//       const dx = (canvasPhoto.width - newW) / 2;
//       const dy = (canvasPhoto.height - newH) / 2;

//       ctxPhoto.drawImage(img, dx, dy, newW, newH);

//       const finalImg = canvasPhoto.toDataURL("image/png");

//       doc.addImage(finalImg, "PNG", pX, pY, pW, pH);

//     } catch (err) {
//       console.warn("Foto gagal load", err);
//     }
//   }

//   // ========================
//   // FRAME (SELALU ADA)
//   // ========================
//   doc.setDrawColor(30, 41, 59); // Hitam  
//   doc.setLineWidth(0.5);
//   doc.rect(pX, pY, pW, pH);

//   // TEXT
//   doc.setTextColor(30, 41, 59);
//   doc.setFont("helvetica", "bold");   // ← tambah
//   doc.setFontSize(8);
//   doc.text((s.name || "").toUpperCase(), x + 27, y + 21, { maxWidth: 50 });
//   doc.setFont("helvetica", "normal"); // ← reset

//   doc.setFontSize(7);
//   doc.text(`NIS: ${s.nis || "-"}`, x + 27, y + 27);
//   doc.text(`KLS: ${s.class || "-"}`, x + 27, y + 31);
//   doc.text(`RFID: ${formatRFID(s.rfidUid || '-')}`, x + 27, y + 35);

//   // ✅ BARCODE (TETAP DI DEPAN)
//   if (s.nis) {
//     const barcode = generateBarcodeImage(s.nis);
//     doc.addImage(barcode, "PNG", x + 6, y + cardHeight - 11.3, 35, 6);

//     doc.setFontSize(5);
//     doc.text(s.nis, x + 23, y + cardHeight - 2.3, { align: "center" });
//   }

//   doc.setDrawColor(200);
//   doc.rect(x, y, cardWidth, cardHeight);
// }

// export async function drawBack(doc, s, x, y, config, canvas, ctx) {

//   // BASE PUTIH
//   doc.setFillColor(255, 255, 255);
//   doc.rect(x, y, cardWidth, cardHeight, "F");

//   // BACKGROUND IMAGE
//   if (config.bgImage) {
//     try {
//       const img = new Image();
//       img.crossOrigin = "anonymous";
//       img.src = config.bgImage;
//       await new Promise((res, rej) => { img.onload = res; img.onerror = rej; });
//       ctx.clearRect(0, 0, canvas.width, canvas.height);
//       ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
//       const cropped = canvas.toDataURL("image/jpeg", 0.7);
//       doc.addImage(cropped, "JPEG", x, y, cardWidth, cardHeight);
//     } catch (e) {
//       console.warn("BG belakang gagal load", e);
//     }
//   }

//   // WHITE OVERLAY dengan opacity custom
//   const backOpacity = config.bgOpacityBack ?? 0.40;
//   doc.setFillColor(255, 255, 255);
//   doc.setGState(new (doc as any).GState({ opacity: backOpacity }));
//   doc.rect(x, y, cardWidth, cardHeight, "F");
//   doc.setGState(new (doc as any).GState({ opacity: 1 })); // reset

//   // KONTEN VISI & MISI
//   const vm = config.visionMission;
//   const contentX = x + 5;
//   const contentMaxW = cardWidth - 10;
//   let cursorY = y + 9;

//   // VISI
//   if (vm?.vision) {
//     // Judul VISI
//     doc.setFont("helvetica", "bold");
//     doc.setFontSize(config.vmTitleFontSize || 7);
//     doc.setTextColor(config.vmTitleColor || "#000000");
//     doc.text("VISI", contentX, cursorY);
//     cursorY += 3.2;

//     // Isi Visi
//     doc.setFont("helvetica", "normal");
//     doc.setFontSize(config.vmVisionFontSize || 6);
//     doc.setTextColor(config.vmTextColor || "#1e293b");
//     const visionLines = doc.splitTextToSize(vm.vision, contentMaxW);
//     doc.text(visionLines, contentX, cursorY);
//     cursorY += visionLines.length * 3 + 2;
//   }

//   // MISI
//   if (vm?.missions?.length > 0) {
//     // Judul MISI
//     doc.setFont("helvetica", "bold");
//     doc.setFontSize(config.vmTitleFontSize || 7);
//     doc.setTextColor(config.vmTitleColor || "#000000");
//     doc.text("MISI", contentX, cursorY);
//     cursorY += 3.2;

//     // Isi Misi
//     doc.setFont("helvetica", "normal");
//     doc.setFontSize(config.vmMissionFontSize || 5.5);
//     doc.setTextColor(config.vmTextColor || "#1e293b");

//     const maxMisi = Math.min(vm.missions.length, 5);
//     const bulletStyle = config.missionBulletStyle ?? "number";

//     const getBullet = (index: number): string => {
//       switch (bulletStyle) {
//         case "dot":   return "• ";
//         case "dash":  return "— ";
//         case "arrow": return "→ ";
//         case "number":
//         default:      return `${index + 1}. `;
//       }
//     };

//     const missionSpacing = config.missionSpacing ?? 2.6;
//     const fontSize = config.vmMissionFontSize || 5.5;

//     // Konversi font size pt → mm (1pt = 0.3528mm), lalu kali multiplier
//     const baseLineHeight = fontSize * 0.3528;
//     const lineHeightMm = baseLineHeight + (missionSpacing - 2) * 0.6;

//     for (let i = 0; i < maxMisi; i++) {
//       if (cursorY > y + cardHeight - 5) break;
//       const misiText = `${getBullet(i)}${vm.missions[i]}`;
//       const misiLines = doc.splitTextToSize(misiText, contentMaxW - 3);
//       doc.text(misiLines, contentX + 1, cursorY);
//       cursorY += misiLines.length * lineHeightMm;
//     }
//   }

//   // Fallback jika kosong
//   if (!vm?.vision && (!vm?.missions || vm.missions.length === 0)) {
//     doc.setFont("helvetica", "normal");
//     doc.setFontSize(6);
//     doc.setTextColor(180, 180, 180);
//     doc.text("Visi & Misi belum diisi", x + cardWidth / 2, y + cardHeight / 2, { align: "center" });
//   }

//   doc.setDrawColor(200);
//   doc.rect(x, y, cardWidth, cardHeight);
// }

// export async function generateStudentCardsPDF(students, config, onProgress) {

//   if (!students.length) throw new Error("Tidak ada data siswa");

//   const doc = new jsPDF("p", "mm", "a4");

//   const canvas = document.createElement("canvas");
//   canvas.width = 860;
//   canvas.height = 540;
//   const ctx = canvas.getContext("2d");

//   const perPage = 8;
//   const totalPages = Math.ceil(students.length / perPage);

//   for (let page = 0; page < totalPages; page++) {

//     // ========================
//     // HALAMAN DEPAN
//     // ========================
//     if (page > 0) doc.addPage();

//     for (let i = 0; i < perPage; i++) {
//       const index = page * perPage + i;
//       if (index >= students.length) break;

//       const s = students[index];

//       const col = i % 2;
//       const row = Math.floor(i / 2);

//       const x = marginLeft + col * (cardWidth + spacing);
//       const y = marginTop + row * (cardHeight + spacing);

//       await drawFront(doc, s, x, y, config, canvas, ctx);
//     }

//     // ========================
//     // HALAMAN BELAKANG (LANGSUNG SETELAH DEPAN)
//     // ========================
//     doc.addPage();

//     for (let i = 0; i < perPage; i++) {
//       const index = page * perPage + i;
//       if (index >= students.length) break;

//       const s = students[index];

//       const col = i % 2;
//       const row = Math.floor(i / 2);

//       // 🔥 MIRROR posisi
//       const mirroredCol = 1 - col;

//       const x = marginLeft + mirroredCol * (cardWidth + spacing);
//       const y = marginTop + row * (cardHeight + spacing);

//       await drawBack(doc, s, x, y, config, canvas, ctx);
//     }

//     // progress (opsional)
//     if (onProgress) {
//       onProgress(Math.round(((page + 1) / totalPages) * 100));
//     }
//   }

//   doc.save(`KARTU_SISWA_${students.length}.pdf`);
// }




import JsBarcode from "jsbarcode";
import jsPDF from "jspdf";
import QRCode from "qrcode";
import { CardConfig } from "../type";

const cardWidth = 86;
const cardHeight = 54;
const spacing = 6;
const marginLeft = 10;
const marginTop = 10;


// ========================
// HELPER: Load image sebagai base64 clean untuk jsPDF
// ========================
async function loadImageForPDF(src: string): Promise<{ data: string; format: string } | null> {
  try {
    // Jika sudah base64 dataURL
    if (src.startsWith("data:")) {
      const match = src.match(/^data:(image\/\w+);base64,(.+)$/);
      if (match) {
        const mime = match[1]; // "image/png" atau "image/jpeg"
        const format = mime.includes("png") ? "PNG" : "JPEG";
        // Decode ulang via canvas untuk normalize (handle transparency, dll)
        return await normalizeImageViaCanvas(src, format);
      }
    }

    // Jika URL biasa (http/blob)
    return await normalizeImageViaCanvas(src, "PNG");
  } catch (err) {
    console.warn("loadImageForPDF gagal:", err);
    return null;
  }
}

async function normalizeImageViaCanvas(
  src: string,
  format: "PNG" | "JPEG"
): Promise<{ data: string; format: string } | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth || img.width;
      canvas.height = img.naturalHeight || img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return resolve(null);

      // Langsung draw tanpa fill apapun — full transparent background
      ctx.drawImage(img, 0, 0);

      const dataUrl = canvas.toDataURL("image/png");
      const base64 = dataUrl.split(",")[1];
      resolve({ data: base64, format: "PNG" });
    };
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

// ========================
// BARCODE
// ========================
function generateBarcodeImage(value: string) {
  const canvas = document.createElement("canvas");
  JsBarcode(canvas, value, {
    format: "CODE128",
    width: 2,
    height: 40,
    displayValue: false,
    margin: 0
  });
  return canvas.toDataURL("image/png");
}

// ========================
function formatRFID(uid: string) {
  if (!uid || uid === '-') return '-';
  const clean = uid.replace(/\s/g, '');
  return clean.match(/.{1,2}/g)?.join(' ') || clean;
}

// ========================
// HEADER
// ========================
async function drawHeader(
  doc: jsPDF,
  x: number,
  y: number,
  config: CardConfig,
  overrideTitle?: string
): Promise<number> {
  const headerHeight = 12.5;

  // Background
  if (config.accentColor !== "transparent") {
    let hex = (config.accentColor || "#2563eb").replace("#", "");
    if (hex.length === 3) hex = hex.split("").map(c => c + c).join("");
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    doc.setFillColor(r, g, b);
    doc.rect(x, y, cardWidth, headerHeight, "F");
  }

  const logoSize = 8;
  const logoY = y + 2;
  
  // === LOGO SEKOLAH (kiri) ===
  if (config.logoSchool) {
    const logoData = await loadImageForPDF(config.logoSchool);
    if (logoData) {
      try {
        doc.addImage(logoData.data, logoData.format, x + 5, logoY, logoSize, logoSize);
      } catch (e) {
        console.warn("addImage logoSchool gagal:", e);
      }
    }
  }

  // === LOGO DINAS (kanan) ===
  if (config.logoDinas) {
    const logoData = await loadImageForPDF(config.logoDinas);
    if (logoData) {
      try {
doc.addImage(logoData.data, logoData.format, x + cardWidth - 5 - logoSize, logoY, logoSize, logoSize);


      } catch (e) {
        console.warn("addImage logoDinas gagal:", e);
      }
    }
  }

  // Teks tengah
  const cx = x + cardWidth / 2;
  const title = overrideTitle || config.title || "KARTU TANDA SISWA";

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(config.titleColor || "#ffffff");
  doc.text(title, cx, y + 4, { align: "center" });

  doc.setFontSize(6.5);
  doc.setTextColor(config.subtitleColor || "#ffffff");
  doc.text(config.subtitle || "SMK NEGERI", cx, y + 6.7, { align: "center" }); // nama sekolah


  if (config.schoolAddress) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(4.5);
    doc.setTextColor(config.subtitleColor || "#ffffff");
    doc.text(config.schoolAddress, cx, y + 8.7, {     // alamat — lebih dekat
      align: "center",
      maxWidth: cardWidth - 38
    });
  }

  return headerHeight;
}

// ========================
// DEPAN
// ========================
export async function drawFront(doc, s, x, y, config, canvas, ctx) {

  doc.setFillColor(255, 255, 255);
  doc.rect(x, y, cardWidth, cardHeight, "F");

  // Background image
  if (config.bgImage) {
      try {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = config.bgImage;
        await new Promise((res, rej) => { img.onload = res; img.onerror = rej; });
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const cropped = canvas.toDataURL("image/jpeg", 0.7);
        doc.addImage(cropped, "JPEG", x, y, cardWidth, cardHeight);
      } catch {}
    }

    // WHITE OVERLAY — opacity lebih tinggi dari belakang kartu
    doc.setFillColor(255, 255, 255);
    doc.setGState(new (doc as any).GState({ opacity: 0.40 })); // ← ubah jadi:
    doc.setGState(new (doc as any).GState({ opacity: config.bgOpacityFront ?? 0.40 }));
    doc.rect(x, y, cardWidth, cardHeight, "F");
    doc.setGState(new (doc as any).GState({ opacity: 1 }));

    await drawHeader(doc, x, y, config);

  // FOTO
  const pX = x + 5;
  const pY = y + 16.5;
  const pW = 18;
  const pH = 22;

  // ========================
  // BASE (BACKGROUND FOTO)
  // ========================
  doc.setFillColor(245, 245, 245); // abu soft biar keliatan
  doc.rect(pX, pY, pW, pH, "F");

  if (s.qrCodeData) {
    const qr = await QRCode.toDataURL(s.qrCodeData, { margin: 1, width: 150 });
    doc.addImage(qr, "PNG", x + cardWidth - 18, y + cardHeight - 18, 14, 14);
  }

  // ========================
  // FOTO (JIKA ADA)
  // ========================
  if (s.photoUrl) {
    try {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = s.photoUrl;

      await new Promise((res, rej) => {
        img.onload = res;
        img.onerror = rej;
      });

      const canvasPhoto = document.createElement("canvas");
      const ctxPhoto = canvasPhoto.getContext("2d");

      canvasPhoto.width = pW * 10;
      canvasPhoto.height = pH * 10;

      if (!ctxPhoto) throw new Error("ctx null");

      // background putih (anti PNG transparan jadi hitam)
      ctxPhoto.fillStyle = "#ffffff";
      ctxPhoto.fillRect(0, 0, canvasPhoto.width, canvasPhoto.height);

      const scale = Math.max(
        canvasPhoto.width / img.width,
        canvasPhoto.height / img.height
      );

      const newW = img.width * scale;
      const newH = img.height * scale;

      const dx = (canvasPhoto.width - newW) / 2;
      const dy = (canvasPhoto.height - newH) / 2;

      ctxPhoto.drawImage(img, dx, dy, newW, newH);

      const finalImg = canvasPhoto.toDataURL("image/png");

      doc.addImage(finalImg, "PNG", pX, pY, pW, pH);

    } catch (err) {
      console.warn("Foto gagal load", err);
    }
  }

  // ========================
  // FRAME (SELALU ADA)
  // ========================
  doc.setDrawColor(30, 41, 59); // Hitam  
  doc.setLineWidth(0.5);
  doc.rect(pX, pY, pW, pH);

  // TEXT
 // TEXT - BAGIAN YANG SUDAH DIPERBAIKI
  doc.setTextColor(30, 41, 59);

  // NAMA SISWA
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text((s.name || "").toUpperCase(), x + 27, y + 21, { maxWidth: 50 });

  // NIS & NISN (Didekatkan ke Nama)
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.5);
  
  // NIS sekarang hanya berjarak 4 unit dari Nama (sebelumnya 6.5)
  doc.text(`NIS : ${s.nis || "-"}`, x + 27, y + 25);

  if (s.nisn) {
    doc.text(`NISN: ${s.nisn}`, x + 27, y + 28.5);
  } else {
    doc.text(`NISN: -`, x + 27, y + 28.5);
  }

  // Kelas + Jenis Kelamin
  doc.text(`KLS : ${s.class || "-"}`, x + 27, y + 32);

  const genderText = s.gender === "L" || s.gender?.toLowerCase() === "laki-laki" 
    ? "Laki-laki" 
    : s.gender === "P" || s.gender?.toLowerCase() === "perempuan" 
      ? "Perempuan" 
      : (s.gender || "-");

  doc.text(`JK  : ${genderText}`, x + 27, y + 35.5);

  // Alamat
  if (s.address) {
    doc.setFontSize(5.8);
    const addressLines = doc.splitTextToSize(`Alamat: ${s.address}`, 48);
    // Alamat juga dinaikkan agar tidak terlalu jauh
    doc.text(addressLines, x + 27, y + 39.5, { maxWidth: 48 });
  }

  // BARCODE tetap di posisi bawah
  if (s.nis) {
    const barcode = generateBarcodeImage(s.nis);
    doc.addImage(barcode, "PNG", x + 6, y + cardHeight - 11.3, 35, 6);

    doc.setFontSize(5);
    doc.text(s.nis, x + 23, y + cardHeight - 2.3, { align: "center" });
  }

  doc.setDrawColor(200);
  doc.rect(x, y, cardWidth, cardHeight);
}

export async function drawBack(doc, s, x, y, config, canvas, ctx) {

  // BASE PUTIH
  doc.setFillColor(255, 255, 255);
  doc.rect(x, y, cardWidth, cardHeight, "F");

  // BACKGROUND IMAGE
  if (config.bgImage) {
    try {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = config.bgImage;
      await new Promise((res, rej) => { img.onload = res; img.onerror = rej; });
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const cropped = canvas.toDataURL("image/jpeg", 0.7);
      doc.addImage(cropped, "JPEG", x, y, cardWidth, cardHeight);
    } catch (e) {
      console.warn("BG belakang gagal load", e);
    }
  }

  // WHITE OVERLAY dengan opacity custom
  const backOpacity = config.bgOpacityBack ?? 0.40;
  doc.setFillColor(255, 255, 255);
  doc.setGState(new (doc as any).GState({ opacity: backOpacity }));
  doc.rect(x, y, cardWidth, cardHeight, "F");
  doc.setGState(new (doc as any).GState({ opacity: 1 })); // reset

  // KONTEN VISI & MISI
  const vm = config.visionMission;
  const contentX = x + 5;
  const contentMaxW = cardWidth - 10;
  let cursorY = y + 9;

  // VISI
  if (vm?.vision) {
    // Judul VISI
    doc.setFont("helvetica", "bold");
    doc.setFontSize(config.vmTitleFontSize || 7);
    doc.setTextColor(config.vmTitleColor || "#000000");
    doc.text("VISI", contentX, cursorY);
    cursorY += 3.2;

    // Isi Visi
    doc.setFont("helvetica", "normal");
    doc.setFontSize(config.vmVisionFontSize || 6);
    doc.setTextColor(config.vmTextColor || "#1e293b");
    const visionLines = doc.splitTextToSize(vm.vision, contentMaxW);
    doc.text(visionLines, contentX, cursorY);
    cursorY += visionLines.length * 3 + 2;
  }

  // MISI
  if (vm?.missions?.length > 0) {
    // Judul MISI
    doc.setFont("helvetica", "bold");
    doc.setFontSize(config.vmTitleFontSize || 7);
    doc.setTextColor(config.vmTitleColor || "#000000");
    doc.text("MISI", contentX, cursorY);
    cursorY += 3.2;

    // Isi Misi
    doc.setFont("helvetica", "normal");
    doc.setFontSize(config.vmMissionFontSize || 5.5);
    doc.setTextColor(config.vmTextColor || "#1e293b");

    const maxMisi = Math.min(vm.missions.length, 5);
    const bulletStyle = config.missionBulletStyle ?? "number";

    const getBullet = (index: number): string => {
      switch (bulletStyle) {
        case "dot":   return "• ";
        case "dash":  return "— ";
        case "arrow": return "→ ";
        case "number":
        default:      return `${index + 1}. `;
      }
    };

    const missionSpacing = config.missionSpacing ?? 2.6;
    const fontSize = config.vmMissionFontSize || 5.5;

    // Konversi font size pt → mm (1pt = 0.3528mm), lalu kali multiplier
    const baseLineHeight = fontSize * 0.3528;
    const lineHeightMm = baseLineHeight + (missionSpacing - 2) * 0.6;

    for (let i = 0; i < maxMisi; i++) {
      if (cursorY > y + cardHeight - 5) break;
      const misiText = `${getBullet(i)}${vm.missions[i]}`;
      const misiLines = doc.splitTextToSize(misiText, contentMaxW - 3);
      doc.text(misiLines, contentX + 1, cursorY);
      cursorY += misiLines.length * lineHeightMm;
    }
  }

  // Fallback jika kosong
  if (!vm?.vision && (!vm?.missions || vm.missions.length === 0)) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6);
    doc.setTextColor(180, 180, 180);
    doc.text("Visi & Misi belum diisi", x + cardWidth / 2, y + cardHeight / 2, { align: "center" });
  }

  doc.setDrawColor(200);
  doc.rect(x, y, cardWidth, cardHeight);
}

export async function generateStudentCardsPDF(students, config, onProgress) {

  if (!students.length) throw new Error("Tidak ada data siswa");

  const doc = new jsPDF("p", "mm", "a4");

  const canvas = document.createElement("canvas");
  canvas.width = 860;
  canvas.height = 540;
  const ctx = canvas.getContext("2d");

  const perPage = 8;
  const totalPages = Math.ceil(students.length / perPage);

  for (let page = 0; page < totalPages; page++) {

    // ========================
    // HALAMAN DEPAN
    // ========================
    if (page > 0) doc.addPage();

    for (let i = 0; i < perPage; i++) {
      const index = page * perPage + i;
      if (index >= students.length) break;

      const s = students[index];

      const col = i % 2;
      const row = Math.floor(i / 2);

      const x = marginLeft + col * (cardWidth + spacing);
      const y = marginTop + row * (cardHeight + spacing);

      await drawFront(doc, s, x, y, config, canvas, ctx);
    }

    // ========================
    // HALAMAN BELAKANG (LANGSUNG SETELAH DEPAN)
    // ========================
    doc.addPage();

    for (let i = 0; i < perPage; i++) {
      const index = page * perPage + i;
      if (index >= students.length) break;

      const s = students[index];

      const col = i % 2;
      const row = Math.floor(i / 2);

      // 🔥 MIRROR posisi
      const mirroredCol = 1 - col;

      const x = marginLeft + mirroredCol * (cardWidth + spacing);
      const y = marginTop + row * (cardHeight + spacing);

      await drawBack(doc, s, x, y, config, canvas, ctx);
    }

    // progress (opsional)
    if (onProgress) {
      onProgress(Math.round(((page + 1) / totalPages) * 100));
    }
  }

  doc.save(`KARTU_SISWA_${students.length}.pdf`);
}