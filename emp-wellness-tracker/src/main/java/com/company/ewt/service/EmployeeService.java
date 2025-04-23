package com.company.ewt.service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.company.ewt.entity.Employee;
import com.company.ewt.repository.EmployeeRepository;
import org.mindrot.jbcrypt.BCrypt;

import java.util.Optional;
import java.util.stream.Collectors;
import java.util.List;

@Service
public class EmployeeService {

    @Autowired
    private EmployeeRepository employeeRepository;

    // Register employee with hashed password
    public String registerEmployee(Employee employee) {
        Optional<Employee> existingEmployee = employeeRepository.findByEmail(employee.getEmail());

        if (existingEmployee.isPresent()) {
            return "Email already exists!";
        }
    
        String hashedPassword = BCrypt.hashpw(employee.getPassword(), BCrypt.gensalt(10)); // Hash password
        employee.setPassword(hashedPassword); 
        employeeRepository.save(employee);

        return "User registered successfully!";
    }

    // Login authentication with password verification
    public Optional<Employee> loginEmployee(String email, String password) {
        Optional<Employee> employee = employeeRepository.findByEmail(email);
        
        if (employee.isPresent() && BCrypt.checkpw(password, employee.get().getPassword())) {
            return employee;
        }
        return Optional.empty();
    }

    //get all employee
    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll();
    }
    
    // New method to filter employees with survey responses
    public List<Employee> getEmployeesWithSurveyResponses() {
        return employeeRepository.findAll()
                .stream()
                .filter(emp -> emp.getSurveyResponses() != null && !emp.getSurveyResponses().isEmpty())
                .collect(Collectors.toList());
    }

    // get employee by id
    public Employee getEmployeeById(Long id) {
        return employeeRepository.findById(id).orElseThrow(() -> new RuntimeException("Employee not found with ID:"+id));
    }

    //update employee profile
    public Employee updateEmployee(Long id, Employee updatedEmployee) {

        Employee employee = getEmployeeById(id);

        if (updatedEmployee.getName() != null) {
            employee.setName(updatedEmployee.getName());
        }
        if (updatedEmployee.getEmail() != null) {
            employee.setEmail(updatedEmployee.getEmail());
        }
        if (updatedEmployee.getDepartment() != null) {
            employee.setDepartment(updatedEmployee.getDepartment());
        }
        if (updatedEmployee.getLocation() != null) {
            employee.setLocation(updatedEmployee.getLocation());
        }
        if (updatedEmployee.getPassword() != null && !updatedEmployee.getPassword().isEmpty()) {
            employee.setPassword(BCrypt.hashpw(updatedEmployee.getPassword(), BCrypt.gensalt(10)));
        }
    
        return employeeRepository.save(employee);
        
    }
    
    //delete employee if needed
    public void deleteEmployee(Long id) {

        if (!employeeRepository.existsById(id)) {
            throw new RuntimeException("Employee not found with ID: " + id);
        }

        employeeRepository.deleteById(id);
    }

    //to upgrade the role
    public Employee promoteToAdmin(Long id) {
        Employee employee = getEmployeeById(id);
        employee.setAdmin(true);  
        return employeeRepository.save(employee);
    }

    public Employee adminRegisterEmployee(Employee employee) {
        String hashedPassword = BCrypt.hashpw(employee.getPassword(), BCrypt.gensalt(10)); // Hash password
        employee.setPassword(hashedPassword); 
        return employeeRepository.save(employee);
    } 

    
    } 
