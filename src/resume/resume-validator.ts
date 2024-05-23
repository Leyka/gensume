import Joi from "joi";

export type ValidateResumeSchemaFn = typeof validateResumeSchema;

export function validateResumeSchema(data: object): string[] | null {
  const { error } = resumeSchema.validate(data, {
    abortEarly: false,
  });

  if (!error) {
    return null;
  }

  return error.details.map((error) => error.message);
}

const stringItemsSectionSchema = Joi.object({
  sectionTitle: Joi.string().required(),
  items: Joi.array().items(Joi.string()).min(1).required(),
});

const personalInfoSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  title: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
  city: Joi.string().required(),
  province: Joi.string().required(),
  linkedIn: Joi.string().required(),
  github: Joi.string().required(),
  spokenLanguages: stringItemsSectionSchema.required(),
});

const experienceSchema = Joi.object({
  sectionTitle: Joi.string().required(),
  experiences: Joi.array()
    .items(
      Joi.object({
        company: Joi.string().required(),
        jobTitle: Joi.string().required(),
        startDate: Joi.date().required(),
        endDate: Joi.date().required(),
        city: Joi.string().required(),
        achievements: Joi.array().items(Joi.string()).min(1).required(),
      }),
    )
    .min(1)
    .required(),
});

const educationSchema = Joi.object({
  sectionTitle: Joi.string().required(),
  educations: Joi.array()
    .items(
      Joi.object({
        institution: Joi.string().required(),
        degree: Joi.string().required(),
        startDate: Joi.date().required(),
        endDate: Joi.date().required(),
        city: Joi.string().required(),
        achievements: Joi.array().items(Joi.string()).min(1).optional(),
      }),
    )
    .min(1)
    .required(),
});

const techSkillsSchema = Joi.object({
  sectionTitle: Joi.string().required(),
  sections: Joi.array().items(stringItemsSectionSchema).min(1).required(),
});

const miscSchema = Joi.object({
  sectionTitle: Joi.string().required(),
  sections: Joi.array().items(stringItemsSectionSchema).min(1).required(),
});

const metadataSchema = Joi.object({
  exportedFileTitle: Joi.string().optional(),
});

const resumeSchema = Joi.object({
  personalInfo: personalInfoSchema.required(),
  experience: experienceSchema.required(),
  education: educationSchema.required(),
  techSkills: techSkillsSchema.required(),
  misc: miscSchema.required(),
  $metadata: metadataSchema.optional(),
});
