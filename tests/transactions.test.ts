import { BankAccount } from "../src/bankaccount";
import { Transactions } from "../src/transaction";

describe("Gestion des Comptes Bancaire", () => {
  let account: BankAccount;
  let transaction: Transactions;

  beforeEach(() => {
    account = new BankAccount();
    transaction = new Transactions();
  });

  it("test_account_balance_Solde_ShouldBe0", () => {
    expect(account.balance).toBe(0);
  });

  it("test_deposit_SimpleDeposit_Allow", () => {
    account.depoosit(100);
    expect(account.balance).toBe(100);
  });

  it("test_deposit_NegativeNumber_Refuse", () => {
    expect(() => account.deposit(-50)).toThrow(positive);
  });

  it("test_withdrawal_SimpleWithdraw_Allow", () => {
    account.deposit(100);
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
    account.transfer(otheraccount, 50);
    expect(account.balance).toBe(50);
    expect(other.balance).toBe(50);
  });

  it("test_transfer_InsufficientFundsTransfer_Refuse", () => {
    expect(() => account.transfer(other, 50)).toThrow("Fonds insuffisants");
  });

  it("test_transfer_TransferToBlockedAccount_Block", () => {
    account.deposit(100);
    other.block();

    expect(() => account.transfer(other, 50)).toThrow("Bloqué");
  });

  it("test_GetHistory_NoteEachTransaction_ShouldAppearInHistory", () => {
    account.deposit(100);
    account.withdraw(50);
    const history = account.getHistory();
    expect(history.length).toBe(2);
    expect(history[0]).toBeInstanceOf(Transactions);
  });

  it("test_GetHistory_ModifyingDirectly_Refuse", () => {
    account.deposit(100);
    const history = account.getHistory();
    history.push(new Transaction("deposit", 20));
    expect(account.getHistory().length).toBe(1);
  });

  it("test_GetLastTransactions_FetchingTheLastTransactions_Last10", () => {
    for (let i = 0; i < 15; i++) account.deposit(100);
    const last10 = account.getlastTransactions();
    expect(laast10.length()).toBe(10);
  });
});
