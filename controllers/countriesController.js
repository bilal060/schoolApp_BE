var worldMapData = require('city-state-country');
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')

const getAllContries =catchAsync(async (req,res)=>{
    const { country, state , q } = req.query;
     const countriesList = worldMapData.getAllCountries();
    if(req.query.country){
        const statesList = worldMapData.getAllStatesFromCountry(country);
        res.status(200).json({
            statesList
        }) 
    }
    else if(req.query.state){
        const citiesList = worldMapData.getAllCitiesFromState(state);
        res.status(200).json({
            citiesList
        }) 
    }
    else if(req.query.city){
        const citiesList = worldMapData.getAllCitiesFromState(city);
        res.status(200).json({
            citiesList
        }) 
    }
 else{
        res.status(200).json({
            countriesList
        }) 
    }
 
})


exports.getAllContries = getAllContries;

