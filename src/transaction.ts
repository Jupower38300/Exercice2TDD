export type TransactionTypes =
  | "deposit"
  | "withdrawal"
  | "transfer"
  | "interest";

export class Transaction {
  readonly type: TransactionTypes;
  readonly amount: number;
  readonly date: Date;
  readonly description: string;

  constructor(
    type: TransactionTypes,
    amount: number,
    description = "",
    date = new Date(),
  ) {
    if (amount <= 0) throw new Error("Le montant doit être positif");
    this.type = type;
    this.amount = parseFloat(amount.toFixed(2));
    this.date = date;
    this.description = description;
  }
}
