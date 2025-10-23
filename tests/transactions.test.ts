import { BankAccount } from "../src/bankaccount";
import { Transaction } from "../src/transaction";

describe("Gestion des Comptes Bancaires", () => {
  let account: BankAccount;
  let other: BankAccount;

  beforeEach(() => {
    account = new BankAccount();
    other = new BankAccount();
  });

  it("test_account_balance_Solde_ShouldBe0", () => {
    expect(account.balance).toBe(0);
  });

  it("test_deposit_SimpleDeposit_Allow", () => {
    account.deposit(100, "Dépôt");
    expect(account.balance).toBe(100);
  });

  it("test_deposit_NegativeNumber_Refuse", () => {
    expect(() => account.deposit(-50, "Dépôt")).toThrow(
      "Le montant doit être positif",
    );
  });

  it("test_withdrawal_SimpleWithdraw_Allow", () => {
    account.deposit(100, "Dépôt");
    account.withdraw(50);
    expect(account.balance).toBe(50);
  });

  it("test_withdrawal_WithdrawHigherThanBalance_Refuse", () => {
    account.deposit(50);
    expect(() => account.withdraw(100)).toThrow("Fonds insuffisants");
  });

  it("test_deposit_NullAmount_Refuse", () => {
    expect(() => account.deposit(0)).toThrow();
  });

  it("test_transfer_TransferBetweenAccounts_Allow", () => {
    account.deposit(100);
    account.transfer(other, 50);
    expect(account.balance).toBe(50);
    expect(other.balance).toBe(50);
  });

  it("test_transfer_InsufficientFundsTransfer_Refuse", () => {
    expect(() => account.transfer(other, 50)).toThrow("Fonds insuffisants");
  });

  it("test_transfer_TransferToBlockedAccount_Block", () => {
    account.deposit(100);
    other.block();
    expect(() => account.transfer(other, 50)).toThrow(
      "Le compte destinataire est bloqué",
    );
  });

  it("test_GetHistory_NoteEachTransaction_ShouldAppearInHistory", () => {
    account.deposit(100);
    account.withdraw(50);
    const history = account.getHistory();
    expect(history.length).toBe(2);
    expect(history[0]).toBeInstanceOf(Transaction);
  });

  it("test_GetHistory_ModifyingDirectly_Refuse", () => {
    account.deposit(100);
    const history = account.getHistory();
    history.push(new Transaction("deposit", 20));
    expect(account.getHistory().length).toBe(1);
  });

  it("test_GetLastTransactions_FetchingTheLastTransactions_Last10", () => {
    for (let i = 0; i < 15; i++) account.deposit(100);
    const last10 = account.getLastTransactions();
    expect(last10.length).toBe(10);
  });

  it("test_getBalanceAt_CalculateBalanceAtGivenTime_ReturnBalance", () => {
    const date1 = new Date("2025-01-01");
    const date2 = new Date("2025-02-01");
    account.deposit(100, "init");
    account.getHistory()[0].date = date1;
    (account.deposit(50, "later"), (account.getHistory()[1].date = date2));

    expect(account.getBalanceAt(new Date("2025-01-15"))).toBe(100);
    expect(account.getBalanceAt(new Date("2025-02-15"))).toBe(150);
  });

  it("test_filterTransactions_FilterByType_ShouldReturn1", () => {
    account.deposit(100);
    account.withdraw(50);
    const deposits = account.filterTransactions({ type: "deposit" });
    expect(deposits.length).toBe(1);
    expect(deposits[0].type).toBe("deposit");
  });

  it("test_filterTransactions_FilterByPeriod_ShouldReturnByperiod", () => {
    const jan = new Date("2025-01-15");
    const feb = new Date("2025-02-15");
    account.deposit(100, "jan");
    account.getHistory()[0].date = jan;
    account.deposit(100, "feb");
    account.getHistory()[1].date = feb;

    const filtre = account.filterTransactions({
      startDate: new Date("2025-02-01"),
      endDate: new Date("2025-02-28"),
    });
    expect(filtre.length).toBe(1);
    expect(filtre[0].description).toBe("feb");
  });

  it("test_calculateInterest_CalculatingMonthlyInterest_ShouldReturnInterest", () => {
    account.deposit(1200);
    account.calculateInterest(12);
    expect(account.balance).toBeCloseTo(1212, 2);
  });

  it("test_calculate Interest_Negative Interest_Refuse", () => {
    account.deposit(100);
    expect(() => account.calculateInterest(-5)).toThrow("Taux invalide");
  });

  it("test_blockAndunblock_ShouldAllowToBlockAndUnblockAccounts", () => {
    account.block();
    expect(account.isblocked).toBe(true);
    account.unblock();
    expect(account.isblocked).toBe(false);
  });

  it("test_block_TransactionToABlockedAccount_Refuse", () => {
    account.block();
    expect(() => account.deposit(20)).toThrow("bloqué");
    expect(() => account.withdraw(10)).toThrow("bloqué");
  });

  it("test_decimals_ShouldBePreciseWithAmounts", () => {
    account.deposit(10.55);
    account.deposit(0.45);
    expect(account.balance).toBeCloseTo(11.0, 2);
  });

  it("test_transactions_ShouldAllowForMultipleTransactionsAtTheSameTime", () => {
    account.deposit(200);
    account.withdraw(100);
    account.deposit(50);
    expect(account.balance).toBe(150);
  });
});
