package com.ecommerce.ordermanagement.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Customer name is mandatory")
    private String customerName;

    @Email(message = "Customer email should be valid")
    private String customerEmail;

    @NotNull(message = "Total amount is mandatory")
    @Positive(message = "Total amount must be positive")
    private Double totalAmount;

    @NotBlank(message = "Status is mandatory")
    private String status;

    private String comments;

    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @com.fasterxml.jackson.annotation.JsonManagedReference
    private java.util.List<OrderStatusHistory> statusHistory = new java.util.ArrayList<>();

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }
}
