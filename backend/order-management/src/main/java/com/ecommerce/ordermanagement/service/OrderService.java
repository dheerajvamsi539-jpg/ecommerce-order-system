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

    public Order getOrderById(Long id) {
        return orderRepository.findById(id).orElseThrow(() -> new RuntimeException("Order not found with id: " + id));
    }

    public Order createOrder(@NonNull Order order) {
        return java.util.Objects.requireNonNull(orderRepository.save(order));
    }

    public Order updateOrder(Long id, Order orderDetails) {
        Order order = getOrderById(id);
        order.setCustomerName(orderDetails.getCustomerName());
        order.setCustomerEmail(orderDetails.getCustomerEmail());
        order.setTotalAmount(orderDetails.getTotalAmount());
        order.setStatus(orderDetails.getStatus());
        order.setComments(orderDetails.getComments());
        return orderRepository.save(order);
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
