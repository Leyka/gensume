export type Resume = {
  [key: string]: any;
  $metadata?: {
    exportedFileTitle?: string;
    locale?: string;
  };
};

export type ResumeMetadata = Resume["$metadata"];
