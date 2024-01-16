import { serviceModel } from "../../../Database/models/Services.model.js";
import { AppError } from "../../utils/AppError.js";
import { catchError } from "../../utils/catchError.js";
import * as handler from "../controllersHandler.js";
import { addContentSchema } from "./serviceValidation.js";

// Add service
const addService = catchError(async (req, res, next) => {
  const { error } = addContentSchema.validate(req.body);
  if (error) {
    return next(new AppError(error.details[0].message, 400));
  }
  if (!req.body.title) {
    return next(new AppError("Title is required", 400));
  }
  if (!req.body.description) {
    return next(new AppError("Description is required", 400));
  }
  if (!req.file) {
    return next(new AppError("No file uploaded", 400));
  }
  req.body.imageCover = req.file.filename;

  const service = new serviceModel(req.body);
  if (!service) {
    return next(new AppError("Something went wrong", 404));
  }

  await service.save();

  res.status(200).json({
    message: `Service Added Successfully`,
    service,
  });
});

const getAllServices = handler.getAll(serviceModel, "Services");
const getAllServicesNoPagination = handler.getAllWithoutPaginationNoRole(serviceModel, "Services");

const updateService = catchError(async (req, res, next) => {
  const { title, description } = req.body;
  const { id } = req.params;

  if (title) {
    if (!title.en && !title.ar) {
      return next(
        new AppError("Please provide a title in English or Arabic", 400)
      );
    }
  }
  if (description) {
    if (!description.en && !description.ar) {
      return next(
        new AppError("Please provide a description in English or Arabic", 400)
      );
    }
  }
  if (req.file) {
    req.body.imageCover = req.file.filename;
  }

  const updatedService = await serviceModel.findOneAndUpdate(
    { _id: id },
    req.body,
    { new: true }
  );
  if (!updatedService) {
    return next(new AppError("Service not found", 404));
  }

  res.status(200).json({
    message: `Service Updated Successfully`,
    updatedService,
  });
});

const deleteService = catchError(async (req, res, next) => {
  const { id } = req.params;

  const service = await serviceModel.findByIdAndDelete({
    _id: id,
  });

  if (!service) {
    return next(new AppError("Service not found", 404));
  }

  res.status(200).json({
    message: `Service Deleted Successfully`,
  });
});

const getService = handler.getOne(serviceModel, "Service");

export { addService, getAllServices, updateService, getAllServicesNoPagination,deleteService, getService };
