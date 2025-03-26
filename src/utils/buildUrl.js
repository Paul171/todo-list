/**
 * Utility function to build correct URLs regardless of deployment environment
 */
function buildUrl(req) {
  // Get protocol from request or default to https (for production)
  const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'https';
  
  // Get host from various headers (needed for different hosting environments)
  const host = req.headers['x-forwarded-host'] || req.headers.host || 'localhost';
  
  return `${protocol}://${host}`;
}

module.exports = buildUrl;
