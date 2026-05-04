import { OrderStatus, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  const apparel = await prisma.category.create({
    data: { name: "Apparel", slug: "apparel" },
  });

  const home = await prisma.category.create({
    data: { name: "Home", slug: "home" },
  });

  const alice = await prisma.user.create({
    data: {
      email: "alice@example.com",
      name: "Alice",
    },
  });

  const bob = await prisma.user.create({
    data: {
      email: "bob@example.com",
      name: "Bob",
    },
  });

  const tee = await prisma.product.create({
    data: {
      name: "Cloud Tee",
      description: "Organic cotton, garment-dyed in mist grey.",
      sku: "SKU-TEE-001",
      price: "24.00",
      categoryId: apparel.id,
    },
  });

  const tote = await prisma.product.create({
    data: {
      name: "Pastel Tote",
      description: "Roomy canvas bag with inner pocket.",
      sku: "SKU-TOTE-001",
      price: "18.50",
      categoryId: apparel.id,
    },
  });

  const mug = await prisma.product.create({
    data: {
      name: "Morning Mug",
      description: "Matte glaze, microwave-safe.",
      sku: "SKU-MUG-001",
      price: "12.00",
      categoryId: home.id,
    },
  });

  await prisma.cartItem.createMany({
    data: [
      { userId: alice.id, productId: tee.id, quantity: 1 },
      { userId: alice.id, productId: mug.id, quantity: 2 },
      { userId: bob.id, productId: tote.id, quantity: 1 },
    ],
  });

  const order = await prisma.order.create({
    data: {
      userId: alice.id,
      status: OrderStatus.PAID,
      total: "48.00",
    },
  });

  await prisma.orderItem.createMany({
    data: [
      {
        orderId: order.id,
        productId: tee.id,
        quantity: 1,
        unitPrice: "24.00",
        productName: tee.name,
      },
      {
        orderId: order.id,
        productId: mug.id,
        quantity: 2,
        unitPrice: "12.00",
        productName: mug.name,
      },
    ],
  });

  console.log("Seed finished:", {
    users: 2,
    categories: 2,
    products: 3,
    cartItems: 3,
    orders: 1,
    orderItems: 2,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
