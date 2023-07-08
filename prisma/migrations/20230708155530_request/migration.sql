/*
  Warnings:

  - The primary key for the `Requests` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `accept_lang` to the `Requests` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ip` to the `Requests` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Requests" (
    "request_id" TEXT NOT NULL PRIMARY KEY,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "url" TEXT NOT NULL,
    "agent" TEXT NOT NULL,
    "response_time" REAL NOT NULL,
    "referrer" TEXT NOT NULL,
    "status" INTEGER NOT NULL,
    "ip" TEXT NOT NULL,
    "accept_lang" TEXT NOT NULL
);
INSERT INTO "new_Requests" ("agent", "referrer", "request_id", "response_time", "status", "timestamp", "url") SELECT "agent", "referrer", "request_id", "response_time", "status", "timestamp", "url" FROM "Requests";
DROP TABLE "Requests";
ALTER TABLE "new_Requests" RENAME TO "Requests";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
