package com.esprit.userAuth.service;

import com.esprit.userAuth.entity.Education;
import com.esprit.userAuth.entity.Experience;
import com.esprit.userAuth.entity.Resume;
import com.esprit.userAuth.entity.Skill;
import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.kernel.colors.DeviceRgb;
import com.itextpdf.kernel.geom.PageSize;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.borders.Border;
import com.itextpdf.layout.borders.SolidBorder;
import com.itextpdf.layout.element.*;
import com.itextpdf.layout.properties.HorizontalAlignment;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import com.itextpdf.layout.properties.VerticalAlignment;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PDFService {

    // Define colors
    private static final DeviceRgb BACKGROUND_COLOR = new DeviceRgb(240, 240, 240);
    private static final DeviceRgb WHITE_COLOR = new DeviceRgb(255, 255, 255); // Pure white
    private static final DeviceRgb SECTION_TITLE_COLOR = new DeviceRgb(2, 117, 216); // #0275d8 blue color
    private static final DeviceRgb TEXT_COLOR = new DeviceRgb(51, 51, 51);
    private static final DeviceRgb SUBTITLE_COLOR = new DeviceRgb(102, 102, 102);

    public byte[] generateCV(Resume resume) throws IOException {
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        PdfWriter writer = new PdfWriter(outputStream);
        PdfDocument pdf = new PdfDocument(writer);
        Document document = new Document(pdf, PageSize.A4);
        document.setMargins(50, 50, 50, 50);

        // List to hold all sections in order
        List<Div> sections = new ArrayList<>();

        // Main container with gray background
        Div mainContainer = new Div();
        mainContainer.setBackgroundColor(BACKGROUND_COLOR);
        mainContainer.setPadding(20);

        // Header section (white background)
        Div headerSection = new Div();
        headerSection.setBackgroundColor(WHITE_COLOR);
        headerSection.setPadding(20);
        headerSection.setMarginBottom(15);
        
        // Name
        Paragraph nameParagraph = new Paragraph(resume.getName())
                .setTextAlignment(TextAlignment.CENTER)
                .setFontSize(16)
                .setBold()
                .setFontColor(TEXT_COLOR);
        headerSection.add(nameParagraph);
        
        // Job title
        Paragraph jobParagraph = new Paragraph(resume.getJob())
                .setTextAlignment(TextAlignment.CENTER)
                .setFontSize(13)
                .setMarginTop(3)
                .setFontColor(TEXT_COLOR);
        headerSection.add(jobParagraph);
        
        // Address
        if (resume.getAddress() != null && !resume.getAddress().isEmpty()) {
            Paragraph addressParagraph = new Paragraph(resume.getAddress())
                    .setTextAlignment(TextAlignment.CENTER)
                    .setFontSize(9)
                    .setMarginTop(5)
                    .setFontColor(SUBTITLE_COLOR);
            headerSection.add(addressParagraph);
        }
        
        // Contact info row
        Div contactDiv = new Div();
        contactDiv.setTextAlignment(TextAlignment.CENTER);
        contactDiv.setMarginTop(8);
        
        StringBuilder contactText = new StringBuilder();
        if (resume.getPhone() != null && !resume.getPhone().isEmpty()) {
            contactText.append(resume.getPhone());
        }
        
        if (resume.getEmail() != null && !resume.getEmail().isEmpty()) {
            if (contactText.length() > 0) {
                contactText.append("     ");
            }
            contactText.append(resume.getEmail());
        }
        
        Paragraph contactParagraph = new Paragraph(contactText.toString())
                .setTextAlignment(TextAlignment.CENTER)
                .setFontSize(9)
                .setFontColor(SUBTITLE_COLOR);
        contactDiv.add(contactParagraph);
        
        headerSection.add(contactDiv);
        sections.add(headerSection);

        // Add summary section if available
        if (resume.getSummary() != null && !resume.getSummary().isEmpty()) {
            Div summarySection = new Div();
            summarySection.setBackgroundColor(WHITE_COLOR);
            summarySection.setPadding(20);
            summarySection.setMarginBottom(15);
            
            // Section title with blue color
            Paragraph summaryTitle = new Paragraph("Summary")
                    .setFontSize(10)
                    .setBold()
                    .setFontColor(SECTION_TITLE_COLOR);
            summarySection.add(summaryTitle);
            
            // Add divider line
            Div divider = new Div();
            divider.setHeight(1);
            divider.setBackgroundColor(new DeviceRgb(224, 224, 224));
            divider.setMarginTop(3);
            divider.setMarginBottom(10);
            summarySection.add(divider);
            
            Paragraph summaryContent = new Paragraph(resume.getSummary())
                    .setFontSize(9)
                    .setFontColor(TEXT_COLOR);
            summarySection.add(summaryContent);
            
            sections.add(summarySection);
        }

        // Add Experience section
        if (resume.getExperience() != null && !resume.getExperience().isEmpty()) {
            Div experienceSection = new Div();
            experienceSection.setBackgroundColor(WHITE_COLOR);
            experienceSection.setPadding(12);
            experienceSection.setMarginBottom(10);
            
            // Section title with blue color
            Paragraph expTitle = new Paragraph("Experience")
                    .setFontSize(11)
                    .setBold()
                    .setFontColor(SECTION_TITLE_COLOR);
            experienceSection.add(expTitle);
            
            // Add divider line
            Div divider = new Div();
            divider.setHeight(1);
            divider.setBackgroundColor(new DeviceRgb(224, 224, 224));
            divider.setMarginTop(3);
            divider.setMarginBottom(10);
            experienceSection.add(divider);
            
            // Add each experience item
            for (var exp : resume.getExperience()) {
                Div expItem = new Div();
                expItem.setMarginBottom(15);
                
                // Job title and date range in a row
                Table headerTable = new Table(2);
                headerTable.setWidth(UnitValue.createPercentValue(100));
                
                Cell jobTitleCell = new Cell();
                jobTitleCell.add(new Paragraph(exp.getTitle()).setBold().setFontSize(13).setFontColor(TEXT_COLOR));
                jobTitleCell.setBorder(Border.NO_BORDER);
                
                String dateText = "";
                if (exp.getStartDate() != null && !exp.getStartDate().isEmpty()) {
                    dateText += exp.getStartDate();
                    if (exp.getEndDate() != null && !exp.getEndDate().isEmpty()) {
                        dateText += " - " + exp.getEndDate();
                    } else {
                        dateText += " - Present";
                    }
                }
                
                Cell dateCell = new Cell();
                dateCell.add(new Paragraph(dateText).setFontSize(11).setTextAlignment(TextAlignment.RIGHT).setFontColor(SUBTITLE_COLOR));
                dateCell.setBorder(Border.NO_BORDER);
                dateCell.setTextAlignment(TextAlignment.RIGHT);
                
                headerTable.addCell(jobTitleCell);
                headerTable.addCell(dateCell);
                expItem.add(headerTable);
                
                // Company and location
                if (exp.getCompany() != null && !exp.getCompany().isEmpty()) {
                    String companyText = exp.getCompany();
                    if (exp.getAddress() != null && !exp.getAddress().isEmpty()) {
                        companyText += " - " + exp.getAddress();
                    }
                    
                    Paragraph companyParagraph = new Paragraph(companyText)
                            .setFontSize(9)
                            .setItalic()
                            .setFontColor(SUBTITLE_COLOR)
                            .setMarginTop(2)
                            .setMarginBottom(3);
                    expItem.add(companyParagraph);
                }
                
                // Description
                if (exp.getSummary() != null && !exp.getSummary().isEmpty()) {
                    Paragraph summaryParagraph = new Paragraph(exp.getSummary())
                            .setFontSize(9)
                            .setFontColor(TEXT_COLOR)
                            .setMarginTop(3);
                    expItem.add(summaryParagraph);
                }
                
                experienceSection.add(expItem);
                
                // Add separator if not the last item
                if (resume.getExperience().indexOf(exp) < resume.getExperience().size() - 1) {
                    Div separator = new Div();
                    separator.setHeight(1);
                    separator.setBackgroundColor(new DeviceRgb(240, 240, 240));
                    separator.setMarginTop(10);
                    separator.setMarginBottom(10);
                    experienceSection.add(separator);
                }
            }
            
            sections.add(experienceSection);
        }

        // Add education section
        if (resume.getEducation() != null && !resume.getEducation().isEmpty()) {
            Div educationSection = new Div();
            educationSection.setBackgroundColor(WHITE_COLOR);
            educationSection.setPadding(20);
            educationSection.setMarginBottom(15);
            
            // Section title with blue color
            Paragraph educationTitle = new Paragraph("Education")
                    .setFontSize(12)
                    .setBold()
                    .setFontColor(SECTION_TITLE_COLOR);
            educationSection.add(educationTitle);
            
            // Add divider line
            Div divider = new Div();
            divider.setHeight(1);
            divider.setBackgroundColor(new DeviceRgb(224, 224, 224));
            divider.setMarginTop(3);
            divider.setMarginBottom(10);
            educationSection.add(divider);
            
            for (Education edu : resume.getEducation()) {
                Div eduItem = new Div();
                eduItem.setMarginBottom(15);
                
                Table headerTable = new Table(UnitValue.createPercentArray(new float[]{70, 30}));
                headerTable.setWidth(UnitValue.createPercentValue(100));
                
                Cell degreeCell = new Cell();
                degreeCell.add(new Paragraph(edu.getQualification()).setBold().setFontSize(13).setFontColor(TEXT_COLOR));
                degreeCell.setBorder(Border.NO_BORDER);
                
                String dateText = "";
                if (edu.getYear() != null && !edu.getYear().isEmpty()) {
                    dateText += edu.getYear();

                }
                
                Cell dateCell = new Cell();
                dateCell.add(new Paragraph(dateText).setFontSize(11).setTextAlignment(TextAlignment.RIGHT).setFontColor(SUBTITLE_COLOR));
                dateCell.setBorder(Border.NO_BORDER);
                dateCell.setTextAlignment(TextAlignment.RIGHT);
                
                headerTable.addCell(degreeCell);
                headerTable.addCell(dateCell);
                eduItem.add(headerTable);
                
                // Institution and location
                if (edu.getName() != null && !edu.getName().isEmpty()) {
                    String institutionText = edu.getName();
                    if (edu.getAddress() != null && !edu.getAddress().isEmpty()) {
                        institutionText += " - " + edu.getAddress();
                    }
                    
                    Paragraph institutionParagraph = new Paragraph(institutionText)
                            .setFontSize(11)
                            .setItalic()
                            .setFontColor(SUBTITLE_COLOR)
                            .setMarginTop(2)
                            .setMarginBottom(3);
                    eduItem.add(institutionParagraph);
                }

                
                educationSection.add(eduItem);
            }
            
            sections.add(educationSection);
        }
        
        // Add skills section if present
        if (resume.getSkills() != null && !resume.getSkills().isEmpty()) {
            Div skillsSection = new Div();
            skillsSection.setBackgroundColor(WHITE_COLOR);
            skillsSection.setPadding(20);
            skillsSection.setMarginBottom(15);
            
            // Section title with blue color
            Paragraph skillsTitle = new Paragraph("Skills")
                    .setFontSize(12)
                    .setBold()
                    .setFontColor(SECTION_TITLE_COLOR);
            skillsSection.add(skillsTitle);
            
            // Add divider line
            Div divider = new Div();
            divider.setHeight(1);
            divider.setBackgroundColor(new DeviceRgb(224, 224, 224));
            divider.setMarginTop(3);
            divider.setMarginBottom(10);
            skillsSection.add(divider);
            
            // Create a two-column layout for skills
            Table skillsTable = new Table(UnitValue.createPercentArray(new float[]{50, 50}));
            skillsTable.setWidth(UnitValue.createPercentValue(100));
            
            List<String> skillsList = resume.getSkills().stream()
                    .map(Skill::getName)
                    .collect(Collectors.toList());
            
            // Determine how many skills per column
            int totalSkills = skillsList.size();
            int skillsPerColumn = (totalSkills + 1) / 2;
            
            // First column of skills
            Cell cell1 = new Cell();
            cell1.setBorder(Border.NO_BORDER);
            cell1.setPadding(5);
            
            // Second column of skills
            Cell cell2 = new Cell();
            cell2.setBorder(Border.NO_BORDER);
            cell2.setPadding(5);
            
            for (int i = 0; i < totalSkills; i++) {
                Paragraph skillParagraph = new Paragraph("• " + skillsList.get(i))
                        .setFontSize(9)
                        .setFontColor(TEXT_COLOR);
                
                if (i < skillsPerColumn) {
                    cell1.add(skillParagraph);
                } else {
                    cell2.add(skillParagraph);
                }
            }
            
            skillsTable.addCell(cell1);
            skillsTable.addCell(cell2);
            
            skillsSection.add(skillsTable);
            sections.add(skillsSection);
        }

        // Add all sections to the main container in order
        for (Div section : sections) {
            mainContainer.add(section);
        }

        document.add(mainContainer);
        document.close();
        return outputStream.toByteArray();
    }
} 