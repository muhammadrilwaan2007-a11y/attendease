package com.attendease.controller;

import com.attendease.dto.AttendancePercentageResponse;
import com.attendease.entity.AttendanceRecord;
import com.attendease.entity.AttendanceStatus;
import com.attendease.service.AttendanceService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/attendance")
public class AttendanceController {

    private final AttendanceService attendanceService;

    public AttendanceController(AttendanceService attendanceService) {
        this.attendanceService = attendanceService;
    }

    @PostMapping
    public ResponseEntity<AttendanceRecord> markAttendance(
            @RequestParam Long studentId,
            @RequestParam Long sessionId,
            @RequestParam AttendanceStatus status) {

        AttendanceRecord record =
                attendanceService.markAttendance(
                        studentId,
                        sessionId,
                        status
                );

        return new ResponseEntity<>(
                record,
                HttpStatus.CREATED
        );
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<AttendanceRecord>> getStudentAttendance(
            @PathVariable Long studentId) {

        return ResponseEntity.ok(
                attendanceService.getAttendanceByStudent(studentId)
        );
    }

    @GetMapping("/session/{sessionId}")
    public ResponseEntity<List<AttendanceRecord>> getSessionAttendance(
            @PathVariable Long sessionId) {

        return ResponseEntity.ok(
                attendanceService.getAttendanceBySession(sessionId)
        );
    }

    @GetMapping("/student/{studentId}/subject/{subjectId}")
    public ResponseEntity<AttendancePercentageResponse>
    getAttendancePercentage(
            @PathVariable Long studentId,
            @PathVariable Long subjectId) {

        return ResponseEntity.ok(
                attendanceService.getAttendancePercentage(
                        studentId,
                        subjectId
                )
        );
    }

    @GetMapping("/shortage/subject/{subjectId}")
    public ResponseEntity<List<AttendanceRecord>>
    getShortageStudents(
            @PathVariable Long subjectId) {

        return ResponseEntity.ok(
                attendanceService.getShortageStudents(subjectId)
        );
    }

    @PutMapping("/{attendanceId}")
    public ResponseEntity<AttendanceRecord> correctAttendance(
            @PathVariable Long attendanceId,
            @RequestParam AttendanceStatus status) {

        return ResponseEntity.ok(
                attendanceService.correctAttendance(
                        attendanceId,
                        status
                )
        );
    }
}