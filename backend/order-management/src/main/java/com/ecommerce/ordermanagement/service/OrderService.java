package com.ecommerce.ordermanagement.service;

import com.ecommerce.ordermanagement.domain.Order;
import com.ecommerce.ordermanagement.repository.OrderRepository;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderService {

    private final OrderRepository orderRepository;

    public OrderService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public Order createOrder(@NonNull Order order) {
        return java.util.Objects.requireNonNull(orderRepository.save(order));
    }
}
