class PrismaUsersRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  findAll() {
    return this.prisma.user.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  findById(id) {
    return this.prisma.user.findUnique({
      where: { id }
    });
  }

  findByEmail(email) {
    return this.prisma.user.findUnique({
      where: { email }
    });
  }

  update(id, data) {
    return this.prisma.user.update({
      where: { id },
      data
    });
  }
}

module.exports = PrismaUsersRepository;
