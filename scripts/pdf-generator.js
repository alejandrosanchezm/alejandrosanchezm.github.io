class PDFGenerator{constructor(){this.init()}init(){}async generatePDF(){document.getElementById("loadingIndicator");try{if(this.showLoading(!0),void 0!==window.jsPDF)await this.generatePDFViaLibrary();else{if(!this.canUseBrowserPrint())throw Error("No PDF generation method available");await this.generatePDFViaPrint()}window.cvApp&&window.cvApp.showSuccess("PDF generado correctamente")}catch(n){window.cvApp&&window.cvApp.showError("Error al generar el PDF")}finally{this.showLoading(!1)}}canUseBrowserPrint(){return window.print&&"function"==typeof window.print}async generatePDFViaPrint(){const n=this.createPrintableContent(),i=window.open("","_blank");i.document.write(n),i.document.close(),await this.waitForImages(i.document),i.focus(),i.print(),setTimeout(()=>{i.close()},1e3)}createPrintableContent(){const n=window.languageManager?window.languageManager.getTranslatedCVData():window.cvApp?window.cvApp.cvData:null;if(!n)throw Error("No CV data available");const i=window.languageManager?window.languageManager.getCurrentLanguage():"es",e=n=>window.languageManager?window.languageManager.getTranslation(n):n;return`\n<!DOCTYPE html>\n<html lang="${i}">\n<head>\n    <meta charset="UTF-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n    <title>${n.personalInfo.name} - ${n.personalInfo.title}</title>\n    <style>\n        * {\n            margin: 0;\n            padding: 0;\n            box-sizing: border-box;\n        }\n        \n        body {\n            font-family: 'Arial', sans-serif;\n            font-size: 14px;\n            line-height: 1.4;\n            color: #333;\n            background: white;\n            padding: 20px;\n        }\n        \n        .header {\n            text-align: center;\n            margin-bottom: 20px;\n            padding-bottom: 15px;\n            border-bottom: 2px solid #2563eb;\n        }\n        \n        .name {\n            font-size: 26px;\n            font-weight: bold;\n            color: #1f2937;\n            margin-bottom: 5px;\n        }\n        \n        .title {\n            font-size: 18px;\n            color: #2563eb;\n            font-weight: 600;\n            margin-bottom: 10px;\n        }\n        \n        .contact-info {\n            font-size: 12px;\n            color: #6b7280;\n        }\n        \n        .section {
            margin-bottom: 20px;
            page-break-inside: avoid;
        }
        
        .section-title {
            font-size: 16px;
            font-weight: bold;
            color: #1f2937;
            margin-bottom: 10px;
            padding-bottom: 3px;
            border-bottom: 1px solid #e5e7eb;
        }
        
        .experience-item,
        .education-item {
            margin-bottom: 15px;
            page-break-inside: avoid;
        }
        
        .item-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 5px;
        }
        
        .item-title {
            font-weight: bold;
            font-size: 14px;
            color: #1f2937;
        }
        
        .item-company {
            font-weight: 600;
            color: #2563eb;
            font-size: 13px;
        }
        
        .item-duration {
            font-size: 11px;
            color: #6b7280;
            text-align: right;
        }
        
        .item-description {
            margin-top: 5px;
            font-size: 12px;
            line-height: 1.3;
            color: #4b5563;
        }
        
        .skills-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
        }
        
        .skill-category {
            margin-bottom: 10px;
        }
        
        .skill-category-title {
            font-weight: bold;
            font-size: 13px;
            color: #1f2937;
            margin-bottom: 5px;
        }
        
        .skill-list {
            font-size: 11px;
            color: #4b5563;
            line-height: 1.3;
        }
        
        .technologies {
            margin-top: 5px;
            font-size: 11px;
            color: #6b7280;
        }
        
        .tech-item {
            display: inline;
            margin-right: 8px;
        }
        
        .tech-item:after {
            content: "•";
            margin-left: 8px;
            color: #d1d5db;
        }
        
        .tech-item:last-child:after {
            content: "";
        }
        
        .summary {
            font-size: 12px;
            line-height: 1.4;
            color: #4b5563;
            text-align: justify;
            margin-bottom: 15px;
        }
        
        @media print {
            body { margin: 0; padding: 15px; }
            .section { page-break-inside: avoid; }
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="name">${n.personalInfo.name}</div>
        <div class="title">${n.personalInfo.title}</div>
        <div class="contact-info">
            ${n.personalInfo.email} | ${n.personalInfo.phone} | ${n.personalInfo.location}
            <br>
            ${n.personalInfo.linkedin}
        </div>
    </div>
    
    <div class="section">
        <div class="section-title">${e("about").toUpperCase()}</div>
        <div class="summary">${n.summary}</div>
    </div>
    
    <div class="section">
        <div class="section-title">${e("experienceTitle").toUpperCase()}</div>
        ${(() => { const itExp = n.experience? n.experience.filter(x=>x.category!=="other"):[]; return itExp.map(n=>`
            <div class="experience-item">
                <div class="item-header">
                    <div>
                        <div class="item-title">${n.position}</div>
                        <div class="item-company">${n.company}</div>
                        ${n.sector?`<div style="font-size: 11px; color: #6b7280; margin-top: 2px;">${n.sector}</div>`:""}
                    </div>
                    <div class="item-duration">
                        ${n.duration}<br>
                        ${n.location}
                        ${n.type?`<br><span style="font-size: 10px; color: #6b7280;">${n.type}</span>`:""}
                    </div>
                </div>
                <div class="item-description">${n.description}</div>
                ${n.careerProgression&&n.careerProgression.length>0?`
                    <div style="margin-top: 8px; padding-left: 12px; border-left: 2px solid #e5e7eb;">
                        <div style="font-size: 12px; font-weight: bold; color: #1f2937; margin-bottom: 4px;">
                            ${"es"===i?"Progresión Profesional:":"Career Progression:"}
                        </div>
                        ${n.careerProgression.map(n=>`
                            <div style="margin-bottom: 6px;">
                                <div style="font-size: 12px; font-weight: 600; color: #2563eb;">
                                    ${n.role} (${n.period})
                                </div>
                                <div style="font-size: 11px; color: #4b5563; line-height: 1.3;">
                                    ${n.responsibilities}
                                </div>
                            </div>
                        `).join("")}
                    </div>
                `:""}
                ${n.keyTasks&&n.keyTasks.length>0?`
                    <div style="margin-top: 6px;">
                        <div style="font-size: 11px; font-weight: bold; color: #1f2937;">
                            ${"es"===i?"Tareas Clave:":"Key Tasks:"}
                        </div>
                        <div style="font-size: 11px; color: #4b5563;">
                            ${n.keyTasks.join(" • ")}
                        </div>
                    </div>
                `:""}
                ${n.technologies&&n.technologies.length>0?`
                    <div class="technologies">
                        <strong>${"es"===i?"Tecnologías":"Technologies"}:</strong> 
                        ${n.technologies.map(n=>`<span class="tech-item">${n}</span>`).join("")}
                    </div>
                `:""}
            </div>
        `).join("") })()}
    </div>
    
    ${(() => { const otherExp = n.experience? n.experience.filter(x=>x.category==="other"):[]; if(otherExp.length===0){ return "";} const otherTitle = i==="es"?"EXPERIENCIA FUERA DEL SECTOR DEL SOFTWARE":"EXPERIENCE OUTSIDE THE SOFTWARE SECTOR"; return `
    <div class="section">
        <div class="section-title">${otherTitle}</div>
        ${otherExp.map(n=>`
            <div class="experience-item">
                <div class="item-header">
                    <div>
                        <div class="item-title">${n.position}</div>
                        <div class="item-company">${n.company}</div>
                        ${n.sector?`<div style="font-size: 11px; color: #6b7280; margin-top: 2px;">${n.sector}</div>`:""}
                    </div>
                    <div class="item-duration">
                        ${n.duration}<br>
                        ${n.location}
                        ${n.type?`<br><span style="font-size: 10px; color: #6b7280;">${n.type}</span>`:""}
                    </div>
                </div>
                <div class="item-description">${n.description}</div>
                ${n.keyTasks&&n.keyTasks.length>0?`
                    <div style="margin-top: 6px;">
                        <div style="font-size: 11px; font-weight: bold; color: #1f2937;">
                            ${"es"===i?"Tareas Clave:":"Key Tasks:"}
                        </div>
                        <div style="font-size: 11px; color: #4b5563;">
                            ${n.keyTasks.join(" • ")}
                        </div>
                    </div>
                `:""}
            </div>
        `).join("")}
    </div>` })()}
    
    <div class="section">
        <div class="section-title">${e("educationTitle").toUpperCase()}</div>
        ${n.education.map(n=>`
            <div class="education-item">
                <div class="item-header">
                    <div>
                        <div class="item-title">${n.degree}</div>
                        <div class="item-company">${n.institution}</div>
                        ${n.note?`<div style="font-size: 11px; color: #f59e0b; font-weight: 600;">${n.note}</div>`:""}
                    </div>
                    <div class="item-duration">
                        ${n.duration}<br>
                        ${n.location}
                    </div>
                </div>
            </div>
        `).join("")}
    </div>
    
    <div class="section">
        <div class="section-title">${e("skillsTitle").toUpperCase()}</div>
        <div class="skills-grid">
            <div class="skill-category">
                <div class="skill-category-title">${e("backendAPIs")}</div>
                <div class="skill-list">${n.skills.backend?n.skills.backend.map(n=>n.name||n).join(", "):""}</div>
            </div>
            <div class="skill-category">
                <div class="skill-category-title">${e("frontendUI")}</div>
                <div class="skill-list">${n.skills.frontend?n.skills.frontend.map(n=>n.name||n).join(", "):""}</div>
            </div>
            <div class="skill-category">
                <div class="skill-category-title">${e("databases")}</div>
                <div class="skill-list">${n.skills.databases?n.skills.databases.map(n=>n.name||n).join(", "):""}</div>
            </div>
            <div class="skill-category">
                <div class="skill-category-title">${e("devopsTools")}</div>
                <div class="skill-list">${n.skills.infrastructure?n.skills.infrastructure.map(n=>n.name||n).join(", "):""}</div>
            </div>
            <div class="skill-category">
                <div class="skill-category-title">${e("dataScience")}</div>
                <div class="skill-list">${n.skills.dataScience?n.skills.dataScience.map(n=>n.name||n).join(", "):""}</div>
            </div>
            <div class="skill-category">
                <div class="skill-category-title">${e("mobile")}</div>
                <div class="skill-list">${n.skills.mobile?n.skills.mobile.map(n=>n.name||n).join(", "):""}</div>
            </div>
        </div>
    </div>
    
    ${n.projects&&n.projects.length>0?`
    <div class="section">
        <div class="section-title">${e("projectsTitle").toUpperCase()}</div>
        ${n.projects.map(n=>`
            <div class="experience-item">
                <div class="item-header">
                    <div>
                        <div class="item-title">${n.title}</div>
                        <div class="item-company">${n.company}</div>
                        ${n.type?`<div style="font-size: 11px; color: #f59e0b; font-weight: 600;">${n.type}</div>`:""}
                    </div>
                    <div class="item-duration">${n.duration}</div>
                </div>
                <div class="item-description">${n.description}</div>
                ${n.technologies&&n.technologies.length>0?`
                    <div class="technologies">
                        <strong>${"es"===i?"Tecnologías":"Technologies"}:</strong> 
                        ${n.technologies.map(n=>`<span class="tech-item">${n}</span>`).join("")}
                    </div>
                `:""}
            </div>
        `).join("")}
    </div>
    `:""}
    
    ${n.certifications&&n.certifications.length>0?`
    <div class="section">
        <div class="section-title">${e("certificationsTitle").toUpperCase()}</div>
        ${n.certifications.map(n=>`
            <div class="experience-item">
                <div class="item-header">
                    <div>
                        <div class="item-title">${n.title}</div>
                        <div class="item-company">${n.issuer}</div>
                    </div>
                    <div class="item-duration">${n.date}</div>
                </div>
                ${n.description?`<div class="item-description">${n.description}</div>`:""}
            </div>
        `).join("")}
    </div>
    `:""}
    
    ${n.languages&&n.languages.length>0?`
    <div class="section">
        <div class="section-title">${e("languagesTitle").toUpperCase()}</div>
        <div class="skill-list">
            ${n.languages.map(n=>`${n.language}: ${n.level}`).join(" | ")}
        </div>
    </div>
    `:""}
</body>
</html>`}async waitForImages(n){const i=n.querySelectorAll("img"),e=Array.from(i).map(n=>new Promise(i=>{n.complete?i():(n.onload=i,n.onerror=i,setTimeout(i,3e3))}));return await Promise.all(e),new Promise(n=>setTimeout(n,500))}async generatePDFViaLibrary(){try{if(void 0===window.jsPDF)throw Error("jsPDF library not loaded");const{jsPDF:n}=window.jsPDF,i=new n({orientation:"portrait",unit:"mm",format:"a4"}),e=window.languageManager?window.languageManager.getTranslatedCVData():window.CV_DATA,t=window.languageManager?window.languageManager.getCurrentLanguage():"es";await this.generatePDFContent(i,e,t);const o=`CV_${e.personalInfo.name.replace(/\s+/g,"_")}_${t.toUpperCase()}.pdf`;return i.save(o),!0}catch(n){throw Error("Error generando PDF: "+n.message)}}async generatePDFContent(n,i,e){n.setFont("helvetica");const __origSetFontSize=n.setFontSize.bind(n);n.setFontSize=(sz)=>__origSetFontSize(sz+2);let t=20;const o=20,s=n.internal.pageSize.width-40,d=(i,e,t,o,s=10,d="normal")=>{n.setFontSize(s),n.setFont("helvetica",d);const a=n.splitTextToSize(i,o);return n.text(a,e,t),t+.35*a.length*s},a=i=>{t+i>280&&(n.addPage(),t=20)};n.setFontSize(20),n.setFont("helvetica","bold"),n.text(i.personalInfo.name,o,t),t+=10,n.setFontSize(14),n.setFont("helvetica","normal"),n.text(i.personalInfo.title,o,t),t+=15,n.setFontSize(10),[i.personalInfo.email,i.personalInfo.phone,i.personalInfo.location,i.personalInfo.linkedin,i.personalInfo.github].filter(Boolean).forEach(i=>{n.text(i,o,t),t+=5}),t+=10,a(30);const l=window.languageManager?window.languageManager.getTranslation("about").toUpperCase():"PERFIL PROFESIONAL";n.setFontSize(12),n.setFont("helvetica","bold"),n.text(l,o,t),t+=8,t=d(i.summary,o,t,s,10),t+=10;const itEntries=(i.experience||[]).filter(x=>x.category!=="other"),otherEntries=(i.experience||[]).filter(x=>x.category==="other"),lang=e||"es",itTitle=window.languageManager?window.languageManager.getTranslation("experience").toUpperCase():(lang==="en"?"EXPERIENCE":"EXPERIENCIA PROFESIONAL"),otherTitle=lang==="es"?"EXPERIENCIA FUERA DEL SECTOR DEL SOFTWARE":"EXPERIENCE OUTSIDE THE SOFTWARE SECTOR";t=await this.addExperienceSection(n,i,t,o,s,a,d,itEntries,itTitle),otherEntries.length>0&&(t=await this.addExperienceSection(n,i,t,o,s,a,d,otherEntries,otherTitle)),t=await this.addEducationSection(n,i,t,o,s,a,d),i.projects&&i.projects.length>0&&(t=await this.addProjectsSection(n,i,t,o,s,a,d)),i.certifications&&i.certifications.length>0&&(t=await this.addCertificationsSection(n,i,t,o,s,a,d))}async addExperienceSection(n,i,e,t,o,s,d,entries,customTitle){s(40);const a=customTitle||(window.languageManager?window.languageManager.getTranslation("experience").toUpperCase():"EXPERIENCIA PROFESIONAL");return n.setFontSize(12),n.setFont("helvetica","bold"),n.text(a,t,e),e+=8,(entries||i.experience||[]).forEach(i=>{if(s(25),n.setFontSize(11),n.setFont("helvetica","bold"),n.text(`${i.position} - ${i.company}`,t,e),e+=6,n.setFontSize(9),n.setFont("helvetica","italic"),n.text(`${i.period} | ${i.location}`,t,e),e+=6,i.description&&(e=d(i.description,t,e,o,9),e+=3),i.careerProgression&&i.careerProgression.length>0&&i.careerProgression.forEach(i=>{n.setFontSize(9),n.setFont("helvetica","bold"),n.text(`• ${i.role} (${i.period})`,t+5,e),e+=4,i.responsibilities&&i.responsibilities.length>0&&i.responsibilities.forEach(n=>{e=d("  - "+n,t+10,e,o-10,8),e+=1}),e+=2}),i.keyTasks&&i.keyTasks.length>0){const s=window.languageManager?window.languageManager.getTranslation("keyTasks"):"Tareas clave";n.setFontSize(9),n.setFont("helvetica","bold"),n.text(s+":",t+5,e),e+=4,i.keyTasks.forEach(n=>{e=d("• "+n,t+10,e,o-10,8),e+=1})}if(i.technologies&&i.technologies.length>0){const s=window.languageManager?window.languageManager.getTranslation("technologies"):"Tecnologías";n.setFontSize(9),n.setFont("helvetica","bold"),n.text(s+": ",t+5,e),n.setFont("helvetica","normal");const a=i.technologies.join(", ");e=d(a,t+25,e,o-25,8)}e+=8}),e}async addEducationSection(n,i,e,t,o,s,d){s(30);const a=window.languageManager?window.languageManager.getTranslation("education").toUpperCase():"EDUCACIÓN";return n.setFontSize(12),n.setFont("helvetica","bold"),n.text(a,t,e),e+=8,i.education.forEach(i=>{s(15),n.setFontSize(11),n.setFont("helvetica","bold"),n.text(i.degree,t,e),e+=6,n.setFontSize(9),n.setFont("helvetica","italic"),n.text(`${i.institution} | ${i.period}`,t,e),e+=6,i.description&&(e=d(i.description,t,e,o,9)),e+=8}),e}async addProjectsSection(n,i,e,t,o,s,d){s(30);const a=window.languageManager?window.languageManager.getTranslation("projects").toUpperCase():"PROYECTOS";return n.setFontSize(12),n.setFont("helvetica","bold"),n.text(a,t,e),e+=8,i.projects.forEach(i=>{if(s(15),n.setFontSize(11),n.setFont("helvetica","bold"),n.text(i.name,t,e),e+=6,i.type&&(n.setFontSize(9),n.setFont("helvetica","italic"),n.text(i.type,t,e),e+=4),i.description&&(e=d(i.description,t,e,o,9),e+=3),i.technologies&&i.technologies.length>0){const s=window.languageManager?window.languageManager.getTranslation("technologies"):"Tecnologías";n.setFontSize(9),n.setFont("helvetica","bold"),n.text(s+": ",t,e),n.setFont("helvetica","normal");const a=i.technologies.join(", ");e=d(a,t+25,e,o-25,8)}e+=8}),e}async addCertificationsSection(n,i,e,t,o,s,d){s(30);const a=window.languageManager?window.languageManager.getTranslation("certifications").toUpperCase():"CERTIFICACIONES";return n.setFontSize(12),n.setFont("helvetica","bold"),n.text(a,t,e),e+=8,i.certifications.forEach(i=>{s(10),n.setFontSize(10),n.setFont("helvetica","bold"),n.text("• "+i.name,t,e),e+=5,i.issuer&&(n.setFontSize(9),n.setFont("helvetica","italic"),n.text("  "+i.issuer,t+5,e),e+=4),i.date&&(n.setFontSize(8),n.setFont("helvetica","normal"),n.text("  "+i.date,t+5,e),e+=4),e+=2}),e}showLoading(n){const i=document.getElementById("loadingIndicator");i&&i.classList.toggle("hidden",!n)}}document.addEventListener("DOMContentLoaded",()=>{window.pdfGenerator=new PDFGenerator}),"undefined"!=typeof module&&module.exports&&(module.exports=PDFGenerator);