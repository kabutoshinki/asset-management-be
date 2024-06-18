/* eslint-disable @typescript-eslint/no-unused-vars */
import { faker } from '@faker-js/faker';
import {
  Asset,
  AssetState,
  Category,
  Location,
  Prisma,
  PrismaClient,
} from '@prisma/client';
const prisma = new PrismaClient();

export function createRandomAsset(): Prisma.AssetCreateInput {
  return {
    assetCode: ``,
    location: faker.helpers.enumValue(Location),
    state: faker.helpers.enumValue(AssetState),
    specification: faker.commerce.productDescription(),
    name: faker.commerce.productName(),
    installedDate: faker.date.past(),
    category: {},
  };
}

export const ASSETS: Prisma.AssetCreateInput[] = faker.helpers.multiple(
  createRandomAsset,
  {
    count: {
      min: 20,
      max: 100,
    },
  },
);

export async function seedAssets(categories: Category[]) {
  const assets: Asset[] = [];
  for (const [index, asset] of ASSETS.entries()) {
    const category = faker.helpers.arrayElement(categories);
    const res = await prisma.asset.create({
      data: {
        ...asset,
        assetCode: `${category.prefix}${faker.string.numeric({
          length: 6,
          allowLeadingZeros: true,
        })}`,
        category: {
          connect: {
            id: category.id,
          },
        },
      },
    });
    assets.push(res);
  }
  return assets;
}
