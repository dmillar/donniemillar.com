-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Requests" (
    "request_id" TEXT NOT NULL PRIMARY KEY,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "url" TEXT NOT NULL,
    "agent" TEXT NOT NULL DEFAULT '',
    "response_time" REAL NOT NULL,
    "referrer" TEXT NOT NULL,
    "status" INTEGER NOT NULL,
    "ip" TEXT NOT NULL,
    "accept_lang" TEXT NOT NULL
);
INSERT INTO "new_Requests" ("accept_lang", "agent", "ip", "referrer", "request_id", "response_time", "status", "timestamp", "url") SELECT "accept_lang", "agent", "ip", "referrer", "request_id", "response_time", "status", "timestamp", "url" FROM "Requests";
DROP TABLE "Requests";
ALTER TABLE "new_Requests" RENAME TO "Requests";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
