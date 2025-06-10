// Very basic logger stub
export function logInfo(msg: string, meta?: any) {
    // Could later go to CloudWatch, etc.
    console.log(`[INFO] ${msg}`, meta || "");
}

  export function logError(msg: string, meta?: any) {
    console.error(`[ERROR] ${msg}`, meta || "");
}
  