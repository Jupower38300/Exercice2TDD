import { Transaction, TransactionTypes } from "./transaction";

export class BankAccount {
  balance: number = 0;
  transactions: Transaction[] = [];
  blocked: boolean = false;

  private ensureNotBlocked() {
    if (this.blocked) throw new Error("Le compte est bloqué.");
  }

  get balanceParseFloat(): number {
    return parseFloat(this.balance.toFixed(2));
  }

  get isblocked(): boolean {
    return this.blocked;
  }

  deposit(amount: number, description?: string) {
    this.ensureNotBlocked();
    const transaction = new Transaction("deposit", amount, description);
    this.balance += amount;
    this.transactions.push(transaction);
  }

  withdraw(amount: number, description?: string) {
    this.ensureNotBlocked();
    if (amount > this.balance) throw new Error("Fonds insuffisants");
    const transaction = new Transaction("withdrawal", amount, description);
    this.balance -= amount;
    this.transactions.push(transaction);
  }

  transfer(reciever: BankAccount, amount: number, description?: string) {
    this.ensureNotBlocked();
    if (reciever.isblocked)
      throw new Error("Le compte destinataire est bloqué");
    if (amount > this.balance) throw new Error("Fonds insuffisants");
    this.withdraw(amount, "Retrait");
    reciever.deposit(amount, "Dépôt");
  }

  getHistory(): Transaction[] {
    return [...this.transactions];
  }

  getLastTransactions(n = 10): Transaction[] {
    return [...this.transactions.slice(-n)];
  }

  getBalanceAt(date: Date): number {
    const filtre = this.transactions.filter((tx) => tx.date <= date);
    let balance = 0;
    for (const tx of filtre) {
      if (tx.type === "deposit" || tx.type === "interest") balance += tx.amount;
      if (tx.type === "withdrawal" || tx.type === "transfer")
        balance -= tx.amount;
    }
    return parseFloat(balance.toFixed(2));
  }

  filterTransactions(opts: {
    type?: TransactionTypes;
    startDate?: Date;
    endDate?: Date;
  }) {
    return this.transactions.filter((tx) => {
      const Typing = opts.type ? tx.type === opts.type : true;
      const StartingDate = opts.startDate ? tx.date >= opts.startDate : true;
      const EndingDate = opts.endDate ? tx.date <= opts.endDate : true;
      return Typing && StartingDate && EndingDate;
    });
  }

  calculateInterest(rate: number) {
    this.ensureNotBlocked();
    if (rate <= 0) throw new Error("Taux invalide");
    const interest = (this.balance * rate) / 12 / 100;
    this.balance += interest;
    this.transactions.push(
      new Transaction("interest", interest, "Intérets annuels"),
    );
  }

  block() {
    this.blocked = true;
  }

  unblock() {
    this.blocked = false;
  }
}
