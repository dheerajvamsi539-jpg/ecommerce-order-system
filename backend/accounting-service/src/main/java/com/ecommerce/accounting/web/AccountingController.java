package com.ecommerce.accounting.web;

import com.ecommerce.accounting.model.Account;
import com.ecommerce.accounting.model.Transaction;
import com.ecommerce.accounting.model.TransactionType;
import com.ecommerce.accounting.service.AccountingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/accounting")
public class AccountingController {

    @Autowired
    private AccountingService accountingService;

    @GetMapping("/accounts")
    public List<Account> getAllAccounts() {
        return accountingService.getAllAccounts();
    }

    @PostMapping("/accounts")
    public Account createAccount(@RequestParam String name) {
        return accountingService.createAccount(name);
    }

    @PostMapping("/transactions")
    public Transaction recordTransaction(
            @RequestParam Long accountId,
            @RequestParam String description,
            @RequestParam BigDecimal amount,
            @RequestParam TransactionType type) {
        return accountingService.recordTransaction(accountId, description, amount, type);
    }

    @GetMapping("/accounts/{id}/transactions")
    public List<Transaction> getTransactions(@PathVariable Long id) {
        return accountingService.getTransactionsForAccount(id);
    }

    @GetMapping("/accounts/{id}/balance")
    public BigDecimal getBalance(@PathVariable Long id) {
        return accountingService.getBalance(id);
    }
}
