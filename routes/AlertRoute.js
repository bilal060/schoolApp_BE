const express = require('express')
const alertController = require('../controllers/alertController');
const router = express.Router()


router
  .route('/Alerts')
  .get(alertController.getAlerts)
  .post(alertController.CreateAlert);

router
  .route('/Alerts/:id')
  .get(alertController.getAlert)
  .patch(alertController.updateAlert)
  .delete(alertController.deleteAlert);



module.exports =router;