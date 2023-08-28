const {getAllContries,getAllCities,getAllState} = require('../controllers/countriesController')

const express = require('express')
const router = express.Router()
router.get('/country',getAllContries) 

module.exports = router;