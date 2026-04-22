package com.example.server.service;

import com.example.server.dto.transaction.CreateTransactionRequest;
import com.example.server.dto.transaction.TransactionResponse;
import com.example.server.entity.Account;
import com.example.server.entity.Category;
import com.example.server.entity.Transaction;
import com.example.server.entity.User;
import com.example.server.enums.CategoryType;
import com.example.server.exception.ResourceNotFoundException;
import com.example.server.repository.AccountRepository;
import com.example.server.repository.CategoryRepository;
import com.example.server.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final AccountRepository accountRepository;
    private final CategoryRepository categoryRepository;

    @Transactional
    public TransactionResponse createTransaction(User user, CreateTransactionRequest request) {
        Account account = accountRepository.findByIdAndUser(request.getAccountId(), user)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found"));

        Category category = categoryRepository.findByIdAndUser(request.getCategoryId(), user)
                .filter(Category::isActive)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        Transaction transaction = Transaction.builder()
                .user(user)
                .account(account)
                .category(category)
                .amount(request.getAmount())
                .createdAt(request.getCreatedAt())
                .note(request.getNote())
                .build();

        transactionRepository.save(transaction);

        updateBalance(account, category.getType(), request.getAmount());
        accountRepository.save(account);

        return TransactionResponse.fromEntity(transaction);
    }

    private void updateBalance(Account account, CategoryType type, double amount) {
        if (type == CategoryType.INCOME) {
            account.setCurrentBalance(account.getCurrentBalance() + amount);
        } else {
            account.setCurrentBalance(account.getCurrentBalance() - amount);
        }
    }
}
