package com.attendease.service;

import com.attendease.dto.AttendancePercentageResponse;
import com.attendease.entity.AttendanceRecord;
import com.attendease.entity.AttendanceStatus;
import com.attendease.entity.Session;
import com.attendease.entity.Student;
import com.attendease.repository.AttendanceRecordRepository;
import com.attendease.repository.SessionRepository;
import com.attendease.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AttendanceService {

    private final AttendanceRecordRepository attendanceRecordRepository;
    private final StudentRepository studentRepository;
    private final SessionRepository sessionRepository;

    @Value("${attendance.minimum-percentage}")
    private double minimumAttendance;

    public AttendanceService(
            AttendanceRecordRepository attendanceRecordRepository,
            StudentRepository studentRepository,
            SessionRepository sessionRepository) {

        this.attendanceRecordRepository = attendanceRecordRepository;
        this.studentRepository = studentRepository;
        this.sessionRepository = sessionRepository;
    }

    public AttendanceRecord markAttendance(
            Long studentId,
            Long sessionId,
            AttendanceStatus status) {

        Student student = studentRepository.findById(studentId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Student not found with id: " + studentId));

        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Session not found with id: " + sessionId));

        boolean alreadyMarked =
                attendanceRecordRepository
                        .existsByStudentIdAndSessionId(
                                studentId,
                                sessionId
                        );

        if (alreadyMarked) {
            throw new RuntimeException(
                    "Attendance already marked for this student and session."
            );
        }

        AttendanceRecord record =
                new AttendanceRecord(student, session, status);

        return attendanceRecordRepository.save(record);
    }

    public List<AttendanceRecord> getAttendanceByStudent(
            Long studentId) {

        studentRepository.findById(studentId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Student not found with id: " + studentId));

        return attendanceRecordRepository.findByStudentId(studentId);
    }

    public List<AttendanceRecord> getAttendanceBySession(
            Long sessionId) {

        sessionRepository.findById(sessionId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Session not found with id: " + sessionId));

        return attendanceRecordRepository.findBySessionId(sessionId);
    }

    public AttendancePercentageResponse getAttendancePercentage(
            Long studentId,
            Long subjectId) {

        studentRepository.findById(studentId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Student not found with id: " + studentId));

        List<AttendanceRecord> records =
                attendanceRecordRepository
                        .findByStudentIdAndSessionSubjectId(
                                studentId,
                                subjectId
                        );

        int totalSessions = records.size();

        int presentSessions = (int) records.stream()
                .filter(record ->
                        record.getStatus() == AttendanceStatus.PRESENT)
                .count();

        double percentage = 0;

        if (totalSessions > 0) {
            percentage =
                    ((double) presentSessions / totalSessions) * 100;
        }

        boolean shortage = percentage < minimumAttendance;

        return new AttendancePercentageResponse(
                studentId,
                subjectId,
                totalSessions,
                presentSessions,
                percentage,
                shortage
        );
    }

    public List<AttendanceRecord> getShortageStudents(
            Long subjectId) {

        List<AttendanceRecord> shortageRecords = new java.util.ArrayList<>();

        List<Student> students = studentRepository.findAll();

        for (Student student : students) {

            List<AttendanceRecord> records =
                    attendanceRecordRepository
                            .findByStudentIdAndSessionSubjectId(
                                    student.getId(),
                                    subjectId
                            );

            int totalSessions = records.size();

            if (totalSessions == 0) {
                continue;
            }

            int presentSessions = (int) records.stream()
                    .filter(record ->
                            record.getStatus()
                                    == AttendanceStatus.PRESENT)
                    .count();

            double percentage =
                    ((double) presentSessions / totalSessions) * 100;

            if (percentage < minimumAttendance) {
                shortageRecords.addAll(records);
            }
        }

        return shortageRecords;
    }

    public AttendanceRecord correctAttendance(
            Long attendanceId,
            AttendanceStatus newStatus) {

        AttendanceRecord record =
                attendanceRecordRepository.findById(attendanceId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Attendance record not found with id: "
                                                + attendanceId));

        record.setStatus(newStatus);

        return attendanceRecordRepository.save(record);
    }
}