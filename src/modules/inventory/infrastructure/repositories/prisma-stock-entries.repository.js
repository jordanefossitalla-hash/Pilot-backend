class PrismaStockEntriesRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  findAll() {
    return this.prisma.stockEntry.findMany({
      include: {
        supplier: true,
        items: {
          include: {
            product: true
          }
        }
      },
      orderBy: {
        entryDate: 'desc'
      }
    });
  }

  findById(id) {
    return this.prisma.stockEntry.findUnique({
      where: { id },
      include: {
        supplier: true,
        items: {
          include: {
            product: true
          }
        }
      }
    });
  }
}

module.exports = PrismaStockEntriesRepository;
