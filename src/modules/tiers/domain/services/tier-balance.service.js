function toNumber(value) {
  return Number(value || 0);
}

function computeTierBalance(ledgerEntries = []) {
  const net = ledgerEntries.reduce((total, entry) => {
    const amount = toNumber(entry.amount);

    if (entry.direction === 'DEBIT') {
      return total + amount;
    }

    return total - amount;
  }, 0);

  if (net === 0) {
    return {
      balance: 0,
      balanceDirection: 'SETTLED'
    };
  }

  return {
    balance: Number(Math.abs(net).toFixed(2)),
    balanceDirection: net > 0 ? 'DEBIT' : 'CREDIT'
  };
}

module.exports = {
  computeTierBalance
};
