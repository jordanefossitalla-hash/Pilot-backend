class PrismaProductsRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  findAll() {
    return this.prisma.product.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  findById(id) {
    return this.prisma.product.findUnique({
      where: { id }
    });
  }

  findBySku(sku) {
    return this.prisma.product.findUnique({
      where: { sku }
    });
  }

  create(data) {
    return this.prisma.product.create({
      data
    });
  }

  update(id, data) {
    return this.prisma.product.update({
      where: { id },
      data
    });
  }
}

module.exports = PrismaProductsRepository;
