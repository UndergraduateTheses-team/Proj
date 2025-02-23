import Joi from "joi";

const genreSchema = Joi.object({
    name: Joi.string().required().min(6),
});
export default genreSchema;