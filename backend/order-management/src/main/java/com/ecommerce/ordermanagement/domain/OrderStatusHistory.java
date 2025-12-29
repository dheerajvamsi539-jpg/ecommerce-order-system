package com.ecommerce.ordermanagement.domain;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@Table(name = "order_status_history")
public class OrderStatusHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String status;
    private LocalDateTime changedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    @JsonBackReference
    private Order order;

    public OrderStatusHistory(String status, Order order) {
        this.status = status;
        this.order = order;
        this.changedAt = LocalDateTime.now();
    }

    public OrderStatusHistory(String status, Order order, LocalDateTime changedAt) {
        this.status = status;
        this.order = order;
        this.changedAt = changedAt;
    }
}
