// src/components/student/types.ts
export interface Student {
  id: number;
  name: string;
  nis: string;
  class: string;
  batch: string;
  nisn: string;
  gender: string;
  nik: string;
  rfidUid: string;
  birthPlace: string;
  birthDate: string;
  photoUrl: string;
  qrCodeData: string;
  statusKehadiran: "Hadir" | "Belum Hadir" | "Izin" | "Sakit" | "Alpha";
}

export interface CardConfig {
  title: string;
  subtitle: string;
  accentColor: string;
  titleColor: string;
  subtitleColor: string;
  bgImage: string | null;
}

export interface GraduationData {
  year: number;
  note: string;
  batch: string;
}