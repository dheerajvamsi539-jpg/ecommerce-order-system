package com.ecommerce.ordermanagement.service;

import com.ecommerce.ordermanagement.domain.OrderStatusHistory;
import com.ecommerce.ordermanagement.domain.Order;
import com.ecommerce.ordermanagement.repository.OrderRepository;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.util.UriComponentsBuilder;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class OrderService {

    private final OrderRepository orderRepository;

    @Autowired
    private RestTemplate restTemplate;

    @org.springframework.beans.factory.annotation.Value("${accounting.service.url}")
    private String accountingServiceUrl;

    public OrderService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public Order getOrderById(Long id) {
        return orderRepository.findById(id).orElseThrow(() -> new RuntimeException("Order not found with id: " + id));
    }

    public Order createOrder(@NonNull Order order) {
        LocalDateTime historyTime = order.getCreatedAt() != null ? order.getCreatedAt() : LocalDateTime.now();
        order.getStatusHistory().add(new OrderStatusHistory(order.getStatus(), order, historyTime));
        Order savedOrder = orderRepository.save(order);
        if ("COMPLETED".equalsIgnoreCase(savedOrder.getStatus())) {
            recordIncome(savedOrder);
        }
        return savedOrder;
    }

    public Order updateOrder(Long id, Order orderDetails) {
        Order order = getOrderById(id);
        String oldStatus = order.getStatus();

        if (!oldStatus.equalsIgnoreCase(orderDetails.getStatus())) {
            validateStatusTransition(oldStatus, orderDetails.getStatus());
            order.setStatus(orderDetails.getStatus());
            order.getStatusHistory().add(new OrderStatusHistory(order.getStatus(), order));
        }

        order.setCustomerName(orderDetails.getCustomerName());
        order.setCustomerEmail(orderDetails.getCustomerEmail());
        order.setTotalAmount(orderDetails.getTotalAmount());
        order.setComments(orderDetails.getComments());

        Order updatedOrder = orderRepository.save(order);

        if (!"COMPLETED".equalsIgnoreCase(oldStatus) && "COMPLETED".equalsIgnoreCase(updatedOrder.getStatus())) {
            recordIncome(updatedOrder);
        }

        return updatedOrder;
    }

    private void validateStatusTransition(String oldStatus, String newStatus) {
        if ("COMPLETED".equalsIgnoreCase(oldStatus)) {
            throw new IllegalArgumentException("Cannot change status of a COMPLETED order.");
        }

        if ("PENDING".equalsIgnoreCase(oldStatus)) {
            if (!"PROCESSING".equalsIgnoreCase(newStatus) && !"CANCELLED".equalsIgnoreCase(newStatus)) {
                throw new IllegalArgumentException("PENDING orders can only move to PROCESSING or CANCELLED.");
            }
        } else if ("PROCESSING".equalsIgnoreCase(oldStatus)) {
            if (!"SHIPPED".equalsIgnoreCase(newStatus) && !"PENDING".equalsIgnoreCase(newStatus)
                    && !"CANCELLED".equalsIgnoreCase(newStatus)) {
                throw new IllegalArgumentException(
                        "PROCESSING orders can only move to SHIPPED, PENDING, or CANCELLED.");
            }
        } else if ("SHIPPED".equalsIgnoreCase(oldStatus)) {
            if (!"COMPLETED".equalsIgnoreCase(newStatus) && !"PENDING".equalsIgnoreCase(newStatus)
                    && !"CANCELLED".equalsIgnoreCase(newStatus)) {
                throw new IllegalArgumentException("SHIPPED orders can only move to COMPLETED, PENDING, or CANCELLED.");
            }
        } else if ("CANCELLED".equalsIgnoreCase(oldStatus)) {
            if (!"PENDING".equalsIgnoreCase(newStatus)) {
                throw new IllegalArgumentException("CANCELLED orders can only be restarted to PENDING.");
            }
        }
    }

    private void recordIncome(Order order) {
        try {
            // Assume Account ID 1 is the main sales account
            String url = UriComponentsBuilder
                    .fromUriString(accountingServiceUrl + "/transactions")
                    .queryParam("accountId", 1)
                    .queryParam("description", "Order #" + order.getId() + " Completion")
                    .queryParam("amount", order.getTotalAmount())
                    .queryParam("type", "INCOME")
                    .encode()
                    .build()
                    .toUriString();

            restTemplate.postForObject(url, null, Object.class);
        } catch (Exception e) {
            // Log error but don't fail order operation
            System.err.println("Failed to record income for order " + order.getId() + ": " + e.getMessage());
        }
    }

    public void deleteOrder(Long id) {
        Order order = getOrderById(id);
        orderRepository.delete(order);
    }

    public Order addComment(Long id, String comment) {
        Order order = getOrderById(id);
        order.setComments(comment);
        return orderRepository.save(order);
    }
}
