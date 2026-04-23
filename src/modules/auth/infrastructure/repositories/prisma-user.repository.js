class PrismaUserRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  findByEmail(email) {
    return this.prisma.user.findUnique({
      where: { email }
    });
  }

  findById(id) {
    return this.prisma.user.findUnique({
      where: { id }
    });
  }

  create(data) {
    return this.prisma.user.create({
      data
    });
  }
}

module.exports = PrismaUserRepository;
