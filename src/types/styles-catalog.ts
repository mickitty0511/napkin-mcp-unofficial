import { z } from "zod";
import { StyleIdZ } from "./style-id.js";

export const StyleItemZ = z.object({
  name: z.string().min(1),
  id: StyleIdZ,
  description: z.string().min(1),
});
export type StyleItem = z.infer<typeof StyleItemZ>;

export const StyleCategoryZ = z.object({
  label: z.string().min(1),
  items: z.array(StyleItemZ).min(1),
});
export type StyleCategory = z.infer<typeof StyleCategoryZ>;

export const StylesCategoryKeyZ = z.enum([
  "colorful",
  "casual",
  "hand_drawn",
  "formal",
  "monochrome",
]);
export type StylesCategoryKey = z.infer<typeof StylesCategoryKeyZ>;

export const BuiltInStylesZ = z
  .object({
    total: z.number().int().min(0),
    categories: z
      .object({
        colorful: StyleCategoryZ,
        casual: StyleCategoryZ,
        hand_drawn: StyleCategoryZ,
        formal: StyleCategoryZ,
        monochrome: StyleCategoryZ,
      })
      .strict(),
  })
  .superRefine((val, ctx) => {
    const sum = Object.values(val.categories).reduce(
      (acc, cat) => acc + cat.items.length,
      0
    );
    if (sum !== val.total) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `built_in_styles.total (${val.total}) does not equal sum of items (${sum})`,
        path: ["total"],
      });
    }
  });
export type BuiltInStyles = z.infer<typeof BuiltInStylesZ>;

export const StylesCatalogZ = z.object({
  built_in_styles: BuiltInStylesZ,
});
export type StylesCatalog = z.infer<typeof StylesCatalogZ>;

