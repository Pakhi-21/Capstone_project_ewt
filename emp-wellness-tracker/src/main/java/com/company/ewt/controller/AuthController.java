package com.company.ewt.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.company.ewt.entity.Employee;
import com.company.ewt.service.EmployeeService;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private EmployeeService employeeService;

    @PostMapping("/register")
    public Map<String, String> register(@RequestBody Employee employee) {
        employeeService.registerEmployee(employee);
        Map<String, String> response = new HashMap<>();
        response.put("message", "User registered successfully!");
        return response;
    }

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Map<String, String> loginData) {
        Optional<Employee> employee = employeeService.loginEmployee(loginData.get("email"), loginData.get("password"));
        Map<String, Object> response = new HashMap<>();

        if (employee.isPresent()) {
            response.put("message", "Login successful!");
            response.put("userId",employee.get().getId());
            response.put("isAdmin", employee.get().isAdmin());
            return response;
        } else {
            response.put("error", "Invalid email or password");
            return response;
        }
    }
}

