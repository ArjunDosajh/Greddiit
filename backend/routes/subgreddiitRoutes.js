const express = require('express')
const router = express.Router()
const { createSubgreddiit, getSubgreddiitsOfOwner, deleteSubgreddiit, getSubgreddiitById, getAllSubgreddiits, filteredSubgreddiits, updateSubgreddiit } = require('../controllers/subgreddiitController')
const { protect } = require('../middleware/auth')
const multer = require('multer')
const upload = multer({dest: './uploads/'})

router.get('/getAllSubgreddiits', getAllSubgreddiits, protect)
router.post('/', upload.single('image'), createSubgreddiit, protect)
router.post('/mysubgreddiits', getSubgreddiitsOfOwner, protect)
router.post('/getSubgreddiitById', getSubgreddiitById, protect)
router.delete('/mysubgreddiits/:id', deleteSubgreddiit, protect)
router.post('/filteredSubgreddiits', filteredSubgreddiits, protect)
router.put('/updateSubgreddiit', updateSubgreddiit, protect)

module.exports = router