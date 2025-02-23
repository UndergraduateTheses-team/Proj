import Joi from 'joi';

const commentSchema = Joi.object({
    movieId: Joi.string().required().label('Movie ID'),
    userId: Joi.string().required().label('User ID'),
    content: Joi.string().required().label('Comment Text'),
});

export default commentSchema;