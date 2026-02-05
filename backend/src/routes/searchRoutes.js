const express = require("express");
const router = express.Router();
const { semanticSearch } = require("../controllers/searchController");

router.post("/semantic", semanticSearch);

module.exports = router;
