import { REGIONS } from "#shared/constants/region";
import { TAGS } from "#shared/constants/tag";

export type ColumnSchema = {
  name: string;
  url: string;
  public: boolean;
  active: boolean;
  regions: (typeof REGIONS)[number][];
  tags: (typeof TAGS)[number][];
  date: Date;
  p95?: number | undefined;
};
