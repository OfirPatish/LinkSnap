/**
 * Enhanced console logging utilities
 */

const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  dim: "\x1b[2m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
};

/**
 * Print a styled banner
 */
function printBanner() {
  const banner = `
${colors.cyan}╔═══════════════════════════════════════════════════════════╗
║                                                       ║
║${colors.bright}           🔗  LinkSnap Backend Server  🔗${colors.reset}${colors.cyan}           ║
║                                                       ║
╚═══════════════════════════════════════════════════════════╝${colors.reset}
`;
  console.log(banner);
}

/**
 * Print a styled section header
 */
function printSection(title: string) {
  console.log(
    `\n${colors.cyan}${colors.bright}▶${colors.reset} ${colors.bright}${title}${colors.reset}`
  );
}

/**
 * Print a key-value pair
 */
function printInfo(
  key: string,
  value: string | number,
  status: "success" | "info" | "warning" = "info"
) {
  const statusIcon = {
    success: `${colors.green}✓${colors.reset}`,
    info: `${colors.blue}ℹ${colors.reset}`,
    warning: `${colors.yellow}⚠${colors.reset}`,
  }[status];

  const padding = " ".repeat(Math.max(0, 20 - key.length));
  console.log(
    `  ${statusIcon} ${colors.dim}${key}:${padding}${colors.reset} ${value}`
  );
}

/**
 * Print server startup information
 */
export function printServerInfo(port: number, env: string, baseUrl?: string) {
  printBanner();

  printSection("Server Configuration");
  printInfo("Environment", env, env === "production" ? "warning" : "info");
  printInfo("Port", port.toString(), "success");
  if (baseUrl) {
    printInfo("Base URL", baseUrl, "info");
  }

  printSection("Database");
  printInfo("Status", "Initialized", "success");
  printInfo("Type", "SQLite", "info");

  printSection("Middleware");
  printInfo("Compression", "Enabled", "success");
  printInfo("Security Headers", "Enabled", "success");
  printInfo("Rate Limiting", "Enabled", "success");
  printInfo("Request Logging", "Enabled", "success");
  printInfo("CORS", "Enabled", "success");

  printSection("API Endpoints");
  printInfo("POST /api/shorten", "URL Shortening", "info");
  printInfo("GET /api/stats/:slug", "Link Statistics", "info");
  printInfo("GET /:slug", "Link Redirect", "info");
  printInfo("GET /health", "Health Check", "info");

  console.log(
    `\n${colors.green}${colors.bright}✓${colors.reset} ${colors.bright}Server is ready!${colors.reset}`
  );
  console.log(
    `${colors.cyan}${colors.dim}→${colors.reset} ${colors.bright}http://localhost:${port}${colors.reset}\n`
  );
}

/**
 * Print database initialization error
 */
export function printDbError(error: Error) {
  console.error(
    `\n${colors.red}${colors.bright}✗${colors.reset} ${colors.red}${colors.bright}Database Initialization Failed${colors.reset}`
  );
  console.error(`${colors.red}${error.message}${colors.reset}\n`);
}
