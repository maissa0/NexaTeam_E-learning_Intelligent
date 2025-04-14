package com.esprit.userAuth.service;

import com.esprit.userAuth.entity.Resume;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.*;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;

@Service
@RequiredArgsConstructor
public class PDFService {

    public byte[] generateCV(Resume resume) throws IOException {
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        PdfWriter writer = new PdfWriter(outputStream);
        PdfDocument pdf = new PdfDocument(writer);
        Document document = new Document(pdf);

        // Add title
        Paragraph title = new Paragraph(resume.getTitle())
                .setTextAlignment(TextAlignment.CENTER)
                .setFontSize(24)
                .setBold();
        document.add(title);

        // Add personal information
        document.add(new Paragraph("\n"));
        document.add(new Paragraph(resume.getName()).setBold().setFontSize(18));
        document.add(new Paragraph(resume.getJob()));
        document.add(new Paragraph(resume.getAddress()));
        document.add(new Paragraph(resume.getPhone()));
        document.add(new Paragraph(resume.getEmail()));

        // Add summary
        if (resume.getSummary() != null && !resume.getSummary().isEmpty()) {
            document.add(new Paragraph("\nSummary").setBold().setFontSize(16));
            document.add(new Paragraph(resume.getSummary()));
        }

        // Add experience
        if (resume.getExperience() != null && !resume.getExperience().isEmpty()) {
            document.add(new Paragraph("\nExperience").setBold().setFontSize(16));
            for (var exp : resume.getExperience()) {
                document.add(new Paragraph(exp.getTitle()).setBold());
                document.add(new Paragraph(exp.getCompany() + " - " + exp.getAddress()));
                document.add(new Paragraph(exp.getStartDate() + " - " + exp.getEndDate()));
                document.add(new Paragraph(exp.getSummary()));
                document.add(new Paragraph("\n"));
            }
        }

        // Add education
        if (resume.getEducation() != null && !resume.getEducation().isEmpty()) {
            document.add(new Paragraph("\nEducation").setBold().setFontSize(16));
            for (var edu : resume.getEducation()) {
                document.add(new Paragraph(edu.getName()).setBold());
                document.add(new Paragraph(edu.getAddress()));
                document.add(new Paragraph(edu.getQualification()));
                document.add(new Paragraph(edu.getYear()));
                document.add(new Paragraph("\n"));
            }
        }

        // Add skills
        if (resume.getSkills() != null && !resume.getSkills().isEmpty()) {
            document.add(new Paragraph("\nSkills").setBold().setFontSize(16));
            Table skillsTable = new Table(UnitValue.createPercentArray(2)).useAllAvailableWidth();
            for (var skill : resume.getSkills()) {
                skillsTable.addCell(new Cell().add(new Paragraph(skill.getName())));
                skillsTable.addCell(new Cell().add(new Paragraph(skill.getLevel())));
            }
            document.add(skillsTable);
        }

        document.close();
        return outputStream.toByteArray();
    }
} 