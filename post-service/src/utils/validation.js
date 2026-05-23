import joi from "joi";

const validatePostCreation = (data) => {
  const schema = joi.object({
    content: joi.string().min(10).required(),
  });

  return schema.validate(data);
};

export { validatePostCreation };
