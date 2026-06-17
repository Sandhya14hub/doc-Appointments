const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/profile", authMiddleware, (req, res) => {
  if (req.user.role !== "doctor") {
    return res.status(403).json({
      success: false,
      message: "Access denied"
    });
  }

  res.json({
    success: true,
    message: "Protected Route Accessed",
    user: req.user
  });

});

module.exports = router;
