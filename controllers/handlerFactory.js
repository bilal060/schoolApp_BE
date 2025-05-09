const Review = require('../models/reviewModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.deleteOne = Model =>  catchAsync(async(req,res,next)=>{
    const doc = await Model.findByIdAndDelete(req.params.id);
    if(!doc){
        return next(new AppError('No doc Find by this Id' ,404))
    }
    res.status(200).json({
        message: "record deleted succesfully",
    });
})
exports.updateOne = Model =>  catchAsync(async(req,res,next)=>{
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
      });
    if(!doc){
        return next(new AppError('No doc Find by this Id' ,404))
    }
    res.send(doc);
    });


exports.createOne = Model =>  catchAsync(async(req,res,next)=>{
    const doc = await Model.create(req.body);
    if(!doc){
        return next(new AppError('No doc Find by this Id' ,404))
    }
    res.status(200).json({
        status: 'success',
        data:{
            doc
        }
    });
})
exports.getOne = (Model,popOptions)=> catchAsync(async(req,res,next)=>{
    let query = Model.findById(req.params.id)
    if(popOptions) query = query.populate(popOptions)
    const doc = await query;
    if(!doc){
        return next(new AppError('No doc Find by this Id' ,404))
    }
    res.send(doc)
})
exports.getAll = Model=> catchAsync(async (req, res, next) => {
    const docs = await  Model.find()
    res.send(docs)
  });