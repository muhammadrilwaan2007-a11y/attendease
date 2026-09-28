package com.attendease.controller;

import com.attendease.entity.Subject;
import com.attendease.service.SubjectService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/subjects")
public class SubjectController {

    private final SubjectService subjectService;

    public SubjectController(SubjectService subjectService) {
        this.subjectService = subjectService;
    }

    @PostMapping
    public ResponseEntity<Subject> createSubject(
            @RequestBody Subject subject) {

        Subject savedSubject = subjectService.createSubject(subject);

        return new ResponseEntity<>(savedSubject, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Subject>> getAllSubjects() {

        List<Subject> subjects = subjectService.getAllSubjects();

        return ResponseEntity.ok(subjects);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Subject> getSubjectById(
            @PathVariable Long id) {

        Subject subject = subjectService.getSubjectById(id);

        return ResponseEntity.ok(subject);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Subject> updateSubject(
            @PathVariable Long id,
            @RequestBody Subject subject) {

        Subject updatedSubject =
                subjectService.updateSubject(id, subject);

        return ResponseEntity.ok(updatedSubject);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteSubject(
            @PathVariable Long id) {

        subjectService.deleteSubject(id);

        return ResponseEntity.ok("Subject deleted successfully");
    }
}