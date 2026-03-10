// src/lib/pdf/generateStudentCards.ts
import jsPDF from "jspdf";
import QRCode from "qrcode";
import { CardConfig, Student } from "../type";

export async function generateStudentCardsPDF(
  students: Student[],
  config: CardConfig,
  onProgress?: (percent: number) => void
): Promise<void> {
  if (students.length === 0) throw new Error("Tidak ada data siswa");

  const doc = new jsPDF("p", "mm", "a4");
  const cardWidth = 86;
  const cardHeight = 54;
  const spacing = 6;
  const marginLeft = 10;
  const marginTop = 10;

  const canvas = document.createElement("canvas");
  canvas.width = 860;
  canvas.height = 540;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Cannot create canvas context");

  for (let i = 0; i < students.length; i++) {
    if (onProgress) {
      onProgress(Math.round(((i + 1) / students.length) * 100));
    }

    const s = students[i];
    const idxInPage = i % 8;
    const col = idxInPage % 2;
    const row = Math.floor(idxInPage / 2);

    if (i > 0 && idxInPage === 0) doc.addPage();

    const x = marginLeft + col * (cardWidth + spacing);
    const y = marginTop + row * (cardHeight + spacing);

    // Background putih dasar
    doc.setFillColor(255, 255, 255);
    doc.rect(x, y, cardWidth, cardHeight, "F");

    // Background image (jika ada)
    if (config.bgImage) {
      try {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = config.bgImage;
        await new Promise((res, rej) => {
          img.onload = res;
          img.onerror = rej;
        });
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const cropped = canvas.toDataURL("image/jpeg", 0.7);
        doc.addImage(cropped, "JPEG", x, y, cardWidth, cardHeight);
      } catch (e) {
        console.warn("Gagal load background", e);
      }
    }

    // Header
    doc.setFillColor(config.accentColor || "#2563eb");
    doc.rect(x, y, cardWidth, 12, "F");
    doc.setTextColor(config.titleColor || "#ffffff");
    doc.setFontSize(9);
    doc.text(config.title || "KARTU PELAJAR", x + cardWidth / 2, y + 6, { align: "center" });
    doc.setFontSize(6);
    doc.setTextColor(config.subtitleColor || "#ffffff");
    doc.text(config.subtitle || "SMK NEGERI PRO DIGITAL", x + cardWidth / 2, y + 10, { align: "center" });

    // Foto siswa
    const pX = x + 5;
    const pY = y + 15;
    const pW = 18;
    const pH = 22;
    if (s.photoUrl) {
      try {
        doc.addImage(s.photoUrl, "JPEG", pX, pY, pW, pH);
      } catch {
        doc.setFillColor(240, 240, 240);
        doc.rect(pX, pY, pW, pH, "F");
      }
    } else {
      doc.setFillColor(240, 240, 240);
      doc.rect(pX, pY, pW, pH, "F");
    }

    // Info teks
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(8);
    doc.text((s.name || "").toUpperCase(), x + 27, y + 21, { maxWidth: 50 });
    doc.setFontSize(7);
    doc.text(`NIS: ${s.nis || "-"}`, x + 27, y + 27);
    doc.text(`KLS: ${s.class || "-"}`, x + 27, y + 31);

    // QR Code
    try {
      const qrData = s.qrCodeData || `ID-${s.id}`;
      const qr = await QRCode.toDataURL(qrData, { margin: 1, width: 100 });
      doc.addImage(qr, "PNG", x + 65, y + 32, 16, 16);
    } catch (e) {
      console.warn("Gagal generate QR", e);
    }

    // Border
    doc.setDrawColor(200, 200, 200);
    doc.rect(x, y, cardWidth, cardHeight, "D");
  }

  doc.save(`KARTU_SEMUA_SISWA_${students.length}.pdf`);
}