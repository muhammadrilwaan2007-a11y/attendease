package com.attendease.controller;

import com.attendease.entity.Session;
import com.attendease.service.SessionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sessions")
public class SessionController {

    private final SessionService sessionService;

    public SessionController(SessionService sessionService) {
        this.sessionService = sessionService;
    }

    @PostMapping
    public ResponseEntity<Session> createSession(
            @RequestBody Session session) {

        Session savedSession = sessionService.createSession(session);

        return new ResponseEntity<>(
                savedSession,
                HttpStatus.CREATED
        );
    }

    @GetMapping
    public ResponseEntity<List<Session>> getAllSessions() {

        return ResponseEntity.ok(
                sessionService.getAllSessions()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<Session> getSessionById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                sessionService.getSessionById(id)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteSession(
            @PathVariable Long id) {

        sessionService.deleteSession(id);

        return ResponseEntity.ok(
                "Session deleted successfully"
        );
    }
}