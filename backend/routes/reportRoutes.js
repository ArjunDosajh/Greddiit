const express = require('express')
const router = express.Router()
const { createReport, getReportsOfSg, ignoreReport, removeReport } = require('../controllers/reportController')
const { protect } = require('../middleware/auth')

router.post('/', createReport, protect)
router.get('/getReportsOfSg/:id', getReportsOfSg, protect)
router.put('/ignoreReport/:id', ignoreReport, protect)
router.delete('/removeReport/:id', removeReport, protect)

module.exports = router