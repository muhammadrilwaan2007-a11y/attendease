package com.attendease.service;

import com.attendease.entity.Session;
import com.attendease.entity.Subject;
import com.attendease.repository.SessionRepository;
import com.attendease.repository.SubjectRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SessionService {

    private final SessionRepository sessionRepository;
    private final SubjectRepository subjectRepository;

    public SessionService(
            SessionRepository sessionRepository,
            SubjectRepository subjectRepository) {

        this.sessionRepository = sessionRepository;
        this.subjectRepository = subjectRepository;
    }

    public Session createSession(Session session) {

        Long subjectId = session.getSubject().getId();

        Subject subject = subjectRepository.findById(subjectId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Subject not found with id: " + subjectId));

        session.setSubject(subject);

        return sessionRepository.save(session);
    }

    public List<Session> getAllSessions() {
        return sessionRepository.findAll();
    }

    public Session getSessionById(Long id) {

        return sessionRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Session not found with id: " + id));
    }

    public void deleteSession(Long id) {

        Session session = getSessionById(id);

        sessionRepository.delete(session);
    }
}