ALTER TABLE "orang_tua"
  ALTER COLUMN "nik_ayah" TYPE TEXT,
  ALTER COLUMN "nik_ibu" TYPE TEXT,
  ADD COLUMN "nik_ayah_hash" CHAR(64),
  ADD COLUMN "nik_ibu_hash" CHAR(64);

ALTER TABLE "wali"
  ALTER COLUMN "nik" TYPE TEXT,
  ADD COLUMN "nik_hash" CHAR(64);

ALTER TABLE "guru"
  ALTER COLUMN "nik" TYPE TEXT,
  ADD COLUMN "nik_hash" CHAR(64);

DROP INDEX "guru_nik_key";

CREATE UNIQUE INDEX "guru_nik_hash_key" ON "guru"("nik_hash");
CREATE INDEX "orang_tua_nik_ayah_hash_idx" ON "orang_tua"("nik_ayah_hash");
CREATE INDEX "orang_tua_nik_ibu_hash_idx" ON "orang_tua"("nik_ibu_hash");
CREATE INDEX "wali_nik_hash_idx" ON "wali"("nik_hash");
