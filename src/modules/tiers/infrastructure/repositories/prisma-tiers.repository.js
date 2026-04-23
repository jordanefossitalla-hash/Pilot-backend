class PrismaTiersRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  findAll(filters = {}) {
    return this.prisma.thirdParty.findMany({
      where: filters,
      include: {
        ledgerEntries: {
          orderBy: {
            createdAt: 'desc'
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  findById(id) {
    return this.prisma.thirdParty.findUnique({
      where: { id },
      include: {
        ledgerEntries: {
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    });
  }

  create(data) {
    return this.prisma.$transaction(async (transaction) => {
      const tier = await transaction.thirdParty.create({
        data: {
          name: data.name,
          type: data.type,
          phone: data.phone,
          email: data.email,
          address: data.address,
          isActive: data.isActive
        }
      });

      if (data.openingBalance && data.openingBalance > 0) {
        await transaction.thirdPartyLedgerEntry.create({
          data: {
            thirdPartyId: tier.id,
            entryType: 'OPENING_BALANCE',
            direction: data.openingBalanceDirection,
            amount: data.openingBalance,
            reference: data.openingBalanceReference,
            description: data.openingBalanceDescription
          }
        });
      }

      return transaction.thirdParty.findUnique({
        where: { id: tier.id },
        include: {
          ledgerEntries: {
            orderBy: {
              createdAt: 'desc'
            }
          }
        }
      });
    });
  }

  update(id, data) {
    return this.prisma.thirdParty.update({
      where: { id },
      data,
      include: {
        ledgerEntries: {
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    });
  }

  findLedgerEntriesByThirdPartyId(thirdPartyId) {
    return this.prisma.thirdPartyLedgerEntry.findMany({
      where: { thirdPartyId },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  createLedgerEntry(thirdPartyId, data) {
    return this.prisma.thirdPartyLedgerEntry.create({
      data: {
        thirdPartyId,
        entryType: data.entryType,
        direction: data.direction,
        amount: data.amount,
        reference: data.reference,
        description: data.description
      }
    });
  }
}

module.exports = PrismaTiersRepository;
