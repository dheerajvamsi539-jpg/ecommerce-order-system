package com.ecommerce.ordermanagement.web;

import com.ecommerce.ordermanagement.domain.Order;
import com.ecommerce.ordermanagement.service.OrderService;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping
    public List<Order> getAllOrders() {
        return orderService.getAllOrders();
    }

    @PostMapping
    public Order createOrder(@RequestBody @NonNull Order order) {
        return orderService.createOrder(order);
    }
}
