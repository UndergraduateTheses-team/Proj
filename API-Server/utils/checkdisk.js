import checkDiskSpace from "check-disk-space";
import fs from "fs/promises";
import path from "path";
import { logger } from "./logger.js";

const DISK_WARN_THRESHOLD = 0.80;
const DISK_PATH = process.platform === "win32" ? "D:\\" : "/";

async function checkDisk() {
  const { free, size } = await checkDiskSpace(DISK_PATH);
  const used = size - free;
  const usedPct = used / size;
  const freePct = free / size;

  const diskData = {
    path: DISK_PATH,
    totalDisk: size,
    freeDisk: free,
    usedPct: Number((usedPct * 100).toFixed(2)), // e.g. 91.23 (%)
    freePct: Number((freePct * 100).toFixed(2)),
  };

  if (usedPct >= DISK_WARN_THRESHOLD) {
    // First, log a warning about low disk
    logger.warn(
      { disk: diskData },
      `Low disk space: only ${diskData.freePct}% free`
    ); 
  } 
}

export function startDiskMonitor(intervalMs = 3600000) {
  checkDisk().catch((err) => {
    logger.error({ err }, "Initial disk check failed");
  });

  setInterval(() => {
    checkDisk().catch((err) => {
      logger.error({ err }, "Periodic disk check failed");
    });
  }, intervalMs);
}