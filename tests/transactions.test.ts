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
});
