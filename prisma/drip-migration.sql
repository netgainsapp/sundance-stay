ALTER TABLE "Waitlist" ADD COLUMN IF NOT EXISTS "dripStage" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "Waitlist" ADD COLUMN IF NOT EXISTS "dripLastSentAt" TIMESTAMP(3);
ALTER TABLE "Waitlist" ADD COLUMN IF NOT EXISTS "unsubscribed" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Waitlist" ADD COLUMN IF NOT EXISTS "unsubscribeToken" TEXT;
UPDATE "Waitlist" SET "unsubscribeToken" = md5(random()::text || id) WHERE "unsubscribeToken" IS NULL;
ALTER TABLE "Waitlist" ALTER COLUMN "unsubscribeToken" SET NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS "Waitlist_unsubscribeToken_key" ON "Waitlist"("unsubscribeToken");
CREATE INDEX IF NOT EXISTS "Waitlist_unsubscribed_dripStage_idx" ON "Waitlist"("unsubscribed", "dripStage");
