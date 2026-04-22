package com.example.server.service;

import com.example.server.dto.MessageResponse;
import com.example.server.dto.account.AccountResponse;
import com.example.server.dto.account.CreateAccountRequest;
import com.example.server.dto.account.UpdateAccountRequest;
import com.example.server.entity.Account;
import com.example.server.entity.User;
import com.example.server.enums.AccountIcon;
import com.example.server.enums.Color;
import com.example.server.exception.ResourceNotFoundException;
import com.example.server.repository.AccountRepository;
import com.example.server.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AccountService {

    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;

    public void createDefaultAccount(User user) {
        Account account = Account.builder()
                .user(user)
                .name("Основна")
                .icon(AccountIcon.CASH)
                .color(Color.LIGHT_GREEN)
                .currentBalance(0)
                .isMain(true)
                .build();

        accountRepository.save(account);
    }

    public AccountResponse createAccount(User user, CreateAccountRequest request) {
        if (accountRepository.existsByUserAndName(user, request.getName())) {
            throw new IllegalArgumentException("Account with this name already exists");
        }

        Account account = Account.builder()
                .user(user)
                .name(request.getName())
                .icon(request.getIcon())
                .color(request.getColor())
                .currentBalance(request.getCurrentBalance())
                .isMain(false)
                .build();

        return AccountResponse.fromEntity(accountRepository.save(account));
    }

    public List<AccountResponse> getUserAccounts(User user) {
        return accountRepository.findByUser(user).stream()
                .map(AccountResponse::fromEntity)
                .toList();
    }

    public AccountResponse updateAccount(User user, Integer accountId, UpdateAccountRequest request) {
        Account account = accountRepository.findByIdAndUser(accountId, user)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found"));

        if (request.getName() != null && !request.getName().equals(account.getName())
                && accountRepository.existsByUserAndName(user, request.getName())) {
            throw new IllegalArgumentException("Account with this name already exists");
        }

        if (request.getName() != null) {
            account.setName(request.getName());
        }
        account.setIcon(request.getIcon());
        account.setColor(request.getColor());
        account.setCurrentBalance(request.getCurrentBalance());

        return AccountResponse.fromEntity(accountRepository.save(account));
    }

    @Transactional
    public MessageResponse deleteAccount(User user, Integer accountId) {
        Account account = accountRepository.findByIdAndUser(accountId, user)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found"));

        if (account.isMain()) {
            throw new IllegalArgumentException("Cannot delete the main account");
        }

        transactionRepository.deleteByAccountId(accountId);
        accountRepository.delete(account);

        return new MessageResponse("Account deleted");
    }
}
