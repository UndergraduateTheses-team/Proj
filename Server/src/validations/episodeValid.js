import Joi from "joi";

const episodeSchema = Joi.object({
  movieId: Joi.string().required().messages({
    "string.empty": `"movieID" cannot be an empty field`,
  }),
  name_episode: Joi.string().required().messages({
    "string.empty": `"name_episode" cannot be an empty field`,
    "any.required": `"name_episode" is a required field`,
  }),
  episode_number: Joi.number().integer().min(1).required().messages({
    "number.base": `"chapterNumber" should be a type of 'number'`,
    "number.integer": `"chapterNumber" should be an integer`,
    "number.min": `"chapterNumber" should be at least {#limit}`,
    "any.required": `"chapterNumber" is a required field`,
  }),
  videoUrl: Joi.string().optional(),
});

export default episodeSchema;
