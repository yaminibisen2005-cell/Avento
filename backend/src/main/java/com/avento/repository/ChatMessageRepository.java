package com.avento.repository;

import com.avento.entity.ChatMessage;
import com.avento.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {

    @Query("SELECT m FROM ChatMessage m WHERE (m.sender = :user1 AND m.recipient = :user2) " +
           "OR (m.sender = :user2 AND m.recipient = :user1) ORDER BY m.createdAt ASC")
    List<ChatMessage> findChatHistoryBetweenUsers(@Param("user1") User user1, @Param("user2") User user2);

    @Query("SELECT DISTINCT m.recipient FROM ChatMessage m WHERE m.sender = :user " +
           "UNION " +
           "SELECT DISTINCT m.sender FROM ChatMessage m WHERE m.recipient = :user")
    List<User> findDistinctChatPartners(@Param("user") User user);

    long countByRecipientAndStatus(User recipient, String status);
}
