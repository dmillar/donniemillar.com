-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Requests" (
    "request_id" TEXT NOT NULL PRIMARY KEY,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "method" TEXT NOT NULL DEFAULT '',
    "url" TEXT NOT NULL DEFAULT '',
    "agent" TEXT NOT NULL DEFAULT '',
    "response_time" REAL NOT NULL DEFAULT -1,
    "referrer" TEXT NOT NULL DEFAULT '',
    "status" TEXT NOT NULL DEFAULT '',
    "ip" TEXT NOT NULL DEFAULT '',
    "accept_lang" TEXT NOT NULL DEFAULT ''
);
INSERT INTO "new_Requests" ("accept_lang", "agent", "ip", "referrer", "request_id", "response_time", "status", "timestamp", "url") SELECT "accept_lang", "agent", "ip", "referrer", "request_id", "response_time", "status", "timestamp", "url" FROM "Requests";
DROP TABLE "Requests";
ALTER TABLE "new_Requests" RENAME TO "Requests";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
