const router = require("express").Router();
const {userStatus, dropdownData, tableData} = require("../controllers/profile.controller");

/**
 * @swagger
 * /api/v1/profile/user_status:
 *   get:
 *     summary: User profile status data
 *     tags: [Profile]
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *         description: JWT token (Bearer token)
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID to retrieve user data
 *     responses:
 *       200:
 *         description: Successfully retrieved user profile data
 *       401:
 *         description: Unauthorized, invalid or missing JWT token
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
// GET USER STATUS
router.get("/user_status", userStatus);


// GET DROP-DOWN DATA
router.get("/dropdown-data", dropdownData);


/**
 * @swagger
 * /api/v1/profile/table_data:
 *   get:
 *     summary: Get all topics data
 *     tags: [Profile]
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *         description: JWT token (Bearer token)
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID to retrieve user table data
 *     responses:
 *       200:
 *         description: Successfully retrieved user table data
 *       401:
 *         description: Unauthorized, invalid or missing JWT token
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
// GET TABLE DATA
router.get("/table_data", tableData);


module.exports = router;