package com.attendease.dto;

public class AttendancePercentageResponse {

    private Long studentId;
    private Long subjectId;
    private int totalSessions;
    private int presentSessions;
    private double attendancePercentage;
    private boolean shortage;

    public AttendancePercentageResponse(
            Long studentId,
            Long subjectId,
            int totalSessions,
            int presentSessions,
            double attendancePercentage,
            boolean shortage) {

        this.studentId = studentId;
        this.subjectId = subjectId;
        this.totalSessions = totalSessions;
        this.presentSessions = presentSessions;
        this.attendancePercentage = attendancePercentage;
        this.shortage = shortage;
    }

    public Long getStudentId() {
        return studentId;
    }

    public Long getSubjectId() {
        return subjectId;
    }

    public int getTotalSessions() {
        return totalSessions;
    }

    public int getPresentSessions() {
        return presentSessions;
    }

    public double getAttendancePercentage() {
        return attendancePercentage;
    }

    public boolean isShortage() {
        return shortage;
    }
}