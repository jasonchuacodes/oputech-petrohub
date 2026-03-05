-- Trim 13-digit PAGIBIG numbers to 12 digits (drop last digit)
UPDATE "User"
SET "pagibig" = LEFT("pagibig", 12)
WHERE "pagibig" IS NOT NULL AND LENGTH("pagibig") = 13;

UPDATE "Tenant"
SET "pagibig" = LEFT("pagibig", 12)
WHERE "pagibig" IS NOT NULL AND LENGTH("pagibig") = 13;
