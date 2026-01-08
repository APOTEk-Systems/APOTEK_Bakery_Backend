export function provisionAuth(req, res, next) {
  const token = req.headers["x-provision-token"];

  if (!token) {
    return res.status(401).json({
      error: "Provision token missing"
    });
  }

  if (token !== process.env.INTERNAL_PROVISION_TOKEN) {
    return res.status(403).json({
      error: "Invalid provision token"
    });
  }

  // Mark request as internal
  req.isInternal = true;

  next();
};
