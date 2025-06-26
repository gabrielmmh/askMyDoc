-- DropForeignKey
ALTER TABLE "Interaction" DROP CONSTRAINT "Interaction_documentId_fkey";

-- DropForeignKey
ALTER TABLE "OcrResult" DROP CONSTRAINT "OcrResult_documentId_fkey";

-- AddForeignKey
ALTER TABLE "OcrResult" ADD CONSTRAINT "OcrResult_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Interaction" ADD CONSTRAINT "Interaction_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE CASCADE ON UPDATE CASCADE;
