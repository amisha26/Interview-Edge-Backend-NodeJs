const router = require("express").Router();
const {userStatus, dropdownData, tableData} = require("../controllers/profile.controller");


// GET USER STATUS
router.get("/user_status", userStatus);

// GET DROP-DOWN DATA
router.get("/dropdown-data", dropdownData);


// GET TABLE DATA
router.get("/table_data", tableData);


module.exports = router;