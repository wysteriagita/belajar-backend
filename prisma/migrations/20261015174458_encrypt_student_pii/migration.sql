-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('LAKI_LAKI', 'PEREMPUAN');

-- CreateEnum
CREATE TYPE "Religion" AS ENUM ('ISLAM', 'KRISTEN', 'KATOLIK', 'HINDU', 'BUDDHA', 'KONGHUCU');

-- CreateEnum
CREATE TYPE "StudentStatus" AS ENUM ('AKTIF', 'LULUS', 'MUTASI', 'DROP_OUT');

-- CreateEnum
CREATE TYPE "Semester" AS ENUM ('GANJIL', 'GENAP');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'KEPALA_SEKOLAH', 'GURU', 'STAF');

-- CreateEnum
CREATE TYPE "Day" AS ENUM ('SENIN', 'SELASA', 'RABU', 'KAMIS', 'JUMAT');

-- CreateEnum
CREATE TYPE "TipeUjian" AS ENUM ('TENGAH_SEMESTER', 'AKHIR_SEMESTER');

-- CreateTable
CREATE TABLE "user" (
    "id" UUID NOT NULL,
    "username" VARCHAR(50) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'GURU',
    "guru_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orang_tua" (
    "id" UUID NOT NULL,
    "nama_ayah" VARCHAR(100),
    "nik_ayah" VARCHAR(16),
    "pekerjaan_ayah" VARCHAR(50),
    "nama_ibu" VARCHAR(100),
    "nik_ibu" VARCHAR(16),
    "pekerjaan_ibu" VARCHAR(50),
    "telepon" VARCHAR(20),
    "alamat" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "orang_tua_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wali" (
    "id" UUID NOT NULL,
    "nama" VARCHAR(100) NOT NULL,
    "nik" VARCHAR(16),
    "hubungan" VARCHAR(50),
    "pekerjaan" VARCHAR(50),
    "telepon" VARCHAR(20),
    "alamat" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "wali_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "guru" (
    "id" UUID NOT NULL,
    "nip" VARCHAR(18),
    "nuptk" VARCHAR(16),
    "nik" VARCHAR(16) NOT NULL,
    "nama" VARCHAR(100) NOT NULL,
    "jenis_kelamin" "Gender" NOT NULL,
    "tempat_lahir" VARCHAR(100) NOT NULL,
    "tanggal_lahir" DATE NOT NULL,
    "telepon" VARCHAR(20),
    "email" VARCHAR(100),
    "tmt" DATE NOT NULL,
    "alamat" VARCHAR(255) NOT NULL,
    "rt" VARCHAR(5),
    "rw" VARCHAR(5),
    "kelurahan" VARCHAR(100),
    "kecamatan" VARCHAR(100),
    "kabupaten" VARCHAR(100),
    "provinsi" VARCHAR(100),
    "kode_pos" VARCHAR(5),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "guru_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "siswa" (
    "id" UUID NOT NULL,
    "nisn" VARCHAR(10) NOT NULL,
    "nis" VARCHAR(10) NOT NULL,
    "nik" TEXT,
    "nik_hash" CHAR(64),
    "nomor_kk" TEXT,
    "nomor_kk_hash" CHAR(64),
    "nama" VARCHAR(100) NOT NULL,
    "jenis_kelamin" "Gender" NOT NULL,
    "tempat_lahir" VARCHAR(100) NOT NULL,
    "tanggal_lahir" DATE NOT NULL,
    "agama" "Religion" NOT NULL DEFAULT 'ISLAM',
    "alamat" VARCHAR(255) NOT NULL,
    "rt" VARCHAR(5),
    "rw" VARCHAR(5),
    "kelurahan" VARCHAR(100),
    "kecamatan" VARCHAR(100),
    "kabupaten" VARCHAR(100),
    "provinsi" VARCHAR(100),
    "kode_pos" VARCHAR(5),
    "telepon" VARCHAR(20),
    "email" VARCHAR(100),
    "status" "StudentStatus" NOT NULL DEFAULT 'AKTIF',
    "orang_tua_id" UUID,
    "wali_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "siswa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tahun_ajar" (
    "id" UUID NOT NULL,
    "tahun" VARCHAR(9) NOT NULL,
    "semester" "Semester" NOT NULL,
    "is_aktif" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "tahun_ajar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kelas" (
    "id" UUID NOT NULL,
    "nama" VARCHAR(50) NOT NULL,
    "tingkat" INTEGER NOT NULL,
    "tahun_ajar_id" UUID NOT NULL,
    "wali_kelas_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "kelas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "anggota_kelas" (
    "id" UUID NOT NULL,
    "siswa_id" UUID NOT NULL,
    "kelas_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "anggota_kelas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mapel" (
    "id" UUID NOT NULL,
    "kode" VARCHAR(10) NOT NULL,
    "nama" VARCHAR(100) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "mapel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jadwal" (
    "id" UUID NOT NULL,
    "hari" "Day" NOT NULL,
    "jam_mulai" TIME NOT NULL,
    "jam_selesai" TIME NOT NULL,
    "kelas_id" UUID NOT NULL,
    "mapel_id" UUID NOT NULL,
    "guru_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "jadwal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tujuan_pembelajaran" (
    "id" UUID NOT NULL,
    "kode" VARCHAR(20),
    "deskripsi" TEXT NOT NULL,
    "tahun_ajar_id" UUID NOT NULL,
    "kelas_id" UUID NOT NULL,
    "mapel_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "tujuan_pembelajaran_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nilai_harian" (
    "id" UUID NOT NULL,
    "nilai" SMALLINT NOT NULL,
    "siswa_id" UUID NOT NULL,
    "tujuan_pembelajaran_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "nilai_harian_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nilai_ujian" (
    "id" UUID NOT NULL,
    "tipe" "TipeUjian" NOT NULL,
    "nilai" SMALLINT NOT NULL,
    "siswa_id" UUID NOT NULL,
    "mapel_id" UUID NOT NULL,
    "tahun_ajar_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "nilai_ujian_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nilai_rapor" (
    "id" UUID NOT NULL,
    "nilai_akhir" SMALLINT NOT NULL,
    "capaian_tertinggi" TEXT,
    "capaian_terendah" TEXT,
    "siswa_id" UUID NOT NULL,
    "mapel_id" UUID NOT NULL,
    "tahun_ajar_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "nilai_rapor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ekstrakurikuler" (
    "id" UUID NOT NULL,
    "nama" VARCHAR(100) NOT NULL,
    "predikat" VARCHAR(10) NOT NULL,
    "keterangan" TEXT,
    "siswa_id" UUID NOT NULL,
    "tahun_ajar_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "ekstrakurikuler_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_username_key" ON "user"("username");

-- CreateIndex
CREATE UNIQUE INDEX "user_guru_id_key" ON "user"("guru_id");

-- CreateIndex
CREATE INDEX "user_deleted_at_username_idx" ON "user"("deleted_at", "username");

-- CreateIndex
CREATE INDEX "orang_tua_deleted_at_idx" ON "orang_tua"("deleted_at");

-- CreateIndex
CREATE INDEX "wali_deleted_at_nama_idx" ON "wali"("deleted_at", "nama");

-- CreateIndex
CREATE UNIQUE INDEX "guru_nip_key" ON "guru"("nip");

-- CreateIndex
CREATE UNIQUE INDEX "guru_nuptk_key" ON "guru"("nuptk");

-- CreateIndex
CREATE UNIQUE INDEX "guru_nik_key" ON "guru"("nik");

-- CreateIndex
CREATE UNIQUE INDEX "guru_email_key" ON "guru"("email");

-- CreateIndex
CREATE INDEX "guru_deleted_at_nama_idx" ON "guru"("deleted_at", "nama");

-- CreateIndex
CREATE UNIQUE INDEX "siswa_nisn_key" ON "siswa"("nisn");

-- CreateIndex
CREATE UNIQUE INDEX "siswa_nis_key" ON "siswa"("nis");

-- CreateIndex
CREATE UNIQUE INDEX "siswa_nik_hash_key" ON "siswa"("nik_hash");

-- CreateIndex
CREATE INDEX "siswa_deleted_at_nisn_nama_idx" ON "siswa"("deleted_at", "nisn", "nama");

-- CreateIndex
CREATE INDEX "siswa_nomor_kk_hash_idx" ON "siswa"("nomor_kk_hash");

-- CreateIndex
CREATE INDEX "tahun_ajar_deleted_at_is_aktif_idx" ON "tahun_ajar"("deleted_at", "is_aktif");

-- CreateIndex
CREATE UNIQUE INDEX "tahun_ajar_tahun_semester_key" ON "tahun_ajar"("tahun", "semester");

-- CreateIndex
CREATE INDEX "kelas_deleted_at_tahun_ajar_id_idx" ON "kelas"("deleted_at", "tahun_ajar_id");

-- CreateIndex
CREATE UNIQUE INDEX "kelas_nama_tahun_ajar_id_key" ON "kelas"("nama", "tahun_ajar_id");

-- CreateIndex
CREATE INDEX "anggota_kelas_deleted_at_siswa_id_kelas_id_idx" ON "anggota_kelas"("deleted_at", "siswa_id", "kelas_id");

-- CreateIndex
CREATE UNIQUE INDEX "anggota_kelas_siswa_id_kelas_id_key" ON "anggota_kelas"("siswa_id", "kelas_id");

-- CreateIndex
CREATE UNIQUE INDEX "mapel_kode_key" ON "mapel"("kode");

-- CreateIndex
CREATE INDEX "mapel_deleted_at_nama_idx" ON "mapel"("deleted_at", "nama");

-- CreateIndex
CREATE INDEX "jadwal_deleted_at_kelas_id_hari_idx" ON "jadwal"("deleted_at", "kelas_id", "hari");

-- CreateIndex
CREATE INDEX "tujuan_pembelajaran_deleted_at_tahun_ajar_id_kelas_id_mapel_idx" ON "tujuan_pembelajaran"("deleted_at", "tahun_ajar_id", "kelas_id", "mapel_id");

-- CreateIndex
CREATE INDEX "nilai_harian_deleted_at_siswa_id_idx" ON "nilai_harian"("deleted_at", "siswa_id");

-- CreateIndex
CREATE UNIQUE INDEX "nilai_harian_siswa_id_tujuan_pembelajaran_id_key" ON "nilai_harian"("siswa_id", "tujuan_pembelajaran_id");

-- CreateIndex
CREATE INDEX "nilai_ujian_deleted_at_siswa_id_mapel_id_tahun_ajar_id_idx" ON "nilai_ujian"("deleted_at", "siswa_id", "mapel_id", "tahun_ajar_id");

-- CreateIndex
CREATE UNIQUE INDEX "nilai_ujian_siswa_id_mapel_id_tahun_ajar_id_tipe_key" ON "nilai_ujian"("siswa_id", "mapel_id", "tahun_ajar_id", "tipe");

-- CreateIndex
CREATE INDEX "nilai_rapor_deleted_at_siswa_id_tahun_ajar_id_idx" ON "nilai_rapor"("deleted_at", "siswa_id", "tahun_ajar_id");

-- CreateIndex
CREATE UNIQUE INDEX "nilai_rapor_siswa_id_mapel_id_tahun_ajar_id_key" ON "nilai_rapor"("siswa_id", "mapel_id", "tahun_ajar_id");

-- CreateIndex
CREATE INDEX "ekstrakurikuler_deleted_at_siswa_id_tahun_ajar_id_idx" ON "ekstrakurikuler"("deleted_at", "siswa_id", "tahun_ajar_id");

-- CreateIndex
CREATE UNIQUE INDEX "ekstrakurikuler_siswa_id_nama_tahun_ajar_id_key" ON "ekstrakurikuler"("siswa_id", "nama", "tahun_ajar_id");

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_guru_id_fkey" FOREIGN KEY ("guru_id") REFERENCES "guru"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "siswa" ADD CONSTRAINT "siswa_orang_tua_id_fkey" FOREIGN KEY ("orang_tua_id") REFERENCES "orang_tua"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "siswa" ADD CONSTRAINT "siswa_wali_id_fkey" FOREIGN KEY ("wali_id") REFERENCES "wali"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kelas" ADD CONSTRAINT "kelas_tahun_ajar_id_fkey" FOREIGN KEY ("tahun_ajar_id") REFERENCES "tahun_ajar"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kelas" ADD CONSTRAINT "kelas_wali_kelas_id_fkey" FOREIGN KEY ("wali_kelas_id") REFERENCES "guru"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "anggota_kelas" ADD CONSTRAINT "anggota_kelas_siswa_id_fkey" FOREIGN KEY ("siswa_id") REFERENCES "siswa"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "anggota_kelas" ADD CONSTRAINT "anggota_kelas_kelas_id_fkey" FOREIGN KEY ("kelas_id") REFERENCES "kelas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jadwal" ADD CONSTRAINT "jadwal_kelas_id_fkey" FOREIGN KEY ("kelas_id") REFERENCES "kelas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jadwal" ADD CONSTRAINT "jadwal_mapel_id_fkey" FOREIGN KEY ("mapel_id") REFERENCES "mapel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jadwal" ADD CONSTRAINT "jadwal_guru_id_fkey" FOREIGN KEY ("guru_id") REFERENCES "guru"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tujuan_pembelajaran" ADD CONSTRAINT "tujuan_pembelajaran_tahun_ajar_id_fkey" FOREIGN KEY ("tahun_ajar_id") REFERENCES "tahun_ajar"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tujuan_pembelajaran" ADD CONSTRAINT "tujuan_pembelajaran_kelas_id_fkey" FOREIGN KEY ("kelas_id") REFERENCES "kelas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tujuan_pembelajaran" ADD CONSTRAINT "tujuan_pembelajaran_mapel_id_fkey" FOREIGN KEY ("mapel_id") REFERENCES "mapel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nilai_harian" ADD CONSTRAINT "nilai_harian_siswa_id_fkey" FOREIGN KEY ("siswa_id") REFERENCES "siswa"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nilai_harian" ADD CONSTRAINT "nilai_harian_tujuan_pembelajaran_id_fkey" FOREIGN KEY ("tujuan_pembelajaran_id") REFERENCES "tujuan_pembelajaran"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nilai_ujian" ADD CONSTRAINT "nilai_ujian_siswa_id_fkey" FOREIGN KEY ("siswa_id") REFERENCES "siswa"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nilai_ujian" ADD CONSTRAINT "nilai_ujian_mapel_id_fkey" FOREIGN KEY ("mapel_id") REFERENCES "mapel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nilai_ujian" ADD CONSTRAINT "nilai_ujian_tahun_ajar_id_fkey" FOREIGN KEY ("tahun_ajar_id") REFERENCES "tahun_ajar"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nilai_rapor" ADD CONSTRAINT "nilai_rapor_siswa_id_fkey" FOREIGN KEY ("siswa_id") REFERENCES "siswa"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nilai_rapor" ADD CONSTRAINT "nilai_rapor_mapel_id_fkey" FOREIGN KEY ("mapel_id") REFERENCES "mapel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nilai_rapor" ADD CONSTRAINT "nilai_rapor_tahun_ajar_id_fkey" FOREIGN KEY ("tahun_ajar_id") REFERENCES "tahun_ajar"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ekstrakurikuler" ADD CONSTRAINT "ekstrakurikuler_siswa_id_fkey" FOREIGN KEY ("siswa_id") REFERENCES "siswa"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ekstrakurikuler" ADD CONSTRAINT "ekstrakurikuler_tahun_ajar_id_fkey" FOREIGN KEY ("tahun_ajar_id") REFERENCES "tahun_ajar"("id") ON DELETE CASCADE ON UPDATE CASCADE;
