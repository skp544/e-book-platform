import {z} from "zod";
import {genreList, languageList} from "../helper/data.ts";

export const commonBookSchema = {
	title: z.string().trim().min(5, "Title is too short!"),
	description: z.string().trim().min(5, "Description is too short!"),
	genre: z.enum(genreList, { message: "Please select a genre!" }),
	language: z.enum(languageList, { message: "Please select a language!" }),
	publicationName: z
		.string({ required_error: "Invalid publication name!" })
		.trim()
		.min(3, "Description is too short!"),
	uploadMethod: z.enum(["aws", "local"], {
		message: "Upload method is missing!",
	}),
	publishedAt: z.string({ required_error: "Publish date is missing!" }).trim(),
	price: z
		.object({
			mrp: z
				.number({ required_error: "MRP is missing!" })
				.refine((val) => val > 0, "MRP is missing!"),
			sale: z
				.number({ required_error: "Sale price is missing!" })
				.refine((val) => val > 0, "Sale price is missing!"),
		})
		.refine((price) => price.sale <= price.mrp, "Invalid sale price!"),
}

export  const fileInfoSchema = z.object({
	name: z
		.string({ required_error: "File name is missing!" })
		.min(1, "File name is missing!"),
	type: z
		.string({ required_error: "File type is missing!" })
		.min(1, "File type is missing!"),
	size: z
		.number({ required_error: "File size is missing!" })
		.refine((val) => val > 0, "Invalid file size!"),
});

export  const newBookSchema = z.object({
	...commonBookSchema,
	fileInfo: fileInfoSchema,
})

export  const updateBookSchema = z.object({
	...commonBookSchema,
	fileInfo: fileInfoSchema.optional(),
});