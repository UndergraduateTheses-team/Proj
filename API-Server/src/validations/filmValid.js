import Joi from "joi";

const filmSchema = Joi.object({
  name: Joi.string().required().min(1),
  genres: Joi.required(),
  //  idVideo: Joi.string().required(),
  country: Joi.string(),
  actors: Joi.array(),
  director: Joi.string(),
  status: Joi.string(),
  poster_img: Joi.string().required(),
  releaseDate: Joi.date().required(),
  description: Joi.string(),
  totalChap: Joi.number(),
  movieDuration: Joi.string(),
  viewed: Joi.number(),
});
export default filmSchema;
