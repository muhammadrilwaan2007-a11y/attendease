package com.attendease.service;

import com.attendease.entity.Subject;
import com.attendease.repository.SubjectRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SubjectService {

    private final SubjectRepository subjectRepository;

    public SubjectService(SubjectRepository subjectRepository) {
        this.subjectRepository = subjectRepository;
    }

    public Subject createSubject(Subject subject) {
        return subjectRepository.save(subject);
    }

    public List<Subject> getAllSubjects() {
        return subjectRepository.findAll();
    }

    public Subject getSubjectById(Long id) {
        return subjectRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Subject not found with id: " + id));
    }

    public Subject updateSubject(Long id, Subject subject) {

        Subject existingSubject = getSubjectById(id);

        existingSubject.setName(subject.getName());
        existingSubject.setCode(subject.getCode());

        return subjectRepository.save(existingSubject);
    }

    public void deleteSubject(Long id) {

        Subject existingSubject = getSubjectById(id);

        subjectRepository.delete(existingSubject);
    }
}