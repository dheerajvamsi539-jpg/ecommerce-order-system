package com.ecommerce.accounting.service;

import com.ecommerce.accounting.model.Account;
import com.ecommerce.accounting.model.Transaction;
import com.ecommerce.accounting.model.TransactionType;
import com.ecommerce.accounting.repository.AccountRepository;
import com.ecommerce.accounting.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
public class AccountingService {

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    public List<Account> getAllAccounts() {
        return accountRepository.findAll();
    }

    public Account createAccount(String name) {
        return accountRepository.save(new Account(name));
    }

    @Transactional
    public Transaction recordTransaction(@org.springframework.lang.NonNull Long accountId, String description,
            BigDecimal amount, TransactionType type) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Account not found"));

        Transaction transaction = new Transaction(description, amount, type, account);

        if (type == TransactionType.INCOME) {
            account.setBalance(account.getBalance().add(amount));
        } else {
            account.setBalance(account.getBalance().subtract(amount));
        }

        accountRepository.save(account);
        return transactionRepository.save(transaction);
    }

    public List<Transaction> getTransactionsForAccount(@org.springframework.lang.NonNull Long accountId) {
        return transactionRepository.findByAccountIdOrderByTimestampDesc(accountId);
    }

    public BigDecimal getBalance(@org.springframework.lang.NonNull Long accountId) {
        return accountRepository.findById(accountId)
                .map(Account::getBalance)
                .orElse(BigDecimal.ZERO);
    }
}
