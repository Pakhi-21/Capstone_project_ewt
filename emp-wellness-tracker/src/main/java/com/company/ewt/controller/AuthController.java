package com.company.ewt.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<Map<String, String>> register(@RequestBody Employee employee) {
    Map<String, String> response = new HashMap<>();
    String result = employeeService.registerEmployee(employee);

    if (result.equals("Email already exists!")) {
        response.put("message", result);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    response.put("message", result);
    return ResponseEntity.ok(response); 
    
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> loginData) {
        Optional<Employee> employee = employeeService.loginEmployee(loginData.get("email"), loginData.get("password"));
        Map<String, Object> response = new HashMap<>();

        if (employee.isPresent()) {
            response.put("message", "Login successful!");
            response.put("userId",employee.get().getId());
            response.put("isAdmin", employee.get().isAdmin());
            return ResponseEntity.ok(response);
        } else {
            response.put("error", "Invalid email or password");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
    }
}

