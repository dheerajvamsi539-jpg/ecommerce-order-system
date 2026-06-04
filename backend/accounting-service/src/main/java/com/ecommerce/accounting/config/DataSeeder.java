package com.ecommerce.accounting.config;

import com.ecommerce.accounting.service.AccountingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private AccountingService accountingService;

    @Override
    public void run(String... args) throws Exception {
        if (accountingService.getAllAccounts().isEmpty()) {
            accountingService.createAccount("Main Sales Account");
        }
    }
}
