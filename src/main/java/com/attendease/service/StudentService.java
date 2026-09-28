package com.attendease.service;

import com.attendease.entity.Student;
import com.attendease.repository.StudentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StudentService {

    private final StudentRepository studentRepository;

    public StudentService(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    public Student createStudent(Student student) {
        return studentRepository.save(student);
    }

    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    public Student getStudentById(Long id) {
        return studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found with id: " + id));
    }

    public Student updateStudent(Long id, Student student) {

        Student existingStudent = getStudentById(id);

        existingStudent.setName(student.getName());
        existingStudent.setRollNumber(student.getRollNumber());
        existingStudent.setEmail(student.getEmail());

        return studentRepository.save(existingStudent);
    }

    public void deleteStudent(Long id) {

        Student existingStudent = getStudentById(id);

        studentRepository.delete(existingStudent);
    }
}