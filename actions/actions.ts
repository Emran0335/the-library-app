"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function addCategory(name: string, path: string) {
  try {
    const category = await prisma.$transaction([
      prisma.book_categories.create({
        data: {
          category_name: name,
        },
      }),
    ]);

    revalidatePath(path);

    return category;
  } catch (error) {
    throw error;
  }
}

export async function updateCategory(id: number, name: string, path: string) {
  if (!id) throw new Error("Missing Id when updating category!");

  try {
    await prisma.$transaction([
      prisma.book_categories.update({
        where: {
          category_id: id,
        },
        data: {
          category_name: name,
        },
      }),
    ]);

    revalidatePath(path);
  } catch (error) {
    throw error;
  }
}

export async function getCategories(offset: number, limit: number) {
  try {
    let categories;
    let total;

    if (limit === -1) {
      categories = await prisma.book_categories.findMany();
      total = categories.length;
    } else {
      [categories, total] = await prisma.$transaction([
        prisma.book_categories.findMany({ skip: offset, take: limit }),
        prisma.book_categories.count(),
      ]);
    }

    return { data: categories, total: total };
  } catch (error) {
    throw error;
  }
}

export async function deleteCategory(id: number, path: string) {
  try {
    await prisma.$transaction([
      prisma.book_categories.delete({
        where: {
          category_id: id,
        },
      }),
    ]);

    revalidatePath(path);
  } catch (error) {
    throw error;
  }
}

// *** Book ***
export async function addBook({
  name,
  isbn,
  no_of_copies,
  category,
  photos,
  publish_year,
  author,
  path,
}: {
  name: string;
  isbn: string;
  no_of_copies: number;
  category: number[];
  photos: string[];
  publish_year: number;
  author: string;
  path: string;
}) {
  try {
    await prisma.$transaction(async (t) => {
      const book = await t.books.create({
        data: {
          name,
          isbn,
          no_of_copies,
          publish_year,
          author,
        },
      });
      if (category && category.length > 0) {
        const data = category.map((cat) => ({
          book_id: book.book_id,
          category_id: cat,
        }));

        await t.book_category_links.createMany({ data });
      }

      // save photos
      if (photos && photos.length > 0) {
        const data = photos.map((photo) => ({
          book_id: book.book_id,
          url: photo,
        }));

        await t.book_photos.createMany({ data });
      }

      revalidatePath(path);
    });
  } catch (error) {
    throw error;
  }
}

export async function updateBook({
  id,
  name,
  isbn,
  no_of_copies,
  category,
  publish_year,
  author,
  path,
}: {
  id: number;
  name: string;
  isbn: string;
  no_of_copies: number;
  category: number[];
  path: string;
  publish_year: number;
  author: string;
}) {
  try {
    await prisma.$transaction(async (t) => {
      const book = await t.books.update({
        where: {
          book_id: id,
        },
        data: {
          name,
          isbn,
          no_of_copies,
          publish_year,
          author,
        },
      });

      await t.book_category_links.deleteMany({
        where: {
          book_id: id,
        },
      });

      if (category && category.length > 0) {
        const data = category.map((cat) => ({
          book_id: book.book_id,
          category_id: cat,
        }));

        await t.book_category_links.createMany({ data });
      }

      revalidatePath(path);
    });
  } catch (error) {
    throw error;
  }
}
export async function deleteBook(book_id: number, path: string) {
  await prisma.$transaction(
    async (t) =>
      await t.books.delete({
        where: {
          book_id: book_id,
        },
      }),
  );
  revalidatePath(path);
}

// *** Photo ***
export async function addPhoto(
  table: string,
  entity_id: number,
  url: string,
  path: string,
) {
  try {
    const newPhoto = await prisma.$transaction(async (t) => {
      if (table === "book") {
        return await t.book_photos.create({
          data: {
            book_id: entity_id,
            url,
          },
        });
      } else if (table === "activity") {
        return await t.activity_photos.create({
          data: {
            activity_id: entity_id,
            url,
          },
        });
      }
    });

    revalidatePath(path);

    return {
      photo_id: newPhoto?.photo_id as number,
      url: newPhoto?.url as string,
    };
  } catch (error) {
    throw error;
  }
}

export async function deletePhoto(table: string, id: number, path: string) {
  try {
    const result = await prisma.$transaction(async (t) => {
      if (table === "book") {
        await t.book_photos.delete({
          where: {
            photo_id: id,
          },
        });
      } else if (table === "activity") {
        await t.activity_photos.delete({
          where: {
            photo_id: id,
          },
        });
      }
    });

    revalidatePath(path);

    return result;
  } catch (error) {
    throw error;
  }
}
