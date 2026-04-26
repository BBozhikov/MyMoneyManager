package com.example.server.service;

import com.example.server.dto.MessageResponse;
import com.example.server.dto.statistics.CategoryStatisticsResponse;
import com.example.server.dto.transaction.CreateTransactionRequest;
import com.example.server.dto.transaction.TransactionResponse;
import com.example.server.dto.transaction.UpdateTransactionRequest;
import com.example.server.entity.Account;
import com.example.server.entity.Category;
import com.example.server.entity.Transaction;
import com.example.server.entity.User;
import com.example.server.enums.CategoryType;
import com.example.server.exception.ResourceNotFoundException;
import com.example.server.repository.AccountRepository;
import com.example.server.repository.CategoryRepository;
import com.example.server.repository.TransactionRepository;
import com.example.server.repository.TransactionSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final AccountRepository accountRepository;
    private final CategoryRepository categoryRepository;

    @Transactional
    public TransactionResponse createTransaction(User user, CreateTransactionRequest request) {
        Account account = accountRepository.findByIdAndUser(request.getAccountId(), user)
                .orElseThrow(() -> new ResourceNotFoundException("Сметката не е намерена"));

        Category category = categoryRepository.findByIdAndUser(request.getCategoryId(), user)
                .filter(Category::isActive)
                .orElseThrow(() -> new ResourceNotFoundException("Категорията не е намерена"));

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

    public List<TransactionResponse> getTransactions(User user, Integer accountId, Integer categoryId,
                                                     CategoryType type, LocalDate startDate,
                                                     LocalDate endDate, String note) {
        Specification<Transaction> spec = TransactionSpecification.hasUser(user);

        if (accountId != null) {
            spec = spec.and(TransactionSpecification.hasAccount(accountId));
        }
        if (categoryId != null) {
            spec = spec.and(TransactionSpecification.hasCategory(categoryId));
        } else if (type != null) {
            spec = spec.and(TransactionSpecification.hasCategoryType(type));
        }
        if (startDate != null && endDate != null) {
            spec = spec.and(TransactionSpecification.createdBetween(startDate, endDate));
        }
        if (note != null && !note.isBlank()) {
            spec = spec.and(TransactionSpecification.noteContains(note));
        }

        return transactionRepository.findAll(spec).stream()
                .map(TransactionResponse::fromEntity)
                .toList();
    }

    @Transactional
    public TransactionResponse updateTransaction(User user, Integer transactionId, UpdateTransactionRequest request) {
        Transaction transaction = transactionRepository.findByIdAndUser(transactionId, user)
                .orElseThrow(() -> new ResourceNotFoundException("Транзакцията не е намерена"));

        Category newCategory = categoryRepository.findByIdAndUser(request.getCategoryId(), user)
                .filter(Category::isActive)
                .orElseThrow(() -> new ResourceNotFoundException("Категорията не е намерена"));

        Account account = transaction.getAccount();
        reverseBalance(account, transaction.getCategory().getType(), transaction.getAmount());
        updateBalance(account, newCategory.getType(), request.getAmount());
        accountRepository.save(account);

        transaction.setCategory(newCategory);
        transaction.setAmount(request.getAmount());
        transaction.setNote(request.getNote());
        transactionRepository.save(transaction);

        return TransactionResponse.fromEntity(transaction);
    }

    @Transactional
    public MessageResponse deleteTransaction(User user, Integer transactionId) {
        Transaction transaction = transactionRepository.findByIdAndUser(transactionId, user)
                .orElseThrow(() -> new ResourceNotFoundException("Транзакцията не е намерена"));

        Account account = transaction.getAccount();
        reverseBalance(account, transaction.getCategory().getType(), transaction.getAmount());
        accountRepository.save(account);

        transactionRepository.delete(transaction);

        return new MessageResponse("Транзакцията е изтрита");
    }

    public List<CategoryStatisticsResponse> getCategoryStatistics(User user, LocalDate startDate, LocalDate endDate) {
        return transactionRepository.getCategoryStatistics(user, startDate, endDate);
    }

    private void updateBalance(Account account, CategoryType type, double amount) {
        if (type == CategoryType.INCOME) {
            account.setCurrentBalance(account.getCurrentBalance() + amount);
        } else {
            account.setCurrentBalance(account.getCurrentBalance() - amount);
        }
    }

    private void reverseBalance(Account account, CategoryType type, double amount) {
        if (type == CategoryType.INCOME) {
            account.setCurrentBalance(account.getCurrentBalance() - amount);
        } else {
            account.setCurrentBalance(account.getCurrentBalance() + amount);
        }
    }
}
