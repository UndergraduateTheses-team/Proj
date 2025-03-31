import Joi from "joi";

const roleSchema = Joi.object({
    nameRole: Joi.string().required().min(4),
});
export default roleSchema;